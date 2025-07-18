import fetch from 'node-fetch';

const RENDER_URL = 'https://api-superheroes-ftut.onrender.com';
const API_KEY = 'user_39e1ede5b3b91d5bb57f9cac519eed3a_1752859861589';

// Función para obtener héroes
async function getHeroes() {
    try {
        console.log('🦸‍♂️ Obteniendo héroes de la API...');
        
        const response = await fetch(`${RENDER_URL}/api/heroes`, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        const data = await response.json();
        
        console.log(`📊 Status: ${response.status}`);
        
        if (response.ok) {
            console.log(`✅ Se encontraron ${data.heroes?.length || 0} héroes`);
            
            if (data.heroes && data.heroes.length > 0) {
                console.log('\n📋 Lista de héroes disponibles:');
                data.heroes.forEach((hero, index) => {
                    console.log(`${index + 1}. ${hero.alias} (ID: ${hero._id})`);
                });
                
                const firstHero = data.heroes[0];
                console.log(`\n🎯 Héroe seleccionado para pruebas: ${firstHero.alias}`);
                console.log(`🆔 ID: ${firstHero._id}`);
                
                return firstHero;
            } else {
                console.log('❌ No hay héroes disponibles');
                return null;
            }
        } else {
            console.log('❌ Error obteniendo héroes');
            console.log('Response:', JSON.stringify(data, null, 2));
            return null;
        }
    } catch (error) {
        console.error('❌ Error obteniendo héroes:', error.message);
        return null;
    }
}

// Función principal
async function main() {
    console.log('🚀 Obteniendo ID de héroe válido...\n');
    console.log(`🌐 URL: ${RENDER_URL}`);
    console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);

    const hero = await getHeroes();
    
    if (hero) {
        console.log('\n🎉 ¡Héroe obtenido exitosamente!');
        console.log('\n📋 Configuración para Postman - Endpoint Enfrentar:');
        console.log(`   URL: ${RENDER_URL}/api/heroes/${hero._id}/enfrentar`);
        console.log(`   Method: POST`);
        console.log(`   Headers:`);
        console.log(`     Content-Type: application/json`);
        console.log(`     x-api-key: ${API_KEY}`);
        console.log(`   Body: {"villano": "Dr. Octopus"}`);
        console.log(`   Hero ID: ${hero._id}`);
        console.log(`   Hero Name: ${hero.alias}`);
    } else {
        console.log('\n❌ No se pudo obtener héroe');
    }
}

// Ejecutar
main().catch(console.error); 