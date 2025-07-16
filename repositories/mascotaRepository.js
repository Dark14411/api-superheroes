import Mascota from '../models/mascotaSchema.js';

class MascotaRepository {
    
    // Crear una nueva mascota
    async crearMascota(datosMascota) {
        try {
            const mascota = new Mascota(datosMascota);
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al crear mascota: ${error.message}`);
        }
    }

    // Obtener todas las mascotas
    async obtenerTodasLasMascotas() {
        try {
            return await Mascota.find().sort({ fechaCreacion: -1 });
        } catch (error) {
            throw new Error(`Error al obtener mascotas: ${error.message}`);
        }
    }

    // Obtener mascota por ID
    async obtenerMascotaPorId(id) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }
            return mascota;
        } catch (error) {
            throw new Error(`Error al obtener mascota: ${error.message}`);
        }
    }

    // Obtener mascotas por tipo
    async obtenerMascotasPorTipo(tipo) {
        try {
            return await Mascota.findByTipo(tipo);
        } catch (error) {
            throw new Error(`Error al obtener mascotas por tipo: ${error.message}`);
        }
    }

    // Obtener mascotas vivas
    async obtenerMascotasVivas() {
        try {
            return await Mascota.findVivas();
        } catch (error) {
            throw new Error(`Error al obtener mascotas vivas: ${error.message}`);
        }
    }

    // Obtener mascotas enfermas
    async obtenerMascotasEnfermas() {
        try {
            return await Mascota.findEnfermas();
        } catch (error) {
            throw new Error(`Error al obtener mascotas enfermas: ${error.message}`);
        }
    }

    // Actualizar mascota
    async actualizarMascota(id, datosActualizados) {
        try {
            const mascota = await Mascota.findByIdAndUpdate(
                id,
                { ...datosActualizados, fechaUltimaActualizacion: new Date() },
                { new: true, runValidators: true }
            );
            
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }
            
            return mascota;
        } catch (error) {
            throw new Error(`Error al actualizar mascota: ${error.message}`);
        }
    }

    // Eliminar mascota
    async eliminarMascota(id) {
        try {
            const mascota = await Mascota.findByIdAndDelete(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }
            return mascota;
        } catch (error) {
            throw new Error(`Error al eliminar mascota: ${error.message}`);
        }
    }

    // Alimentar mascota
    async alimentarMascota(id, cantidad = 30) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }

            // Calcular nueva hambre
            const nuevaHambre = Math.max(0, mascota.hambre - cantidad);
            mascota.hambre = nuevaHambre;
            
            // Aumentar energía y felicidad
            mascota.energia = Math.min(100, mascota.energia + 10);
            mascota.felicidad = Math.min(100, mascota.felicidad + 5);
            
            // Actualizar timestamps
            mascota.ultimaComida = new Date();
            mascota.fechaUltimaActualizacion = new Date();
            
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al alimentar mascota: ${error.message}`);
        }
    }

    // Dar agua a mascota
    async darAguaMascota(id, cantidad = 40) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }

            // Calcular nueva sed
            const nuevaSed = Math.max(0, mascota.sed - cantidad);
            mascota.sed = nuevaSed;
            
            // Aumentar energía
            mascota.energia = Math.min(100, mascota.energia + 5);
            
            // Actualizar timestamps
            mascota.ultimaBebida = new Date();
            mascota.fechaUltimaActualizacion = new Date();
            
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al dar agua a mascota: ${error.message}`);
        }
    }

    // Hacer descansar mascota
    async descansarMascota(id, horas = 8) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }

            // Calcular nuevo cansancio
            const reduccionCansancio = Math.min(horas * 5, mascota.cansancio);
            mascota.cansancio = Math.max(0, mascota.cansancio - reduccionCansancio);
            
            // Aumentar energía
            const aumentoEnergia = Math.min(horas * 3, 100 - mascota.energia);
            mascota.energia = Math.min(100, mascota.energia + aumentoEnergia);
            
            // Reducir estrés
            const reduccionEstres = Math.min(horas * 2, mascota.estres);
            mascota.estres = Math.max(0, mascota.estres - reduccionEstres);
            
            // Actualizar timestamps
            mascota.ultimoDescanso = new Date();
            mascota.fechaUltimaActualizacion = new Date();
            
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al hacer descansar mascota: ${error.message}`);
        }
    }

    // Ejercitar mascota
    async ejercitarMascota(id, intensidad = 30) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }

            // Aumentar cansancio
            const aumentoCansancio = Math.min(intensidad, 100 - mascota.cansancio);
            mascota.cansancio = Math.min(100, mascota.cansancio + aumentoCansancio);
            
            // Aumentar hambre y sed
            const aumentoHambre = Math.min(intensidad * 0.5, 100 - mascota.hambre);
            mascota.hambre = Math.min(100, mascota.hambre + aumentoHambre);
            
            const aumentoSed = Math.min(intensidad * 0.7, 100 - mascota.sed);
            mascota.sed = Math.min(100, mascota.sed + aumentoSed);
            
            // Aumentar felicidad y reducir estrés
            const aumentoFelicidad = Math.min(intensidad * 0.3, 100 - mascota.felicidad);
            mascota.felicidad = Math.min(100, mascota.felicidad + aumentoFelicidad);
            
            const reduccionEstres = Math.min(intensidad * 0.4, mascota.estres);
            mascota.estres = Math.max(0, mascota.estres - reduccionEstres);
            
            // Actualizar timestamps
            mascota.ultimoEjercicio = new Date();
            mascota.fechaUltimaActualizacion = new Date();
            
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al ejercitar mascota: ${error.message}`);
        }
    }

    // Agregar enfermedad a mascota
    async agregarEnfermedad(id, tipoEnfermedad) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }

            // Verificar si ya tiene la enfermedad
            const enfermedadExistente = mascota.enfermedades.find(e => e.tipo === tipoEnfermedad && !e.curada);
            if (enfermedadExistente) {
                throw new Error('La mascota ya tiene esta enfermedad activa');
            }

            // Agregar nueva enfermedad
            mascota.enfermedades.push({
                tipo: tipoEnfermedad,
                fechaInicio: new Date(),
                curada: false
            });

            // Aplicar efectos de la enfermedad
            mascota.aplicarEfectosEnfermedades();
            
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al agregar enfermedad: ${error.message}`);
        }
    }

    // Curar enfermedad de mascota
    async curarEnfermedad(id, tipoEnfermedad) {
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                throw new Error('Mascota no encontrada');
            }

            const enfermedad = mascota.enfermedades.find(e => e.tipo === tipoEnfermedad && !e.curada);
            if (!enfermedad) {
                throw new Error('Enfermedad no encontrada o ya curada');
            }

            enfermedad.curada = true;
            enfermedad.fechaFin = new Date();
            
            await mascota.save();
            return mascota;
        } catch (error) {
            throw new Error(`Error al curar enfermedad: ${error.message}`);
        }
    }

    // Obtener estadísticas de mascotas
    async obtenerEstadisticas() {
        try {
            const totalMascotas = await Mascota.countDocuments();
            const mascotasVivas = await Mascota.countDocuments({ muerto: false });
            const mascotasMuertas = await Mascota.countDocuments({ muerto: true });
            const mascotasEnfermas = await Mascota.countDocuments({
                'enfermedades': { $elemMatch: { curada: false } }
            });

            // Estadísticas por tipo
            const porTipo = await Mascota.aggregate([
                { $group: { _id: '$tipo', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            // Estadísticas por elemento
            const porElemento = await Mascota.aggregate([
                { $group: { _id: '$elemento', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            return {
                total: totalMascotas,
                vivas: mascotasVivas,
                muertas: mascotasMuertas,
                enfermas: mascotasEnfermas,
                porTipo,
                porElemento
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }

    // Buscar mascotas por criterios
    async buscarMascotas(criterios) {
        try {
            const filtro = {};
            
            if (criterios.nombre) {
                filtro.nombre = { $regex: criterios.nombre, $options: 'i' };
            }
            
            if (criterios.tipo) {
                filtro.tipo = criterios.tipo;
            }
            
            if (criterios.elemento) {
                filtro.elemento = criterios.elemento;
            }
            
            if (criterios.muerto !== undefined) {
                filtro.muerto = criterios.muerto;
            }
            
            if (criterios.enferma) {
                filtro['enfermedades'] = { $elemMatch: { curada: false } };
            }

            return await Mascota.find(filtro).sort({ fechaCreacion: -1 });
        } catch (error) {
            throw new Error(`Error al buscar mascotas: ${error.message}`);
        }
    }

    // Obtener mascotas con estadísticas variables
    async obtenerMascotasConVariaciones() {
        try {
            const mascotas = await Mascota.find();
            
            return mascotas.map(mascota => {
                const mascotaObj = mascota.toObject();
                
                // Generar variaciones aleatorias en las estadísticas
                mascotaObj.energiaConVariacion = this.generarVariacionAleatoria(mascotaObj.energia);
                mascotaObj.felicidadConVariacion = this.generarVariacionAleatoria(mascotaObj.felicidad);
                mascotaObj.hambreConVariacion = this.generarVariacionAleatoria(mascotaObj.hambre);
                mascotaObj.sedConVariacion = this.generarVariacionAleatoria(mascotaObj.sed);
                mascotaObj.cansancioConVariacion = this.generarVariacionAleatoria(mascotaObj.cansancio);
                mascotaObj.estresConVariacion = this.generarVariacionAleatoria(mascotaObj.estres);
                
                return mascotaObj;
            });
        } catch (error) {
            throw new Error(`Error al obtener mascotas con variaciones: ${error.message}`);
        }
    }

    // Método auxiliar para generar variaciones aleatorias
    generarVariacionAleatoria(valor) {
        const variacion = Math.random() * 10 - 5; // ±5 puntos
        return Math.max(0, Math.min(100, Math.round(valor + variacion)));
    }
}

export default new MascotaRepository(); 