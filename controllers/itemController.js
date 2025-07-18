import express from 'express'
import Item from '../models/itemModel.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - tipo
 *         - efecto
 *         - valor
 *       properties:
 *         id:
 *           type: number
 *           description: ID único del ítem
 *         nombre:
 *           type: string
 *           description: Nombre del ítem
 *         tipo:
 *           type: string
 *           enum: [comida, medicina, juguete, cura]
 *           description: Tipo de ítem
 *         efecto:
 *           type: string
 *           enum: [salud, felicidad, ambos]
 *           description: Efecto que produce el ítem
 *         valor:
 *           type: number
 *           description: Cantidad que restaura el ítem
 *         precio:
 *           type: number
 *           default: 0
 *           description: Precio del ítem (0 para items gratuitos)
 *         esGratuito:
 *           type: boolean
 *           default: true
 *           description: Indica si el ítem es gratuito
 *         descripcion:
 *           type: string
 *           description: Descripción del ítem
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del ítem
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtener todos los ítems
 *     description: Retorna una lista de todos los ítems disponibles en el sistema
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [comida, medicina, juguete, cura]
 *         description: Filtrar por tipo de ítem
 *       - in: query
 *         name: efecto
 *         schema:
 *           type: string
 *           enum: [salud, felicidad, ambos]
 *         description: Filtrar por efecto del ítem
 *       - in: query
 *         name: esGratuito
 *         schema:
 *           type: boolean
 *         description: Filtrar por items gratuitos o de pago
 *       - in: query
 *         name: precioMin
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: precioMax
 *         schema:
 *           type: number
 *         description: Precio máximo
 *     responses:
 *       200:
 *         description: Lista de ítems obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: Número total de ítems
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// GET /api/items - Listar todos los ítems con filtros
router.get('/items', async (req, res) => {
    try {
        const { tipo, efecto, esGratuito, precioMin, precioMax } = req.query
        
        // Construir filtro
        let filter = {}
        
        if (tipo) filter.tipo = tipo
        if (efecto) filter.efecto = efecto
        if (esGratuito !== undefined) filter.esGratuito = esGratuito === 'true'
        if (precioMin || precioMax) {
            filter.precio = {}
            if (precioMin) filter.precio.$gte = Number(precioMin)
            if (precioMax) filter.precio.$lte = Number(precioMax)
        }
        
        const items = await Item.find(filter).sort({ id: 1 })
        res.json({ total: items.length, items })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de ítems
 *     description: Retorna estadísticas generales sobre los ítems
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Estadísticas de ítems
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: number
 *                 porTipo:
 *                   type: object
 *                 porEfecto:
 *                   type: object
 *                 gratuitos:
 *                   type: number
 *                 dePago:
 *                   type: number
 *                 precioPromedio:
 *                   type: number
 *       401:
 *         description: No autorizado - Se requiere API Key
 */
// GET /api/items/estadisticas - Obtener estadísticas
router.get('/items/estadisticas', async (req, res) => {
    try {
        const totalItems = await Item.countDocuments()
        const gratuitos = await Item.countDocuments({ esGratuito: true })
        const dePago = await Item.countDocuments({ esGratuito: false })
        
        // Estadísticas por tipo
        const porTipo = await Item.aggregate([
            { $group: { _id: '$tipo', count: { $sum: 1 } } }
        ])
        
        // Estadísticas por efecto
        const porEfecto = await Item.aggregate([
            { $group: { _id: '$efecto', count: { $sum: 1 } } }
        ])
        
        // Precio promedio de items de pago
        const precioPromedio = await Item.aggregate([
            { $match: { esGratuito: false } },
            { $group: { _id: null, promedio: { $avg: '$precio' } } }
        ])
        
        const estadisticas = {
            totalItems,
            gratuitos,
            dePago,
            porTipo: porTipo.reduce((acc, item) => {
                acc[item._id] = item.count
                return acc
            }, {}),
            porEfecto: porEfecto.reduce((acc, item) => {
                acc[item._id] = item.count
                return acc
            }, {}),
            precioPromedio: precioPromedio.length > 0 ? Math.round(precioPromedio[0].promedio) : 0
        }
        
        res.json(estadisticas)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/gratuitos:
 *   get:
 *     summary: Obtener ítems gratuitos
 *     description: Retorna todos los ítems que son gratuitos
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de ítems gratuitos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 */
// GET /api/items/gratuitos - Obtener ítems gratuitos
router.get('/items/gratuitos', async (req, res) => {
    try {
        const items = await Item.find({ esGratuito: true }).sort({ id: 1 })
        res.json({ total: items.length, items })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/buscar:
 *   get:
 *     summary: Buscar ítems por nombre
 *     description: Busca ítems que contengan el término especificado en su nombre
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       400:
 *         description: Término de búsqueda requerido
 */
// GET /api/items/buscar - Buscar ítems por nombre
router.get('/items/buscar', async (req, res) => {
    try {
        const { q } = req.query
        
        if (!q) {
            return res.status(400).json({ error: 'Término de búsqueda requerido' })
        }
        
        const items = await Item.find({
            nombre: { $regex: q, $options: 'i' }
        }).sort({ id: 1 })
        
        res.json({ total: items.length, items })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/tipo/{tipo}:
 *   get:
 *     summary: Obtener ítems por tipo
 *     description: Retorna todos los ítems de un tipo específico
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [comida, medicina, juguete, cura]
 *         description: Tipo de ítem
 *     responses:
 *       200:
 *         description: Lista de ítems del tipo especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       400:
 *         description: Tipo inválido
 */
// GET /api/items/tipo/:tipo - Obtener ítems por tipo
router.get('/items/tipo/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params
        const tiposValidos = ['comida', 'medicina', 'juguete', 'cura']
        
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({ error: 'Tipo de ítem inválido' })
        }
        
        const items = await Item.find({ tipo }).sort({ id: 1 })
        res.json({ total: items.length, items })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtener un ítem por ID
 *     description: Retorna un ítem específico por su ID
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem
 *     responses:
 *       200:
 *         description: Ítem encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Ítem no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ítem no encontrado"
 *       500:
 *         description: Error del servidor
 */
// GET /api/items/:id - Obtener un ítem por ID
router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        if (!item) {
            return res.status(404).json({ error: 'Ítem no encontrado' })
        }
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Crear un nuevo ítem
 *     description: Crea un nuevo ítem en el sistema
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Ítem creado exitosamente"
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// POST /api/items - Crear un nuevo ítem
router.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body)
        const savedItem = await newItem.save()
        res.status(201).json({ mensaje: 'Ítem creado exitosamente', item: savedItem })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Actualizar un ítem
 *     description: Actualiza un ítem existente por su ID
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Ítem actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Ítem actualizado exitosamente"
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Ítem no encontrado
 *       400:
 *         description: Datos inválidos
 */
// PUT /api/items/:id - Actualizar un ítem
router.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        
        if (!updatedItem) {
            return res.status(404).json({ error: 'Ítem no encontrado' })
        }
        
        res.json({ mensaje: 'Ítem actualizado exitosamente', item: updatedItem })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Eliminar un ítem
 *     description: Elimina un ítem del sistema por su ID
 *     tags: [Items]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a eliminar
 *     responses:
 *       200:
 *         description: Ítem eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Ítem eliminado exitosamente"
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Ítem no encontrado
 *       500:
 *         description: Error del servidor
 */
// DELETE /api/items/:id - Eliminar un ítem
router.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id)
        
        if (!deletedItem) {
            return res.status(404).json({ error: 'Ítem no encontrado' })
        }
        
        res.json({ mensaje: 'Ítem eliminado exitosamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router 
