import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hero from './models/heroModel.js';
import fs from 'fs-extra';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://carlitoseuan2002:Cooper2024@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0';

async function checkAndPopulateHeroes() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Verificar si hay héroes en la base de datos
        const heroCount = await Hero.countDocuments();
        console.log(`📊 Héroes en la base de datos: ${heroCount}`);

        if (heroCount === 0) {
            console.log('📝 No hay héroes en la base de datos. Poblando...');
            
            // Leer datos del archivo JSON
            const heroesData = await fs.readJson('./data/superheroes.json');
            console.log(`📖 Leyendo ${heroesData.length} héroes del archivo JSON`);

            // Convertir datos para MongoDB (sin el campo 'id' que es para archivos JSON)
            const heroesForMongo = heroesData.map(hero => ({
                name: hero.name,
                alias: hero.alias,
                city: hero.city,
                team: hero.team,
                mascotaId: hero.mascotaId || null
            }));

            // Insertar héroes en MongoDB
            const insertedHeroes = await Hero.insertMany(heroesForMongo);
            console.log(`✅ ${insertedHeroes.length} héroes insertados en MongoDB`);
        } else {
            console.log('✅ Ya hay héroes en la base de datos');
        }

        // Mostrar algunos héroes como ejemplo
        const sampleHeroes = await Hero.find().limit(5);
        console.log('\n📋 Ejemplo de héroes en MongoDB:');
        sampleHeroes.forEach(hero => {
            console.log(`   - ${hero.alias} (${hero.name}) - ID: ${hero._id}`);
        });

        console.log('\n🎉 Verificación completada exitosamente!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
}

checkAndPopulateHeroes(); 