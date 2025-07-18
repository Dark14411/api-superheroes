import fetch from 'node-fetch';

const RENDER_URL = 'https://api-superheroes-ftut.onrender.com';

// Función para registrar un nuevo usuario
async function registerUser() {
    try {
        console.log('👤 Registrando nuevo usuario en Render...');
        
        const username = 'postman_user_' + Date.now();
        const email = `postman${Date.now()}@example.com`;
        const password = 'password123';
        
        const response = await fetch(`${RENDER_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        console.log(`📊 Status: ${response.status}`);
        console.log(`📝 Response:`, JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ Usuario registrado exitosamente!');
            console.log(`👤 Username: ${username}`);
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 API Key: ${data.apiKey}`);
            
            return {
                username: username,
                password: password,
                apiKey: data.apiKey
            };
        } else {
            console.log('❌ Error registrando usuario');
            return null;
        }
    } catch (error) {
        console.error('❌ Error registrando usuario:', error.message);
        return null;
    }
}

// Función para hacer login con el usuario creado
async function loginUser(username, password) {
    try {
        console.log('\n🔐 Probando login con el usuario creado...');
        
        const response = await fetch(`${RENDER_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        
        console.log(`📊 Status: ${response.status}`);
        console.log(`📝 Response:`, JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ Login exitoso!');
            return data.apiKey;
        } else {
            console.log('❌ Login falló');
            return null;
        }
    } catch (error) {
        console.error('❌ Error en login:', error.message);
        return null;
    }
}

// Función principal
async function main() {
    console.log('🚀 Creando usuario para Postman...\n');
    console.log(`🌐 URL: ${RENDER_URL}`);

    // 1. Registrar usuario
    const userData = await registerUser();
    if (!userData) {
        console.log('\n❌ No se pudo crear usuario');
        return;
    }

    // 2. Probar login
    const apiKey = await loginUser(userData.username, userData.password);
    if (!apiKey) {
        console.log('\n❌ No se pudo hacer login');
        return;
    }

    console.log('\n🎉 ¡Usuario creado y verificado exitosamente!');
    console.log('\n📋 Configuración para Postman:');
    console.log(`   Base URL: ${RENDER_URL}`);
    console.log(`   Username: ${userData.username}`);
    console.log(`   Password: ${userData.password}`);
    console.log(`   API Key: ${apiKey}`);
    
    console.log('\n🔧 Configuración específica para login:');
    console.log(`   URL: ${RENDER_URL}/api/auth/login`);
    console.log(`   Method: POST`);
    console.log(`   Headers: Content-Type: application/json`);
    console.log(`   Body: {"username": "${userData.username}", "password": "${userData.password}"}`);
}

// Ejecutar
main().catch(console.error); 