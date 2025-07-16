import mascotaRepository from '../repositories/mascotaRepository.js';
import itemRepository from '../repositories/itemRepository.js';
import Mascota from '../models/mascotaModel.js';
import Item from '../models/itemModel.js';

// Función auxiliar para convertir objeto del modelo a objeto plano para guardar
function mascotaToPlainObject(mascota) {
    return {
        id: mascota.id,
        nombre: mascota.nombre,
        tipo: mascota.tipo,
        elemento: mascota.elemento,
        poder: mascota.poder,
        energia: mascota.energia,
        felicidad: mascota.felicidad,
        hambre: mascota.hambre,
        sed: mascota.sed,
        cansancio: mascota.cansancio,
        estres: mascota.estres,
        enfermedades: mascota.enfermedades || [],
        muerto: mascota.muerto || false,
        fechaCreacion: mascota.fechaCreacion,
        fechaUltimaActualizacion: mascota.fechaUltimaActualizacion,
        estado: mascota.estado,
        enfermo: mascota.enfermo,
        ultimoCuidado: mascota.ultimoCuidado,
        viva: mascota.viva,
        fechaMuerte: mascota.fechaMuerte,
        causaMuerte: mascota.causaMuerte,
        condicionesMedicas: mascota.condicionesMedicas || []
    };
}

// Función auxiliar para crear instancia del modelo desde datos
function createMascotaFromData(mascotaData) {
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.nombre,
        mascotaData.tipo,
        mascotaData.elemento,
        mascotaData.poder,
        mascotaData.energia || 100,
        mascotaData.felicidad || 100,
        mascotaData.hambre || 0,
        mascotaData.sed || 0,
        mascotaData.cansancio || 0,
        mascotaData.estres || 0,
        mascotaData.enfermedades || [],
        mascotaData.muerto || false,
        mascotaData.fechaCreacion,
        mascotaData.fechaUltimaActualizacion
    );
    
    // Copiar todas las propiedades del objeto original
    Object.assign(mascota, mascotaData);
    
    // Asegurar que las enfermedades estén sincronizadas
    if (mascotaData.condicionesMedicas && mascotaData.condicionesMedicas.length > 0) {
        mascota.condicionesMedicas = mascotaData.condicionesMedicas;
    }
    
    return mascota;
}

async function getAllMascotas() {
    const mascotas = await mascotaRepository.getMascotas();
    
    // Actualizar el estado de cada mascota con variaciones dinámicas
    const mascotasActualizadas = mascotas.map(mascotaData => {
        const mascota = createMascotaFromData(mascotaData);
        // Aplicar efectos de enfermedades y generar variaciones dinámicas
        mascota.aplicarEfectosEnfermedades();
        return mascota.obtenerEstadisticasConVariaciones();
    });
    
    return mascotasActualizadas;
}

async function getMascotaById(id) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaData = mascotas.find(m => m.id === parseInt(id));
    if (!mascotaData) {
        throw new Error('Mascota no encontrada');
    }
    
    const mascota = createMascotaFromData(mascotaData);
    // Aplicar efectos de enfermedades y generar variaciones dinámicas
    mascota.aplicarEfectosEnfermedades();
    
    return mascota.obtenerEstadisticasConVariaciones();
}

// Nuevo método para obtener mascota como instancia del modelo (para acciones)
async function getMascotaByIdAsModel(id) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaData = mascotas.find(m => m.id === parseInt(id));
    if (!mascotaData) {
        throw new Error('Mascota no encontrada');
    }
    
    const mascota = createMascotaFromData(mascotaData);
    // Aplicar efectos de enfermedades
    mascota.aplicarEfectosEnfermedades();
    
    return mascota;
}

async function addMascota(mascota) {
    const mascotas = await mascotaRepository.getMascotas();
    const newId = mascotas.length > 0 ? Math.max(...mascotas.map(m => m.id)) + 1 : 1;
    
    const newMascota = new Mascota(
        newId,
        mascota.tipo,
        mascota.superpoder,
        100, // salud inicial
        100, // felicidad inicial
        "Sunny" // estado inicial
    );
    
    mascotas.push(newMascota);
    await mascotaRepository.saveMascotas(mascotas);
    return newMascota;
}

