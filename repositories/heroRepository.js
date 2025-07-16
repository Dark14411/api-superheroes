import fs from 'fs-extra'
import Hero from '../models/heroModel.js'

const filePath = './data/superheroes.json'

async function getHeroes() {
    try {
        const data = await fs.readJson(filePath)
        return data.map(hero => new Hero(
            hero.id, hero.name, hero.alias, hero.city, hero.team, hero.mascotaId
        ))
    } catch (error) {
        console.error('Error leyendo héroes:', error)
        return []
    }
}

async function saveHeroes(heroes) {
    try {
        // Convertir las instancias de Hero a objetos planos para guardar
        const heroesData = heroes.map(hero => ({
            id: hero.id,
            name: hero.name,
            alias: hero.alias,
            city: hero.city,
            team: hero.team,
            mascotaId: hero.mascotaId
        }))
        
        await fs.writeJson(filePath, heroesData, { spaces: 2 })
    } catch (error) {
        console.error('Error guardando héroes:', error)
        throw new Error('No se pudo guardar los héroes')
    }
}

export default {
    getHeroes,
    saveHeroes
} 