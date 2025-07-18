import express from "express";
import { check, validationResult } from 'express-validator';
import mascotaRepository from "../repositories/mascotaRepository.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     Bearer: {
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Bearer (apitoken) - JWT token obtenido al iniciar sesión
 *   schemas:
 *     Mascota:
 *       type: object
 *       required:
 *         - tipo
 *         - superpoder
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la mascota
 *         tipo:
 *           type: string
 *           description: Tipo de mascota (perro, gato, etc.)
 *         superpoder:
 *           type: string
 *           description: Superpoder especial de la mascota

 *         felicidad:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Nivel de felicidad de la mascota
 *         estado:
 *           type: string
 *           enum: [Sunny, Gipsy, Sick, Happy, Sad, Dead]
 *           description: Estado emocional actual
 *         enfermo:
 *           type: boolean
 *           description: Si la mascota está enferma
 *         ultimoCuidado:
 *           type: string
 *           format: date-time
 *           description: Última vez que fue cuidada
 *         viva:
 *           type: boolean
 *           description: Si la mascota está viva
 *         fechaMuerte:
 *           type: string
 *           format: date-time
 *           description: Fecha de muerte si aplica
 *         causaMuerte:
 *           type: string
 *           description: Causa de la muerte si aplica
 *       example:
 *         id: 1
 *         tipo: "Dragón"
 *         superpoder: "Lanzar fuego"

 *         felicidad: 90
 *         estado: "Sunny"
 *         enfermo: false
 *         ultimoCuidado: "2024-01-15T10:30:00.000Z"
 *         viva: true
 */

/**
 * @swagger
 * /api/mascotas:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     description: Endpoint protegido que requiere autenticación
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Mascota'
 *       500:
 *         description: Error del servidor
 */