async function updateMascota(id, mascotaData) {
    const mascotas = await mascotaRepository.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    
    // Crear una nueva instancia del modelo para preservar todos los métodos y propiedades
    const mascotaOriginal = createMascotaFromData(mascotas[index]);
    
    // Aplicar las actualizaciones del request de manera más específica
    if (mascotaData.energia !== undefined) mascotaOriginal.energia = mascotaData.energia;
    if (mascotaData.felicidad !== undefined) mascotaOriginal.felicidad = mascotaData.felicidad;
    if (mascotaData.hambre !== undefined) mascotaOriginal.hambre = mascotaData.hambre;
    if (mascotaData.sed !== undefined) mascotaOriginal.sed = mascotaData.sed;
    if (mascotaData.cansancio !== undefined) mascotaOriginal.cansancio = mascotaData.cansancio;
    if (mascotaData.estres !== undefined) mascotaOriginal.estres = mascotaData.estres;
    if (mascotaData.enfermedades !== undefined) mascotaOriginal.enfermedades = mascotaData.enfermedades;
    if (mascotaData.muerto !== undefined) mascotaOriginal.muerto = mascotaData.muerto;
    if (mascotaData.viva !== undefined) mascotaOriginal.viva = mascotaData.viva;
    if (mascotaData.estado !== undefined) mascotaOriginal.estado = mascotaData.estado;
    if (mascotaData.enfermo !== undefined) mascotaOriginal.enfermo = mascotaData.enfermo;
    if (mascotaData.fechaMuerte !== undefined) mascotaOriginal.fechaMuerte = mascotaData.fechaMuerte;
    if (mascotaData.causaMuerte !== undefined) mascotaOriginal.causaMuerte = mascotaData.causaMuerte;
    if (mascotaData.ultimoCuidado !== undefined) mascotaOriginal.ultimoCuidado = mascotaData.ultimoCuidado;
    if (mascotaData.condicionesMedicas !== undefined) mascotaOriginal.condicionesMedicas = mascotaData.condicionesMedicas;
    
    // Actualizar fecha de última actualización
    mascotaOriginal.fechaUltimaActualizacion = new Date().toISOString();
    
    // Asegurar que el ID sea correcto
    mascotaOriginal.id = parseInt(id);
    
    // Guardar la mascota actualizada
    mascotas[index] = mascotaToPlainObject(mascotaOriginal);
    await mascotaRepository.saveMascotas(mascotas);
    
    return mascotaOriginal;
}

async function deleteMascota(id) {
    const mascotas = await mascotaRepository.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    
    const deletedMascota = mascotas[index];
    mascotas.splice(index, 1);
    await mascotaRepository.saveMascotas(mascotas);
    return { message: `Mascota ${deletedMascota.tipo} eliminada exitosamente` };
}

async function usarItem(mascotaId, itemId) {
    const mascotas = await mascotaRepository.getMascotas();
    const items = await itemRepository.getItems();
    
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(mascotaId));
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }
    
    const itemData = items.find(i => i.id === parseInt(itemId));
    if (!itemData) {
        throw new Error('Item no encontrado');
    }
    
    // Crear instancias de las clases
    const mascota = new Mascota(
        mascotas[mascotaIndex].id,
        mascotas[mascotaIndex].tipo,
        mascotas[mascotaIndex].superpoder,
        mascotas[mascotaIndex].salud || 100,
        mascotas[mascotaIndex].felicidad || 100,
        mascotas[mascotaIndex].estado || "Sunny",
        mascotas[mascotaIndex].enfermo || false,
        mascotas[mascotaIndex].ultimoCuidado
    );
    
    const item = new Item(
        itemData.id,
        itemData.nombre,
        itemData.tipo,
        itemData.efecto,
        itemData.valor,
        itemData.precio,
        itemData.esGratuito,
        itemData.descripcion
    );
    
    // Aplicar el efecto del item
    const resultado = item.aplicarEfecto(mascota);
    
    // Guardar los cambios
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    return {
        ...resultado,
        mascota: mascota,
        mensaje: `${item.nombre} usado en ${mascota.tipo}. ${mascota.tipo} ahora está ${mascota.estado}.`
    };
}

