import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import mascotaService from "../services/mascotaService.js";
import Hero from "../models/heroModel.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       required:
 *         - name
 *         - alias
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del superhéroe
 *         name:
 *           type: string
 *           description: Nombre real del superhéroe
 *         alias:
 *           type: string
 *           description: Nombre de superhéroe
 *         city:
 *           type: string
 *           description: Ciudad donde opera el superhéroe
 *         team:
 *           type: string
 *           description: Equipo al que pertenece
 *         mascotaId:
 *           type: integer
 *           description: ID de la mascota asociada
 *       example:
 *         id: 1
 *         name: Peter Parker
 *         alias: Spider-Man
 *         city: Nueva York
 *         team: Los Vengadores
 *         mascotaId: 1
 */

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     summary: Obtiene todos los héroes
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de héroes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 heroes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hero'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       500:
 *         description: Error del servidor
 */
router.get('/heroes', async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json({
            total: heroes.length,
            heroes: heroes,
            mensaje: `Se encontraron ${heroes.length} héroes`
        });
    } catch (error) {
        console.error('Error en GET /heroes:', error);
        res.status(500).json({ error: error.message });
    }
});



/**
 * @swagger
 * /api/heroes/{id}:
 *   get:
 *     summary: Obtiene un héroe por ID
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Héroe encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hero:
 *                   $ref: '#/components/schemas/Hero'
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Héroe no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/heroes/:id', async (req, res) => {
    try {
        const hero = await heroService.getHeroById(req.params.id);
        res.json({
            mensaje: "Héroe encontrado exitosamente",
            hero: hero
        });
    } catch (error) {
        if (error.message === 'Héroe no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     summary: Crear un nuevo héroe
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - alias
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre real del superhéroe
 *               alias:
 *                 type: string
 *                 description: Nombre de superhéroe
 *               city:
 *                 type: string
 *                 description: Ciudad donde opera
 *               team:
 *                 type: string
 *                 description: Equipo al que pertenece
 *               mascotaId:
 *                 type: integer
 *                 description: ID de la mascota
 *     responses:
 *       201:
 *         description: Héroe creado exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/heroes', async (req, res) => {
    try {
        const nuevoHeroe = await heroService.addHero(req.body);
        res.status(201).json({
            mensaje: "Héroe creado exitosamente",
            hero: nuevoHeroe
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   put:
 *     summary: Actualizar un héroe existente
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               city:
 *                 type: string
 *               team:
 *                 type: string
 *               mascotaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Héroe actualizado exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Héroe no encontrado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/heroes/:id', async (req, res) => {
    try {
        const heroeActualizado = await heroService.updateHero(req.params.id, req.body);
        res.json({
            mensaje: "Héroe actualizado exitosamente",
            hero: heroeActualizado
        });
    } catch (error) {
        if (error.message === 'Héroe no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     summary: Eliminar un héroe
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Héroe eliminado exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Héroe no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/heroes/:id', async (req, res) => {
    try {
        await heroService.deleteHero(req.params.id);
        res.json({
            mensaje: "Héroe eliminado exitosamente"
        });
    } catch (error) {
        if (error.message === 'Héroe no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/heroes/{id}/enfrentar:
 *   post:
 *     summary: Enfrentar a un villano con el héroe
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - villano
 *             properties:
 *               villano:
 *                 type: string
 *                 description: Nombre del villano a enfrentar
 *     responses:
 *       200:
 *         description: Resultado del enfrentamiento
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Héroe no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/heroes/:id/enfrentar', async (req, res) => {
    try {
        const { villano } = req.body;
        if (!villano) {
            return res.status(400).json({ error: 'Nombre del villano es requerido' });
        }

        const hero = await heroService.getHeroById(req.params.id);
        const resultado = await heroService.enfrentarVillano(hero, villano);
        
        res.json({
            mensaje: `Héroe ${hero.alias} enfrentó a ${villano}`,
            resultado: resultado,
            hero: hero
        });
    } catch (error) {
        if (error.message === 'Héroe no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/heroes/{id}/adoptar:
 *   post:
 *     summary: Adoptar una mascota para el héroe
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mascotaId
 *             properties:
 *               mascotaId:
 *                 type: integer
 *                 description: ID de la mascota a adoptar
 *     responses:
 *       200:
 *         description: Mascota adoptada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Héroe o mascota no encontrado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/heroes/:id/adoptar', async (req, res) => {
    try {
        const { mascotaId } = req.body;
        if (!mascotaId) {
            return res.status(400).json({ error: 'ID de mascota es requerido' });
        }

        const hero = await heroService.getHeroById(req.params.id);
        const mascota = await mascotaService.getMascotaById(mascotaId);
        
        const heroeActualizado = await heroService.adoptarMascota(hero, mascotaId);
        
        res.json({
            mensaje: `Héroe ${hero.alias} adoptó a ${mascota.tipo}`,
            hero: heroeActualizado,
            mascota: mascota
        });
    } catch (error) {
        if (error.message === 'Héroe no encontrado' || error.message === 'Mascota no encontrada') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/heroes/{id}/abandonar:
 *   post:
 *     summary: Abandonar la mascota actual del héroe
 *     tags: [Héroes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Mascota abandonada exitosamente
 *       401:
 *         description: No autorizado - Se requiere API Key
 *       404:
 *         description: Héroe no encontrado
 *       400:
 *         description: Héroe no tiene mascota
 *       500:
 *         description: Error del servidor
 */
router.post('/heroes/:id/abandonar', async (req, res) => {
    try {
        const hero = await heroService.getHeroById(req.params.id);
        
        if (!hero.mascotaId) {
            return res.status(400).json({ error: 'El héroe no tiene una mascota para abandonar' });
        }

        const mascota = await mascotaService.getMascotaById(hero.mascotaId);
        const heroeActualizado = await heroService.abandonarMascota(hero);
        
        res.json({
            mensaje: `Héroe ${hero.alias} abandonó a ${mascota.tipo}`,
            hero: heroeActualizado,
            mascotaAbandonada: mascota
        });
    } catch (error) {
        if (error.message === 'Héroe no encontrado' || error.message === 'Mascota no encontrada') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

export default router; 
