import heroRepository from '../repositories/heroRepository.js'
import mascotaRepository from '../repositories/mascotaRepository.js'
import Hero from '../models/heroModel.js'

async function getAllHeroes() {
    try {
        // Usar directamente el modelo Hero de Mongoose
        const heroes = await Hero.find().populate('mascotaId');
        return heroes;
    } catch (error) {
        throw new Error(`Error al obtener héroes: ${error.message}`);
    }
}

async function getHeroById(id) {
    try {
        const hero = await Hero.findById(id).populate('mascotaId');
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
        return hero;
    } catch (error) {
        throw new Error(`Error al obtener héroe: ${error.message}`);
    }
}

async function addHero(heroData) {
    try {
        if (!heroData.name || !heroData.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }
    
    // Verificar si la mascota ya está adoptada por otro héroe
        if (heroData.mascotaId) {
            const mascotaAdoptada = await Hero.findOne({ mascotaId: heroData.mascotaId });
        if (mascotaAdoptada) {
                throw new Error(`La mascota con ID ${heroData.mascotaId} ya está adoptada por ${mascotaAdoptada.name}`);
        }
    }
    
        const newHero = new Hero(heroData);
        const savedHero = await newHero.save();
        return savedHero;
    } catch (error) {
        throw new Error(`Error al crear héroe: ${error.message}`);
    }
}

async function updateHero(id, updatedHero) {
    try {
        const hero = await Hero.findByIdAndUpdate(id, updatedHero, { new: true }).populate('mascotaId');
        if (!hero) {
            throw new Error('Héroe no encontrado');
        }
        return hero;
    } catch (error) {
        throw new Error(`Error al actualizar héroe: ${error.message}`);
    }
}

async function deleteHero(id) {
    try {
        const hero = await Hero.findByIdAndDelete(id);
        if (!hero) {
            throw new Error('Héroe no encontrado');
        }
        return { message: 'Héroe eliminado' };
    } catch (error) {
        throw new Error(`Error al eliminar héroe: ${error.message}`);
    }
}



async function enfrentarVillano(hero, villano) {
    if (!hero || !villano) {
        throw new Error('Héroe y villano son requeridos');
    }
    
    // Simular resultado del enfrentamiento
    const resultados = [
        `${hero.alias} derrotó a ${villano} con facilidad!`,
        `${hero.alias} tuvo una batalla épica contra ${villano} y salió victorioso!`,
        `${hero.alias} luchó valientemente contra ${villano} pero necesitó ayuda de su equipo.`,
        `${hero.alias} y ${villano} tuvieron un empate, ambos se retiraron para luchar otro día.`,
        `${hero.alias} fue derrotado temporalmente por ${villano}, pero prometió vengarse!`
    ];
    
    const resultado = resultados[Math.floor(Math.random() * resultados.length)];
    
    return {
        heroe: hero.alias,
        villano: villano,
        resultado: resultado,
        fecha: new Date().toISOString()
    };
}

async function adoptarMascota(hero, mascotaId) {
    const heroes = await heroRepository.getHeroes();
    const mascotas = await mascotaRepository.getMascotas();
    
    const heroIndex = heroes.findIndex(h => h.id === hero.id);
    if (heroIndex === -1) {
        throw new Error('Héroe no encontrado');
    }
    
    const mascota = mascotas.find(m => m.id === parseInt(mascotaId));
    if (!mascota) {
        throw new Error('Mascota no encontrada');
    }
    
    // Verificar si la mascota ya está adoptada por otro héroe
    const mascotaAdoptada = heroes.find(h => h.mascotaId === parseInt(mascotaId));
    if (mascotaAdoptada) {
        throw new Error(`La mascota ${mascota.tipo} ya está adoptada por ${mascotaAdoptada.alias}`);
    }
    
    // Verificar si el héroe ya tiene una mascota
    if (heroes[heroIndex].mascotaId) {
        const mascotaActual = mascotas.find(m => m.id === heroes[heroIndex].mascotaId);
        throw new Error(`${heroes[heroIndex].alias} ya tiene una mascota: ${mascotaActual.tipo}. Debe abandonar su mascota actual antes de adoptar una nueva.`);
    }
    
    heroes[heroIndex].mascotaId = parseInt(mascotaId);
    await heroRepository.saveHeroes(heroes);
    
    return {
        ...heroes[heroIndex],
        mascota: mascota
    };
}

async function abandonarMascota(hero) {
    const heroes = await heroRepository.getHeroes();
    const mascotas = await mascotaRepository.getMascotas();
    
    const heroIndex = heroes.findIndex(h => h.id === hero.id);
    if (heroIndex === -1) {
        throw new Error('Héroe no encontrado');
    }
    
    if (!heroes[heroIndex].mascotaId) {
        throw new Error(`${heroes[heroIndex].alias} no tiene mascota adoptada`);
    }
    
    const mascotaId = heroes[heroIndex].mascotaId;
    const mascota = mascotas.find(m => m.id === mascotaId);
    
    heroes[heroIndex].mascotaId = null;
    await heroRepository.saveHeroes(heroes);
    
    return {
        ...heroes[heroIndex],
        mascota: null
    };
}

export default {
    getAllHeroes,
    getHeroById,
    addHero,
    updateHero,
    deleteHero,
    enfrentarVillano,
    adoptarMascota,
    abandonarMascota
} 