async function alimentarMascota(mascotaId) {
    // Usar comida básica (item gratuito)
    return await usarItem(mascotaId, 1);
}

async function curarMascota(mascotaId) {
    // Usar medicina básica (item gratuito)
    return await usarItem(mascotaId, 2);
}

async function jugarConMascota(mascotaId) {
    // Usar pelota simple (item gratuito)
    return await usarItem(mascotaId, 3);
}

async function getEstadisticasMascota(mascotaId) {
    const mascota = await getMascotaById(mascotaId);
    
    return {
        id: mascota.id,
        tipo: mascota.tipo,
        salud: mascota.salud,
        felicidad: mascota.felicidad,
        estado: mascota.estado,
        enfermo: mascota.enfermo,
        ultimoCuidado: mascota.ultimoCuidado,
        estadoGeneral: getEstadoGeneral(mascota.salud, mascota.felicidad),
        necesitaCuidado: mascota.salud < 50 || mascota.felicidad < 50
    };
}

function getEstadoGeneral(salud, felicidad) {
    const promedio = (salud + felicidad) / 2;
    if (promedio >= 80) return "Excelente";
    if (promedio >= 60) return "Bien";
    if (promedio >= 40) return "Regular";
    if (promedio >= 20) return "Mal";
    return "Crítico";
}

// Usar poder especial de una mascota
async function usarPoderEspecial(id, nombrePoder) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );

    // Usar el método del modelo
    const resultado = mascota.usarPoderEspecial(nombrePoder);
    
    if (resultado.exito) {
        // Actualizar la mascota en el repositorio
        mascotas[mascotaIndex] = mascota;
        await mascotaRepository.saveMascotas(mascotas);
    }
    
    return resultado;
}

// Obtener mascotas por rareza
async function obtenerPorRareza(rareza) {
    const todasLasMascotas = await getAllMascotas();
    return todasLasMascotas.filter(mascota => mascota.rareza === rareza);
}

// Obtener mascotas por elemento
async function obtenerPorElemento(elemento) {
    const todasLasMascotas = await getAllMascotas();
    return todasLasMascotas.filter(mascota => mascota.elemento === elemento);
}

// Obtener ranking por nivel de poder
async function obtenerRankingPoder() {
    const todasLasMascotas = await getAllMascotas();
    return todasLasMascotas.sort((a, b) => b.nivelPoder - a.nivelPoder);
}

// Simular batalla entre mascotas
async function simularBatalla(id1, id2) {
    const mascota1 = await getMascotaById(id1);
    const mascota2 = await getMascotaById(id2);

    if (mascota1.enfermo || mascota2.enfermo) {
        throw new Error('Las mascotas enfermas no pueden batallar');
    }

    // Calcular ventajas elementales
    const ventajaElemental = calcularVentajaElemental(mascota1.elemento, mascota2.elemento);
    
    // Calcular puntuación de batalla
    const puntos1 = calcularPuntosBatalla(mascota1, ventajaElemental.ventaja1);
    const puntos2 = calcularPuntosBatalla(mascota2, ventajaElemental.ventaja2);

    // Determinar ganador
    const ganador = puntos1 > puntos2 ? mascota1 : mascota2;
    const perdedor = puntos1 > puntos2 ? mascota2 : mascota1;

    // Efectos post-batalla
    ganador.felicidad = Math.min(100, ganador.felicidad + 15);
    perdedor.felicidad = Math.max(0, perdedor.felicidad - 10);
    perdedor.salud = Math.max(0, perdedor.salud - 5);

    // Actualizar estados
    ganador.actualizarEstado();
    perdedor.actualizarEstado();

    // Guardar cambios
    await updateMascota(ganador.id, ganador);
    await updateMascota(perdedor.id, perdedor);

    return {
        ganador: {
            id: ganador.id,
            tipo: ganador.tipo,
            puntos: puntos1 > puntos2 ? puntos1 : puntos2,
            elemento: ganador.elemento,
            rareza: ganador.rareza
        },
        perdedor: {
            id: perdedor.id,
            tipo: perdedor.tipo,
            puntos: puntos1 > puntos2 ? puntos2 : puntos1,
            elemento: perdedor.elemento,
            rareza: perdedor.rareza
        },
        ventajaElemental: ventajaElemental,
        descripcion: generarDescripcionBatalla(ganador, perdedor, ventajaElemental),
        efectos: {
            ganador: `+15 felicidad`,
            perdedor: `-10 felicidad, -5 salud`
        }
    };
}

