import mascotaRepository from '../repositories/mascotaRepository.js';

// Middleware para verificar que el usuario es propietario de la mascota
const verificarPropietarioMascota = async (req, res, next) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                error: 'Usuario no autenticado',
                message: 'Debes iniciar sesión para acceder a esta mascota'
            });
        }

        const mascotaId = req.params.id;
        if (!mascotaId) {
            return res.status(400).json({ 
                error: 'ID de mascota requerido',
                message: 'Debes especificar el ID de la mascota'
            });
        }

        // Verificar que la mascota existe y pertenece al usuario
        try {
            const mascota = await mascotaRepository.obtenerMascotaPorId(mascotaId, req.userId);
            if (!mascota) {
                return res.status(403).json({ 
                    error: 'Acceso denegado',
                    message: 'No tienes permisos para acceder a esta mascota',
                    solution: 'Esta mascota pertenece a otro usuario'
                });
            }

            // Agregar la mascota al request para uso posterior
            req.mascota = mascota;
            next();
        } catch (error) {
            if (error.message === 'Mascota no encontrada o no tienes permisos') {
                return res.status(403).json({ 
                    error: 'Acceso denegado',
                    message: 'No tienes permisos para acceder a esta mascota',
                    solution: 'Esta mascota pertenece a otro usuario o no existe'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error en verificación de propietario:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo verificar los permisos de la mascota'
        });
    }
};

// Middleware para verificar que el usuario está autenticado (sin verificar propiedad específica)
const verificarAutenticacionMascota = async (req, res, next) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.userId) {
            return res.status(401).json({ 
                error: 'Usuario no autenticado',
                message: 'Debes iniciar sesión para acceder a las mascotas',
                solution: 'Registra un usuario o inicia sesión para obtener acceso'
            });
        }

        next();
    } catch (error) {
        console.error('Error en verificación de autenticación:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo verificar la autenticación'
        });
    }
};

export { verificarPropietarioMascota, verificarAutenticacionMascota }; 