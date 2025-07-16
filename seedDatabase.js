import dotenv from 'dotenv'
import connectDB from './config/database.js'
import Hero from './models/heroModel.js'
import Mascota from './models/mascotaSchema.js'
import Item from './models/itemModel.js'
import fs from 'fs'
import path from 'path'

// Cargar variables de entorno
dotenv.config()

// Datos de héroes (usando el array que proporcionaste)
const heroesData = [
  {
    "id": 1,
    "name": "Clark Kent",
    "alias": "Superman",
    "city": "Metrópolis",
    "team": "Liga de la Justicia"
  },
  {
    "id": 2,
    "name": "Tony Stark",
    "alias": "Iron Man",
    "city": "Nueva York",
    "team": "Los Vengadores"
  },
  {
    "id": 3,
    "name": "Bruce Wayne",
    "alias": "Batman",
    "city": "Gotham City",
    "team": "Liga de la Justicia"
  },
  {
    "id": 4,
    "name": "Steve Rogers",
    "alias": "Capitán América",
    "city": "Nueva York",
    "team": "Los Vengadores"
  },
  {
    "id": 5,
    "name": "Diana Prince",
    "alias": "Mujer Maravilla",
    "city": "Themyscira",
    "team": "Liga de la Justicia"
  },
  {
    "id": 6,
    "name": "Thor Odinson",
    "alias": "Thor",
    "city": "Asgard",
    "team": "Los Vengadores"
  },
  {
    "id": 7,
    "name": "Barry Allen",
    "alias": "Flash",
    "city": "Central City",
    "team": "Liga de la Justicia"
  },
  {
    "id": 8,
    "name": "Bruce Banner",
    "alias": "Hulk",
    "city": "Dayton",
    "team": "Los Vengadores"
  },
  {
    "id": 9,
    "name": "Arthur Curry",
    "alias": "Aquaman",
    "city": "Atlantis",
    "team": "Liga de la Justicia"
  },
  {
    "id": 10,
    "name": "Peter Parker",
    "alias": "Spider-Man",
    "city": "Nueva York",
    "team": "Ninguno"
  },
  {
    "id": 11,
    "name": "Hal Jordan",
    "alias": "Linterna Verde",
    "city": "Coast City",
    "team": "Liga de la Justicia"
  },
  {
    "id": 12,
    "name": "Natasha Romanoff",
    "alias": "Viuda Negra",
    "city": "Moscú",
    "team": "Los Vengadores"
  },
  {
    "id": 13,
    "name": "Oliver Queen",
    "alias": "Green Arrow",
    "city": "Star City",
    "team": "Liga de la Justicia"
  },
  {
    "id": 14,
    "name": "Clint Barton",
    "alias": "Ojo de Halcón",
    "city": "Waverly",
    "team": "Los Vengadores"
  },
  {
    "id": 15,
    "name": "Victor Stone",
    "alias": "Cyborg",
    "city": "Detroit",
    "team": "Liga de la Justicia"
  },
  {
    "id": 16,
    "name": "Stephen Vincent Strange",
    "alias": "Doctor Strange",
    "city": "Nueva York",
    "team": "Los Vengadores"
  },
  {
    "id": 17,
    "name": "Billy Batson",
    "alias": "Shazam",
    "city": "Fawcett City",
    "team": "Liga de la Justicia"
  },
  {
    "id": 18,
    "name": "T'Challa",
    "alias": "Black Panther",
    "city": "Wakanda",
    "team": "Los Vengadores"
  },
  {
    "id": 19,
    "name": "Kara Danvers",
    "alias": "Supergirl",
    "city": "National City",
    "team": "Ninguno"
  },
  {
    "id": 20,
    "name": "Wanda Maximoff",
    "alias": "Bruja Escarlata",
    "city": "Transia",
    "team": "Los Vengadores"
  },
  {
    "id": 21,
    "name": "Dick Grayson",
    "alias": "Nightwing",
    "city": "Blüdhaven",
    "team": "Ninguno"
  },
  {
    "id": 22,
    "name": "Charles Xavier",
    "alias": "Profesor X",
    "city": "Salem Center",
    "team": "X-Men"
  },
  {
    "id": 23,
    "name": "Barbara Gordon",
    "alias": "Batgirl",
    "city": "Gotham City",
    "team": "Birds of Prey"
  },
  {
    "id": 24,
    "name": "James Howlett",
    "alias": "Wolverine",
    "city": "Canadá",
    "team": "X-Men"
  },
  {
    "id": 25,
    "name": "J'onn J'onzz",
    "alias": "Detective Marciano",
    "city": "Ninguna",
    "team": "Liga de la Justicia"
  },
  {
    "id": 26,
    "name": "Ororo Munroe",
    "alias": "Tormenta",
    "city": "El Cairo",
    "team": "X-Men"
  },
  {
    "id": 27,
    "name": "Kate Kane",
    "alias": "Batwoman",
    "city": "Gotham City",
    "team": "Ninguno"
  },
  {
    "id": 28,
    "name": "Scott Summers",
    "alias": "Cíclope",
    "city": "Anchorage",
    "team": "X-Men"
  },
  {
    "id": 29,
    "name": "Kyle Rayner",
    "alias": "Linterna Verde",
    "city": "Los Ángeles",
    "team": "Liga de la Justicia"
  },
  {
    "id": 30,
    "name": "Jean Grey",
    "alias": "Fénix",
    "city": "Annandale-on-Hudson",
    "team": "X-Men"
  }
]

