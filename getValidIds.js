import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

// Función para hacer login y obtener API Key
async function getApiKey() {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                password: 'test123456'
            })
        });

        const data = await response.json();
        return data.data.apiKey;
    } catch (error) {
        console.error('❌ Error obteniendo API Key:', error.message);
        return null;
    }
}

// Función para obtener héroes y sus IDs
async function getHeroesWithIds(apiKey) {
    try {
        const response = await fetch(`${BASE_URL}/api/heroes`, {
            headers: {
                'x-api-key': apiKey
            }
        });

        const data = await response.json();
        return data.heroes;
    } catch (error) {
        console.error('❌ Error obteniendo héroes:', error.message);
        return [];
    }
}

// Función principal
async function main() {
    console.log('🔍 Obteniendo IDs válidos para Postman...\n');

    // 1. Obtener API Key
    console.log('1️⃣ Obteniendo API Key...');
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.log('❌ No se pudo obtener API Key');
        return;
    }
    console.log('✅ API Key obtenida\n');

    // 2. Obtener héroes
    console.log('2️⃣ Obteniendo héroes...');
    const heroes = await getHeroesWithIds(apiKey);
    if (heroes.length === 0) {
        console.log('❌ No se encontraron héroes');
        return;
    }
    console.log(`✅ ${heroes.length} héroes encontrados\n`);

    // 3. Mostrar IDs válidos
    console.log('📋 IDs VÁLIDOS PARA POSTMAN:');
    console.log('=' .repeat(60));
    
    heroes.slice(0, 10).forEach((hero, index) => {
        console.log(`${index + 1}. ${hero.alias} (${hero.name})`);
        console.log(`   ID: ${hero._id}`);
        console.log(`   Ciudad: ${hero.city}`);
        console.log(`   Equipo: ${hero.team}`);
        console.log('');
    });

    // 4. Mostrar configuración exacta para Postman
    const firstHero = heroes[0];
    console.log('🎯 CONFIGURACIÓN EXACTA PARA POSTMAN:');
    console.log('=' .repeat(60));
    console.log(`URL: ${BASE_URL}/api/heroes/${firstHero._id}/enfrentar`);
    console.log(`Method: POST`);
    console.log(`Headers:`);
    console.log(`  x-api-key: ${apiKey}`);
    console.log(`  Content-Type: application/json`);
    console.log(`Body (raw JSON):`);
    console.log(`{`);
    console.log(`  "villano": "Joker"`);
    console.log(`}`);
    console.log('');

    // 5. Probar el endpoint
    console.log('🧪 Probando endpoint...');
    try {
        const testResponse = await fetch(`${BASE_URL}/api/heroes/${firstHero._id}/enfrentar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify({
                villano: 'Joker'
            })
        });

        const testData = await testResponse.json();
        console.log('✅ Endpoint funcionando correctamente!');
        console.log('📄 Respuesta de ejemplo:');
        console.log(JSON.stringify(testData, null, 2));
    } catch (error) {
        console.log('❌ Error probando endpoint:', error.message);
    }

    console.log('\n💡 INSTRUCCIONES PARA POSTMAN:');
    console.log('1. Copia la URL exacta de arriba');
    console.log('2. Configura el método POST');
    console.log('3. Agrega los headers exactos');
    console.log('4. Pega el body JSON');
    console.log('5. ¡Envía la petición!');
}

// Ejecutar
main().catch(console.error); 