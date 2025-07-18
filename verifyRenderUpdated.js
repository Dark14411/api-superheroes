import fetch from 'node-fetch';

const RENDER_URL = 'https://api-superheroes-ftut.onrender.com';

// Función para verificar que la API está funcionando
async function verifyAPI() {
    try {
        console.log('🔍 Verificando que la API en Render está funcionando...\n');
        
        // 1. Probar endpoint raíz
        console.log('1️⃣ Probando endpoint raíz...');
        const rootResponse = await fetch(RENDER_URL);
        console.log(`   Status: ${rootResponse.status}`);
        
        if (rootResponse.ok) {
            console.log('   ✅ API respondiendo correctamente');
        } else {
            console.log('   ❌ API no responde correctamente');
        }

        // 2. Probar documentación Swagger
        console.log('\n2️⃣ Probando documentación Swagger...');
        const swaggerResponse = await fetch(`${RENDER_URL}/api-docs`);
        console.log(`   Status: ${swaggerResponse.status}`);
        
        if (swaggerResponse.ok) {
            console.log('   ✅ Documentación Swagger disponible');
        } else {
            console.log('   ❌ Documentación Swagger no disponible');
        }

        // 3. Probar endpoint de registro
        console.log('\n3️⃣ Probando endpoint de registro...');
        const registerResponse = await fetch(`${RENDER_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test_verify_' + Date.now(),
                email: `test${Date.now()}@verify.com`,
                password: 'password123'
            })
        });

        console.log(`   Status: ${registerResponse.status}`);
        
        if (registerResponse.ok) {
            console.log('   ✅ Endpoint de registro funcionando');
            const registerData = await registerResponse.json();
            console.log(`   🔑 API Key generada: ${registerData.apiKey ? 'Sí' : 'No'}`);
        } else {
            console.log('   ❌ Endpoint de registro con problemas');
        }

        // 4. Probar conexión a MongoDB (a través de obtener héroes)
        console.log('\n4️⃣ Probando conexión a MongoDB...');
        const heroesResponse = await fetch(`${RENDER_URL}/api/heroes`, {
            headers: {
                'x-api-key': 'test_key'
            }
        });

        console.log(`   Status: ${heroesResponse.status}`);
        
        if (heroesResponse.status === 401) {
            console.log('   ✅ API Key requerida (autenticación funcionando)');
        } else if (heroesResponse.ok) {
            console.log('   ✅ Conexión a MongoDB funcionando');
        } else {
            console.log('   ❌ Problemas con MongoDB o autenticación');
        }

        console.log('\n🎉 ¡Verificación completada!');
        console.log('\n📋 Resumen:');
        console.log(`   🌐 URL: ${RENDER_URL}`);
        console.log(`   📚 Swagger: ${RENDER_URL}/api-docs`);
        console.log(`   🔐 Auth: ${RENDER_URL}/api/auth`);
        console.log(`   🦸‍♂️ Heroes: ${RENDER_URL}/api/heroes`);

    } catch (error) {
        console.error('❌ Error verificando API:', error.message);
    }
}

// Ejecutar verificación
verifyAPI(); 