// Calcular ventaja elemental
function calcularVentajaElemental(elemento1, elemento2) {
    const ventajas = {
        "Fuego": ["Aire", "Tierra"],
        "Agua": ["Fuego"],
        "Aire": ["Agua"],
        "Tierra": ["Aire"],
        "Luz": ["Oscuridad"],
        "Oscuridad": ["Luz"],
        "Arcano": ["Tierra", "Agua"]
    };

    let ventaja1 = 1.0;
    let ventaja2 = 1.0;

    if (ventajas[elemento1] && ventajas[elemento1].includes(elemento2)) {
        ventaja1 = 1.5;
        ventaja2 = 0.7;
    } else if (ventajas[elemento2] && ventajas[elemento2].includes(elemento1)) {
        ventaja1 = 0.7;
        ventaja2 = 1.5;
    }

    return {
        ventaja1,
        ventaja2,
        descripcion: ventaja1 > 1 ? `${elemento1} tiene ventaja sobre ${elemento2}` :
                    ventaja2 > 1 ? `${elemento2} tiene ventaja sobre ${elemento1}` :
                    'Sin ventaja elemental'
    };
}

// Calcular puntos de batalla
function calcularPuntosBatalla(mascota, ventajaElemental) {
    const stats = mascota.estadisticasEspeciales;
    const baseScore = stats.ataque + stats.defensa + stats.velocidad + stats.magia;
    const healthBonus = (mascota.salud + mascota.felicidad) / 10;
    const powerBonus = mascota.nivelPoder / 5;
    
    return Math.round((baseScore + healthBonus + powerBonus) * ventajaElemental);
}

// Generar descripción de batalla
function generarDescripcionBatalla(ganador, perdedor, ventajaElemental) {
    const descripciones = [
        `${ganador.tipo} derrota a ${perdedor.tipo} en una épica batalla`,
        `Con un rugido poderoso, ${ganador.tipo} supera a ${perdedor.tipo}`,
        `${ganador.tipo} usa sus habilidades especiales para vencer a ${perdedor.tipo}`,
        `En una demostración de poder, ${ganador.tipo} triunfa sobre ${perdedor.tipo}`
    ];
    
    let descripcion = descripciones[Math.floor(Math.random() * descripciones.length)];
    
    if (ventajaElemental.ventaja1 > 1 || ventajaElemental.ventaja2 > 1) {
        descripcion += `. ${ventajaElemental.descripcion}`;
    }
    
    return descripcion;
}

// Nuevos métodos para el sistema realista de salud
async function alimentarMascotaRealista(id, cantidad = 30) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = createMascotaFromData(mascotaData);

    const resultado = mascota.alimentar(cantidad);
    
    if (resultado.exito) {
        // Aplicar efectos de enfermedades si se enfermó
        if (resultado.enfermedad) {
            mascota.aplicarEfectosEnfermedades();
        }
        
        mascotas[mascotaIndex] = mascotaToPlainObject(mascota);
        await mascotaRepository.saveMascotas(mascotas);
    }
    
    return resultado;
}