// Función para adaptar datos de mascotas
function adaptarMascota(mascotaOriginal) {
    // Mapeo de tipos
    const tipoMapping = {
        'Dragón': 'dragon',
        'Fénix': 'fenix',
        'Unicornio': 'unicornio',
        'Grifo': 'grifo',
        'Sirena': 'sirena',
        'Minotauro': 'minotauro',
        'Hidra': 'hidra',
        'Pegaso': 'dragon', // Fallback
        'Quimera': 'quimera',
        'Basilisco': 'basilisco'
    }

    // Mapeo de elementos
    const elementoMapping = {
        'Fuego': 'fuego',
        'Agua': 'agua',
        'Tierra': 'tierra',
        'Aire': 'aire',
        'Luz': 'luz',
        'Oscuridad': 'oscuridad',
        'Electricidad': 'electricidad',
        'Hielo': 'hielo',
        'Veneno': 'veneno',
        'Psíquico': 'psiquico'
    }

    // Adaptar enfermedades
    const enfermedadesAdaptadas = mascotaOriginal.enfermedades.map(enfermedad => {
        if (typeof enfermedad === 'string') {
            return {
                tipo: 'gripe', // Fallback a una enfermedad válida
                fechaInicio: new Date(),
                curada: false
            }
        }
        return enfermedad
    })

    return {
        ...mascotaOriginal,
        nombre: mascotaOriginal.nombre || `Mascota_${mascotaOriginal.id}`,
        tipo: tipoMapping[mascotaOriginal.tipo] || 'dragon',
        elemento: elementoMapping[mascotaOriginal.elemento] || 'fuego',
        poder: mascotaOriginal.poder || 'Poder básico',
        enfermedades: enfermedadesAdaptadas,
        // Asegurar que las fechas sean objetos Date
        fechaCreacion: new Date(mascotaOriginal.fechaCreacion || Date.now()),
        fechaUltimaActualizacion: new Date(mascotaOriginal.fechaUltimaActualizacion || Date.now())
    }
}

const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando población de la base de datos...')
        
        // Conectar a MongoDB Atlas
        await connectDB()
        
        // Limpiar colecciones existentes
        console.log('🧹 Limpiando colecciones existentes...')
        await Hero.deleteMany({})
        await Mascota.deleteMany({})
        await Item.deleteMany({})
        
        // Insertar héroes
        console.log('🦸‍♂️ Insertando héroes...')
        const heroesInserted = await Hero.insertMany(heroesData)
        console.log(`✅ ${heroesInserted.length} héroes insertados`)
        
        // Leer y adaptar mascotas desde el archivo JSON
        console.log('🐉 Insertando mascotas...')
        const mascotasPath = path.join(process.cwd(), 'data', 'mascotas.json')
        const mascotasData = JSON.parse(fs.readFileSync(mascotasPath, 'utf8'))
        
        // Adaptar las primeras 30 mascotas
        const mascotasAdaptadas = mascotasData.slice(0, 30).map(adaptarMascota)
        const mascotasInserted = await Mascota.insertMany(mascotasAdaptadas)
        console.log(`✅ ${mascotasInserted.length} mascotas insertadas`)
        
        // Leer y insertar ítems desde el archivo JSON
        console.log('🎁 Insertando ítems...')
        const itemsPath = path.join(process.cwd(), 'data', 'items.json')
        const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'))
        
        // Adaptar ítems para que coincidan con el esquema
        const itemsAdaptados = itemsData.map(item => ({
            ...item,
            fechaCreacion: new Date(item.fechaCreacion || Date.now())
        }))
        
        const itemsInserted = await Item.insertMany(itemsAdaptados)
        console.log(`✅ ${itemsInserted.length} ítems insertados`)
        
        console.log('\n🎉 ¡Base de datos poblada exitosamente!')
        console.log(`📊 Resumen:`)
        console.log(`   - Héroes: ${heroesInserted.length}`)
        console.log(`   - Mascotas: ${mascotasInserted.length}`)
        console.log(`   - Ítems: ${itemsInserted.length}`)
        console.log('\n🌐 Puedes verificar en MongoDB Atlas Dashboard que los datos están guardados.')
        
        process.exit(0)
        
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error.message)
        process.exit(1)
    }
}

seedDatabase() 