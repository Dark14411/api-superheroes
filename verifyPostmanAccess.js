import fetch from 'node-fetch';

const RENDER_URL = 'https://api-superheroes-ftut.onrender.com';

// Credenciales actuales para Postman
const CURRENT_CREDENTIALS = {
    username: 'postman_user_1752859858386',
    password: 'password123',
    apiKey: 'user_39e1ede5b3b91d5bb57f9cac519eed3a_1752859861589'
};

// Función para verificar acceso desde Postman
async function verifyPostmanAccess() {
    try {
        console.log('🔍 Verificando acceso desde Postman...\n');
        console.log(`🌐 URL: ${RENDER_URL}`);
        
        // 1. Verificar que las credenciales siguen funcionando
        console.log('1️⃣ Verificando credenciales actuales...');
        console.log(`   Username: ${CURRENT_CREDENTIALS.username}`);
        console.log(`   API Key: ${CURRENT_CREDENTIALS.apiKey.substring(0, 20)}...`);
        
        const loginResponse = await fetch(`${RENDER_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: CURRENT_CREDENTIALS.username,
                password: CURRENT_CREDENTIALS.password
            })
        });

        console.log(`   Login Status: ${loginResponse.status}`);
        
        if (loginResponse.ok) {
            console.log('   ✅ Credenciales válidas');
            const loginData = await loginResponse.json();
            console.log(`   🔑 API Key actual: ${loginData.data?.apiKey ? 'Válida' : 'No válida'}`);
        } else {
            console.log('   ❌ Credenciales expiradas');
        }

        // 2. Verificar acceso a héroes con API Key
        console.log('\n2️⃣ Verificando acceso a héroes...');
        const heroesResponse = await fetch(`${RENDER_URL}/api/heroes`, {
            headers: {
                'x-api-key': CURRENT_CREDENTIALS.apiKey
            }
        });

        console.log(`   Heroes Status: ${heroesResponse.status}`);
        
        if (heroesResponse.ok) {
            const heroesData = await heroesResponse.json();
            console.log(`   ✅ Acceso a héroes: ${heroesData.heroes?.length || 0} héroes disponibles`);
            
            if (heroesData.heroes && heroesData.heroes.length > 0) {
                const firstHero = heroesData.heroes[0];
                console.log(`   🎯 Primer héroe: ${firstHero.alias} (ID: ${firstHero._id})`);
            }
        } else {
            console.log('   ❌ No se puede acceder a héroes');
        }

        // 3. Verificar endpoint enfrentar
        console.log('\n3️⃣ Verificando endpoint enfrentar...');
        if (heroesResponse.ok) {
            const heroesData = await heroesResponse.json();
            if (heroesData.heroes && heroesData.heroes.length > 0) {
                const heroId = heroesData.heroes[0]._id;
                
                const enfrentarResponse = await fetch(`${RENDER_URL}/api/heroes/${heroId}/enfrentar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': CURRENT_CREDENTIALS.apiKey
                    },
                    body: JSON.stringify({
                        villano: "Dr. Octopus"
                    })
                });

                console.log(`   Enfrentar Status: ${enfrentarResponse.status}`);
                
                if (enfrentarResponse.ok) {
                    console.log('   ✅ Endpoint enfrentar funcionando');
                } else {
                    console.log('   ❌ Endpoint enfrentar con problemas');
                }
            }
        }

        console.log('\n🎉 ¡Verificación de Postman completada!');
        console.log('\n📋 Configuración para Postman:');
        console.log(`   Base URL: ${RENDER_URL}`);
        console.log(`   Username: ${CURRENT_CREDENTIALS.username}`);
        console.log(`   Password: ${CURRENT_CREDENTIALS.password}`);
        console.log(`   API Key: ${CURRENT_CREDENTIALS.apiKey}`);
        
        console.log('\n🔧 Endpoints principales:');
        console.log(`   Login: POST ${RENDER_URL}/api/auth/login`);
        console.log(`   Heroes: GET ${RENDER_URL}/api/heroes`);
        console.log(`   Enfrentar: POST ${RENDER_URL}/api/heroes/:id/enfrentar`);
        console.log(`   Swagger: ${RENDER_URL}/api-docs`);

    } catch (error) {
        console.error('❌ Error verificando acceso:', error.message);
    }
}

// Ejecutar verificación
verifyPostmanAccess(); 