async function darAguaMascota(id, cantidad = 40) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = createMascotaFromData(mascotaData);

    const resultado = mascota.darAgua(cantidad);
    
    if (resultado.exito) {
        // Aplicar efectos de enfermedades si se enfermó
        if (resultado.enfermedad) {
            mascota.aplicarEfectosEnfermedades();
        }
        
        mascotas[mascotaIndex] = mascotaToPlainObject(mascota);
        await mascotaRepository.saveMascotas(mascotas);
    }
    
    return resultado;
}

async function descansarMascota(id, horas = 8) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = createMascotaFromData(mascotaData);

    const resultado = mascota.descansar(horas);
    
    if (resultado.exito) {
        // Aplicar efectos de enfermedades si se enfermó
        if (resultado.enfermedad) {
            mascota.aplicarEfectosEnfermedades();
        }
        
        mascotas[mascotaIndex] = mascotaToPlainObject(mascota);
        await mascotaRepository.saveMascotas(mascotas);
    }
    
    return resultado;
}

async function ejercitarMascota(id, intensidad = 30) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = createMascotaFromData(mascotaData);

    const resultado = mascota.ejercitar(intensidad);
    
    if (resultado.exito) {
        // Aplicar efectos de enfermedades si se enfermó
        if (resultado.enfermedad) {
            mascota.aplicarEfectosEnfermedades();
        }
        
        mascotas[mascotaIndex] = mascotaToPlainObject(mascota);
        await mascotaRepository.saveMascotas(mascotas);
    }
    
    return resultado;
}



async function cambiarCondicionesAmbientales(id, condiciones) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );
    
    Object.assign(mascota, mascotaData);

    // Actualizar condiciones ambientales
    if (condiciones.temperatura !== undefined) {
        mascota.condicionesAmbientales.temperatura = condiciones.temperatura;
    }
    if (condiciones.humedad !== undefined) {
        mascota.condicionesAmbientales.humedad = condiciones.humedad;
    }
    if (condiciones.contaminacion !== undefined) {
        mascota.condicionesAmbientales.contaminacion = condiciones.contaminacion;
    }

    // Aplicar efectos inmediatos
    mascota.aplicarDegradacionRealista();
    
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    return {
        exito: true,
        mensaje: "Condiciones ambientales actualizadas",
        condicionesActuales: mascota.condicionesAmbientales
    };
}

async function getMascotasCriticas() {
    const todasLasMascotas = await getAllMascotas();
    return todasLasMascotas
        .filter(mascota => {
            return mascota.estado === "Critical" || 
                   mascota.estado === "Dead" ||
                   mascota.salud < 30 ||
                   mascota.energia < 20 ||
                   mascota.hambre > 80 ||
                   mascota.sed > 80;
        })
        .map(mascota => ({
            ...mascota
        }));
}

async function revivirMascota(id) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );
    
    Object.assign(mascota, mascotaData);

    if (mascota.estado !== "Dead") {
        return {
            exito: false,
            mensaje: "La mascota no está muerta"
        };
    }

    // Solo ciertos tipos pueden revivir
    const puedeRevivir = ["Fénix", "Lich", "Banshee", "Djinn"].includes(mascota.tipo);
    
    if (!puedeRevivir) {
        return {
            exito: false,
            mensaje: `${mascota.tipo} no puede revivir naturalmente`
        };
    }

    // Revivir con estadísticas reducidas
    mascota.salud = 50;
    mascota.felicidad = 30;
    mascota.energia = 40;
    mascota.hambre = 70;
    mascota.sed = 60;
    mascota.cansancio = 80;
    mascota.estres = 90;
    mascota.ultimoCuidado = new Date().toISOString();
    
    mascota.aplicarDegradacionRealista();
    
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    return {
        exito: true,
        mensaje: `${mascota.tipo} ha revivido, pero necesita cuidados intensivos`
    };
}





