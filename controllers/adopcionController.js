import express from "express";
import mascotaRepository from "../repositories/mascotaRepository.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MascotaAdopcion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la mascota
 *         nombre:
 *           type: string
 *           description: Nombre de la mascota
 *         tipo:
 *           type: string
 *           description: Tipo de mascota
 *         elemento:
 *           type: string
 *           description: Elemento de la mascota
 *         poder:
 *           type: string
 *           description: Poder especial
 *         adoptada:
 *           type: boolean
 *           description: Si la mascota está adoptada
 *         propietarioId:
 *           type: string
 *           description: ID del propietario (null si no está adoptada)
 *         fechaAdopcion:
 *           type: string
 *           format: date-time
 *           description: Fecha de adopción
 *         energia:
 *           type: integer
 *           description: Nivel de energía
 *         felicidad:
 *           type: integer
 *           description: Nivel de felicidad
 */

/**
 * @swagger
 * /api/adopcion/disponibles:
 *   get:
 *     summary: Obtener todas las mascotas disponibles para adopción
 *     description: Muestra todas las mascotas que no han sido adoptadas y están disponibles
 *     tags: [Adopción]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas disponibles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                   description: Número total de mascotas disponibles
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MascotaAdopcion'
 *                 mensaje:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/disponibles", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        const mascotas = await mascotaRepository.obtenerMascotasDisponibles();
        
        res.json({
            success: true,
            total: mascotas.length,
            mascotas: mascotas,
            mensaje: `Hay ${mascotas.length} mascotas disponibles para adopción`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /api/adopcion/adoptadas:
 *   get:
 *     summary: Obtener todas las mascotas adoptadas
 *     description: Muestra todas las mascotas que han sido adoptadas por cualquier usuario
 *     tags: [Adopción]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                   description: Número total de mascotas adoptadas
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MascotaAdopcion'
 *                 mensaje:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/adoptadas", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        const mascotas = await mascotaRepository.obtenerMascotasAdoptadas();
        
        res.json({
            success: true,
            total: mascotas.length,
            mascotas: mascotas,
            mensaje: `Hay ${mascotas.length} mascotas adoptadas en total`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /api/adopcion/mis-mascotas:
 *   get:
 *     summary: Obtener mis mascotas adoptadas
 *     description: Muestra solo las mascotas que has adoptado tú
 *     tags: [Adopción]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de tus mascotas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                   description: Número total de tus mascotas
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MascotaAdopcion'
 *                 mensaje:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/mis-mascotas", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        const mascotas = await mascotaRepository.obtenerTodasLasMascotas(req.userId);
        
        res.json({
            success: true,
            total: mascotas.length,
            mascotas: mascotas,
            mensaje: `Tienes ${mascotas.length} mascotas adoptadas`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /api/adopcion/adoptar/{id}:
 *   post:
 *     summary: Adoptar una mascota disponible
 *     description: Adopta una mascota que no ha sido adoptada previamente
 *     tags: [Adopción]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota a adoptar
 *     responses:
 *       200:
 *         description: Mascota adoptada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 mascota:
 *                   $ref: '#/components/schemas/MascotaAdopcion'
 *                 fechaAdopcion:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Error en la adopción (mascota ya adoptada)
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/adoptar/:id", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        const mascota = await mascotaRepository.adoptarMascota(req.params.id, req.userId);
        
        res.json({
            success: true,
            mensaje: `¡Felicidades! Has adoptado a ${mascota.nombre}`,
            mascota: mascota,
            fechaAdopcion: mascota.fechaAdopcion
        });
    } catch (error) {
        if (error.message.includes('ya ha sido adoptada')) {
            res.status(400).json({ 
                success: false,
                error: error.message 
            });
        } else if (error.message.includes('no encontrada')) {
            res.status(404).json({ 
                success: false,
                error: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }
});

/**
 * @swagger
 * /api/adopcion/abandonar/{id}:
 *   post:
 *     summary: Abandonar una mascota adoptada
 *     description: Abandona una mascota que has adoptado previamente
 *     tags: [Adopción]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota a abandonar
 *     responses:
 *       200:
 *         description: Mascota abandonada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 mascota:
 *                   $ref: '#/components/schemas/MascotaAdopcion'
 *       400:
 *         description: Error al abandonar (mascota no adoptada)
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para abandonar esta mascota
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/abandonar/:id", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        const mascota = await mascotaRepository.abandonarMascota(req.params.id, req.userId);
        
        res.json({
            success: true,
            mensaje: `Has abandonado a ${mascota.nombre}. Ahora está disponible para adopción.`,
            mascota: mascota
        });
    } catch (error) {
        if (error.message.includes('no tienes permisos')) {
            res.status(403).json({ 
                success: false,
                error: error.message 
            });
        } else if (error.message.includes('no está adoptada')) {
            res.status(400).json({ 
                success: false,
                error: error.message 
            });
        } else if (error.message.includes('no encontrada')) {
            res.status(404).json({ 
                success: false,
                error: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }
});

/**
 * @swagger
 * /api/adopcion/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de adopción
 *     description: Muestra estadísticas generales sobre adopciones
 *     tags: [Adopción]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 estadisticas:
 *                   type: object
 *                   properties:
 *                     totalMascotas:
 *                       type: integer
 *                     mascotasAdoptadas:
 *                       type: integer
 *                     mascotasDisponibles:
 *                       type: integer
 *                     porcentajeAdopcion:
 *                       type: number
 *                     misMascotas:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/estadisticas", async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        const [disponibles, adoptadas, misMascotas] = await Promise.all([
            mascotaRepository.obtenerMascotasDisponibles(),
            mascotaRepository.obtenerMascotasAdoptadas(),
            mascotaRepository.obtenerTodasLasMascotas(req.userId)
        ]);

        const totalMascotas = disponibles.length + adoptadas.length;
        const porcentajeAdopcion = totalMascotas > 0 ? (adoptadas.length / totalMascotas) * 100 : 0;

        res.json({
            success: true,
            estadisticas: {
                totalMascotas,
                mascotasAdoptadas: adoptadas.length,
                mascotasDisponibles: disponibles.length,
                porcentajeAdopcion: Math.round(porcentajeAdopcion * 100) / 100,
                misMascotas: misMascotas.length
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

export default router; 