router.get("/mascotas", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const mascotas = await mascotaRepository.obtenerTodasLasMascotas(req.userId);
        res.json({
            total: mascotas.length,
            mascotas: mascotas,
            mensaje: `Tienes ${mascotas.length} mascotas en total`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - superpoder
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de mascota
 *               superpoder:
 *                 type: string
 *                 description: Superpoder de la mascota

 *               felicidad:
 *                 type: integer
 *                 default: 100
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       400:
 *         description: Datos inválidos
 */
router.post("/mascotas", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        // Asignar el propietario automáticamente
        const datosMascota = {
            ...req.body,
            propietarioId: req.userId
        };

        const nuevaMascota = await mascotaRepository.crearMascota(datosMascota);
        res.status(201).json({
            mensaje: "Mascota creada exitosamente",
            mascota: nuevaMascota
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}:
 *   get:
 *     summary: Obtiene una mascota por ID
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/mascotas/:id", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const mascota = await mascotaRepository.obtenerMascotaPorId(req.params.id, req.userId);
        res.json({
            mensaje: "Mascota encontrada",
            mascota: mascota
        });
    } catch (error) {
        if (error.message === 'Mascota no encontrada o no tienes permisos') {
            res.status(403).json({ error: 'No tienes permisos para ver esta mascota' });
        } else if (error.message === 'Mascota no encontrada') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/mascotas/{id}:
 *   put:
 *     summary: Actualizar una mascota existente
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *               superpoder:
 *                 type: string
 *               salud:
 *                 type: integer
 *               felicidad:
 *                 type: integer
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Mascota no encontrada
 *       400:
 *         description: Datos inválidos
 */
router.put("/mascotas/:id", async (req, res) => {
    try {
        const mascotaActualizada = await mascotaService.updateMascota(parseInt(req.params.id), req.body);
        res.json({
            mensaje: "Mascota actualizada exitosamente",
            mascota: mascotaActualizada
        });
    } catch (error) {
        if (error.message === 'Mascota no encontrada') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Mascota no encontrada
 */
router.delete("/mascotas/:id", async (req, res) => {
    try {
        await mascotaService.deleteMascota(parseInt(req.params.id));
        res.json({
            mensaje: "Mascota eliminada exitosamente"
        });
    } catch (error) {
        if (error.message === 'Mascota no encontrada') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/pasear:
 *   post:
 *     summary: Sacar a pasear a la mascota (aumenta felicidad)
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota paseada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/pasear', async (req, res) => {
    try {
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        mascota.felicidad = Math.min(100, mascota.felicidad + 10);
        mascota.ultimoCuidado = new Date().toISOString();
        await mascotaService.updateMascota(mascota.id, mascota);
        res.json({ mensaje: 'Mascota paseada exitosamente', mascota });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/alimentar:
 *   post:
 *     summary: Alimentar a la mascota (sistema realista con riesgo de enfermedades por sobrealimentación)
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 minimum: 10
 *                 maximum: 150
 *                 default: 30
 *                 description: Cantidad de comida (10-150). Cantidades altas pueden causar enfermedades
 *     responses:
 *       200:
 *         description: Mascota alimentada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       400:
 *         description: Error en la alimentación
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/alimentar', async (req, res) => {
    try {
        const { cantidad = 30 } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        
        // Usar el método realista de alimentación
        const resultado = mascota.alimentar(cantidad);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                efectos: resultado.efectos,
                enfermedad: resultado.enfermedad || null,
                mascota: mascota 
            });
        } else {
            res.status(400).json({ 
                error: resultado.mensaje, 
                efectos: resultado.efectos 
            });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/enfermar:
 *   post:
 *     summary: Enfermar a la mascota (aplica una enfermedad)
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [sarna, gripe, pelos_estomago, pata_rota]
 *                 description: Tipo de enfermedad
 *     responses:
 *       200:
 *         description: Mascota enfermó exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/enfermar', async (req, res) => {
    try {
        const { tipo } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.enfermar(tipo);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                enfermedad: resultado.enfermedad
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/curar:
 *   post:
 *     summary: Curar una enfermedad de la mascota
 *     tags: [Mascotas]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [sarna, gripe, pelos_estomago, pata_rota, obesidad, diabetes, indigestion, intoxicacion_alimentaria, colesterol_alto, gastritis, pancreatitis, sobrepeso]
 *                 description: Tipo de enfermedad a curar
 *     responses:
 *       200:
 *         description: Mascota curada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/curar', async (req, res) => {
    try {
        const { tipo } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.curar(tipo);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                curacion: true
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/matar:
 *   post:
 *     summary: Matar a la mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               causa:
 *                 type: string
 *                 description: Causa de la muerte (opcional)
 *     responses:
 *       200:
 *         description: Mascota muerta exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/matar', async (req, res) => {
    try {
        const { causa } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.matarMascota(causa);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                muerte: true,
                causa: resultado.causa
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/revivir:
 *   post:
 *     summary: Revivir a la mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota revivida exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/revivir', async (req, res) => {
    try {
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.revivirMascota();
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                resurreccion: true
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/enfermar-aleatorio:
 *   post:
 *     summary: Asignar una enfermedad aleatoria a la mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               condicion:
 *                 type: string
 *                 enum: [hambre_extrema, sed_extrema, estres_alto, cansancio_extremo, sobrealimentacion, sobrehidratacion, ejercicio_excesivo, descanso_excesivo]
 *                 description: Condición específica para asignar enfermedad
 *     responses:
 *       200:
 *         description: Enfermedad asignada exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/enfermar-aleatorio', async (req, res) => {
    try {
        const { condicion } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        
        let resultado;
        if (condicion) {
            resultado = mascota.asignarEnfermedadPorCondicion(condicion);
        } else {
            resultado = mascota.asignarEnfermedadAleatoria();
        }
        
        if (resultado && resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                enfermedad: resultado.enfermedad,
                efectos: resultado.efectos,
                duracion: resultado.duracion,
                sintomas: resultado.sintomas
            });
        } else {
            res.status(400).json({ error: resultado ? resultado.mensaje : "No se pudo asignar enfermedad" });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/cepillar-pelo:
 *   post:
 *     summary: Cepillar el pelo de la mascota para prevenir problemas
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               intensidad:
 *                 type: string
 *                 enum: [suave, normal, intenso]
 *                 default: normal
 *                 description: Intensidad del cepillado
 *     responses:
 *       200:
 *         description: Pelo cepillado exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/cepillar-pelo', async (req, res) => {
    try {
        const { intensidad = 'normal' } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.cepillarPelo(intensidad);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                exito: true,
                efectos: resultado.efectos,
                prevencionPelo: resultado.prevencionPelo
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/aplicar-tratamiento-pelo:
 *   post:
 *     summary: Aplicar tratamiento específico para problemas de pelo
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tratamiento:
 *                 type: string
 *                 enum: [pasta_malta, aceite_oliva, fibra_extra, laxante_veterinario]
 *                 description: Tipo de tratamiento a aplicar
 *     responses:
 *       200:
 *         description: Tratamiento aplicado exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/aplicar-tratamiento-pelo', async (req, res) => {
    try {
        const { tratamiento } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.aplicarTratamientoPelo(tratamiento);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                exito: true,
                efectos: resultado.efectos,
                enfermedadesCuradas: resultado.enfermedadesCuradas,
                efectividad: resultado.efectividad
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/info-problemas-pelo:
 *   get:
 *     summary: Obtener información detallada sobre problemas de pelo
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Información de problemas de pelo obtenida exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/mascotas/:id/info-problemas-pelo', async (req, res) => {
    try {
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.obtenerInfoProblemasPelo();
        
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/mascotas/{id}/desarrollar-problema-pelo:
 *   post:
 *     summary: Desarrollar un problema específico de pelo
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gravedad:
 *                 type: string
 *                 enum: [leve, moderado, grave, gastritis, conductual]
 *                 description: Gravedad del problema de pelo a desarrollar
 *     responses:
 *       200:
 *         description: Problema de pelo desarrollado exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/desarrollar-problema-pelo', async (req, res) => {
    try {
        const { gravedad = 'leve' } = req.body;
        const mascota = await mascotaService.getMascotaByIdAsModel(req.params.id);
        const resultado = mascota.desarrollarProblemaPelo(gravedad);
        
        if (resultado.exito) {
            await mascotaService.updateMascota(mascota.id, mascota);
            res.json({ 
                mensaje: resultado.mensaje, 
                mascota: mascota,
                enfermedad: resultado.enfermedad,
                efectos: resultado.efectos,
                duracion: resultado.duracion,
                sintomas: resultado.sintomas
            });
        } else {
            res.status(400).json({ error: resultado.mensaje });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router; 