// Aplicar tratamiento médico
async function aplicarTratamiento(id, tipoTratamiento, intensidad) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );
    
    Object.assign(mascota, mascotaData);

    let resultado = { exito: false, mensaje: "", efectos: "" };
    
    switch (tipoTratamiento) {
        case 'antibiotico':
            if (mascota.enfermo && mascota.temperatura > 37.5) {
                mascota.salud = Math.min(100, mascota.salud + 25);
                mascota.temperatura = Math.max(36.5, mascota.temperatura - 1.5);
                mascota.inmunidad = Math.min(100, mascota.inmunidad + 15);
                if (mascota.condicionesMedicas) {
                    mascota.condicionesMedicas = mascota.condicionesMedicas.filter(c => 
                        !c.includes("Infección") && !c.includes("Indigestión"));
                }
                resultado = { 
                    exito: true, 
                    mensaje: "Antibiótico administrado. Infección tratada.",
                    efectos: "Salud +25, Temperatura -1.5°C, Inmunidad +15"
                };
            } else {
                resultado = { 
                    exito: false, 
                    mensaje: "Antibiótico innecesario. No hay infección.",
                    efectos: "Sin efecto"
                };
            }
            break;
            
        case 'vitaminas':
            mascota.inmunidad = Math.min(100, mascota.inmunidad + 20);
            mascota.energia = Math.min(100, mascota.energia + 15);
            mascota.salud = Math.min(100, mascota.salud + 10);
            resultado = { 
                exito: true, 
                mensaje: "Vitaminas administradas. Fortalecimiento general.",
                efectos: "Inmunidad +20, Energía +15, Salud +10"
            };
            break;
            
        case 'diuretico':
            if (mascota.peso > mascota.calcularPesoIdeal() * 1.2) {
                mascota.peso = Math.max(mascota.calcularPesoIdeal(), mascota.peso - 5);
                mascota.sed = Math.min(100, mascota.sed + 30);
                resultado = { 
                    exito: true, 
                    mensaje: "Diurético administrado. Reducción de peso por líquidos.",
                    efectos: "Peso -5kg, Sed +30%"
                };
            } else {
                resultado = { 
                    exito: false, 
                    mensaje: "Diurético innecesario. Peso normal.",
                    efectos: "Sin efecto"
                };
            }
            break;
            
        case 'antiinflamatorio':
            if (mascota.temperatura > 38 || mascota.estres > 60) {
                mascota.temperatura = Math.max(36.5, mascota.temperatura - 1);
                mascota.estres = Math.max(0, mascota.estres - 25);
                mascota.salud = Math.min(100, mascota.salud + 15);
                resultado = { 
                    exito: true, 
                    mensaje: "Antiinflamatorio administrado. Reducción de inflamación.",
                    efectos: "Temperatura -1°C, Estrés -25, Salud +15"
                };
            } else {
                resultado = { 
                    exito: false, 
                    mensaje: "Antiinflamatorio innecesario. Sin inflamación.",
                    efectos: "Sin efecto"
                };
            }
            break;
            
        case 'cirugia':
            if (mascota.salud < 30 || (mascota.peso > mascota.calcularPesoIdeal() * 1.5)) {
                // Cirugía es riesgosa pero puede salvar vidas
                if (Math.random() < 0.8) { // 80% éxito
                    mascota.salud = Math.min(100, mascota.salud + 40);
                    mascota.peso = Math.min(mascota.calcularPesoIdeal() * 1.1, mascota.peso);
                    mascota.estres = Math.min(100, mascota.estres + 50); // Estrés post-quirúrgico
                    mascota.energia = Math.max(0, mascota.energia - 30);
                    resultado = { 
                        exito: true, 
                        mensaje: "Cirugía exitosa. Recuperación en proceso.",
                        efectos: "Salud +40, Peso normalizado, Estrés +50, Energía -30"
                    };
                } else { // 20% fallo
                    mascota.salud = Math.max(0, mascota.salud - 20);
                    mascota.estres = Math.min(100, mascota.estres + 80);
                    resultado = { 
                        exito: false, 
                        mensaje: "Cirugía falló. Complicaciones graves.",
                        efectos: "Salud -20, Estrés +80"
                    };
                }
            } else {
                resultado = { 
                    exito: false, 
                    mensaje: "Cirugía innecesaria. Estado no crítico.",
                    efectos: "Sin efecto"
                };
            }
            break;
    }
    
    mascota.ultimoCuidado = new Date().toISOString();
    mascota.aplicarDegradacionRealista();
    
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    return {
        ...resultado,
        estadoDespues: mascota.getReporteSalud()
    };
}

// Reporte epidemiológico
async function getReporteEpidemiologico() {
    const todasLasMascotas = await getAllMascotas();
    const mascotasEnfermas = todasLasMascotas.filter(m => m.enfermo || m.salud < 50);
    
    // Contar condiciones médicas
    const condiciones = {};
    mascotasEnfermas.forEach(mascota => {
        if (mascota.condicionesMedicas) {
            mascota.condicionesMedicas.forEach(condicion => {
                condiciones[condicion] = (condiciones[condicion] || 0) + 1;
            });
        }
    });
    
    const porcentajeEnfermas = (mascotasEnfermas.length / todasLasMascotas.length) * 100;
    
    let riesgoEpidemia = "Bajo";
    if (porcentajeEnfermas > 50) riesgoEpidemia = "Crítico";
    else if (porcentajeEnfermas > 30) riesgoEpidemia = "Alto";
    else if (porcentajeEnfermas > 15) riesgoEpidemia = "Moderado";
    
    const recomendaciones = [];
    if (porcentajeEnfermas > 20) {
        recomendaciones.push("Cuarentena preventiva para mascotas sanas");
        recomendaciones.push("Desinfección de áreas comunes");
        recomendaciones.push("Monitoreo diario de temperatura");
    }
    
    if (condiciones["Infección por baja inmunidad"] > 2) {
        recomendaciones.push("Programa masivo de suplementos vitamínicos");
    }
    
    if (condiciones["Obesidad"] > 3) {
        recomendaciones.push("Programa de control de peso colectivo");
    }
    
    return {
        totalMascotas: todasLasMascotas.length,
        mascotasEnfermas: mascotasEnfermas.length,
        porcentajeEnfermas: Math.round(porcentajeEnfermas),
        condicionesComunes: Object.entries(condiciones)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([condicion, cantidad]) => ({ condicion, cantidad })),
        riesgoEpidemia,
        recomendacionesGenerales: recomendaciones,
        mascotasCriticas: mascotasEnfermas.filter(m => m.salud < 20).map(m => ({
            id: m.id,
            tipo: m.tipo,
            salud: m.salud,
            condiciones: m.condicionesMedicas || []
        }))
    };
}

// Simular negligencia
async function simularNegligencia(id, dias) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );
    
    Object.assign(mascota, mascotaData);

    // Simular abandono por días
    const fechaAnterior = new Date();
    fechaAnterior.setDate(fechaAnterior.getDate() - dias);
    mascota.ultimoCuidado = fechaAnterior.toISOString();
    
    // Efectos devastadores del abandono
    mascota.hambre = Math.min(100, mascota.hambre + (dias * 30));
    mascota.sed = Math.min(100, mascota.sed + (dias * 35));
    mascota.estres = Math.min(100, mascota.estres + (dias * 25));
    mascota.energia = Math.max(0, mascota.energia - (dias * 20));
    mascota.inmunidad = Math.max(0, mascota.inmunidad - (dias * 15));
    mascota.felicidad = Math.max(0, mascota.felicidad - (dias * 30));
    
    // Pérdida de peso por inanición
    mascota.peso = Math.max(mascota.calcularPesoIdeal() * 0.4, mascota.peso - (dias * 3));
    
    // Condiciones médicas por negligencia
    if (dias >= 2) mascota.agregarCondicionMedica("Abandono prolongado");
    if (dias >= 3) mascota.agregarCondicionMedica("Desnutrición por negligencia");
    if (dias >= 4) mascota.agregarCondicionMedica("Trauma psicológico");
    if (dias >= 5) mascota.agregarCondicionMedica("Estado crítico por abandono");
    
    mascota.aplicarDegradacionRealista();
    
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    const efectos = [
        `Hambre: +${dias * 30}%`,
        `Sed: +${dias * 35}%`,
        `Estrés: +${dias * 25}%`,
        `Energía: -${dias * 20}%`,
        `Inmunidad: -${dias * 15}%`,
        `Felicidad: -${dias * 30}%`,
        `Peso: -${dias * 3}kg`
    ];
    
    return {
        exito: true,
        mensaje: `${mascota.tipo} sufrió ${dias} días de abandono. Estado actual: ${mascota.estado}`,
        efectosDevastadores: efectos,
        estadoCritico: mascota.salud < 30,
        puedeRecuperarse: mascota.salud > 0,

    };
}

// Matar mascota (por negligencia extrema)
async function matarMascota(id, causa = "Negligencia extrema") {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );
    
    Object.assign(mascota, mascotaData);
    
    const resultado = mascota.matarMascota(causa);
    
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    return resultado;
}

// Obtener solo mascotas vivas
async function getMascotasVivas() {
    const todasLasMascotas = await getAllMascotas();
    return todasLasMascotas.filter(mascota => mascota.viva !== false);
}

// Obtener solo mascotas muertas
async function getMascotasMuertas() {
    const todasLasMascotas = await getAllMascotas();
    return todasLasMascotas.filter(mascota => mascota.viva === false).map(mascota => ({
        id: mascota.id,
        tipo: mascota.tipo,
        superpoder: mascota.superpoder,
        fechaMuerte: mascota.fechaMuerte,
        causaMuerte: mascota.causaMuerte,
        puedeSerRevivida: mascota.puedeSerRevivida(),
        edadAlMorir: mascota.edad,
        rareza: mascota.rareza,
        elemento: mascota.elemento
    }));
}

// Revivir mascota muerta
async function revivirMascotaMuerta(id) {
    const mascotas = await mascotaRepository.getMascotas();
    const mascotaIndex = mascotas.findIndex(m => m.id === parseInt(id));
    
    if (mascotaIndex === -1) {
        throw new Error('Mascota no encontrada');
    }

    const mascotaData = mascotas[mascotaIndex];
    const mascota = new Mascota(
        mascotaData.id,
        mascotaData.tipo,
        mascotaData.superpoder,
        mascotaData.salud || 100,
        mascotaData.felicidad || 100,
        mascotaData.estado || "Sunny",
        mascotaData.enfermo || false,
        mascotaData.ultimoCuidado
    );
    
    Object.assign(mascota, mascotaData);
    
    if (mascota.viva) {
        throw new Error('Esta mascota ya está viva');
    }
    
    const resultado = mascota.revivirMascota();
    
    mascotas[mascotaIndex] = mascota;
    await mascotaRepository.saveMascotas(mascotas);
    
    return resultado;
}

export default {
    getAllMascotas,
    getMascotaById,
    getMascotaByIdAsModel,
    addMascota,
    updateMascota,
    deleteMascota,
    usarItem,
    alimentarMascota,
    curarMascota,
    jugarConMascota,
    getEstadisticasMascota,
    usarPoderEspecial,
    obtenerPorRareza,
    obtenerPorElemento,
    obtenerRankingPoder,
    simularBatalla,
    // Métodos realistas básicos
    alimentarMascotaRealista,
    darAguaMascota,
    descansarMascota,
    ejercitarMascota,
    cambiarCondicionesAmbientales,
    getMascotasCriticas,
    revivirMascota,
    // Métodos de muerte y resurrección
    matarMascota,
    getMascotasVivas,
    getMascotasMuertas,
    revivirMascotaMuerta,
    getReporteEpidemiologico,
    simularNegligencia
}; 