import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

console.log('🔍 DEBUG: Sistema de Autenticación');
console.log('==================================');
console.log('');

// Función para hacer requests
async function makeRequest(url, options = {}) {
  try {
    console.log(`🌐 Request: ${options.method || 'GET'} ${url}`);
    if (options.headers) {
      console.log(`📋 Headers:`, options.headers);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    console.log('');
    
    return { status: response.status, data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('');
    return { status: 'ERROR', data: { error: error.message } };
  }
}

// Test 1: Verificar que el servidor está funcionando
console.log('1️⃣ Verificando servidor...');
const serverTest = await makeRequest(`${BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'debuguser_' + Date.now(),
    password: '123'
  })
});

if (serverTest.status !== 201) {
  console.log('❌ Error: No se pudo conectar al servidor o registrar usuario');
  process.exit(1);
}

const userApiKey = serverTest.data.data.apiKey;
console.log(`✅ Usuario registrado con API Key: ${userApiKey}`);
console.log('');

// Test 2: Probar endpoint protegido con API Key
console.log('2️⃣ Probando endpoint protegido con API Key...');
const protectedTest = await makeRequest(`${BASE_URL}/api/heroes`, {
  headers: {
    'x-api-key': userApiKey
  }
});

if (protectedTest.status === 200) {
  console.log('✅ API Key funciona correctamente');
} else {
  console.log('❌ API Key no funciona');
}

// Test 3: Probar endpoint protegido sin API Key
console.log('3️⃣ Probando endpoint protegido sin API Key...');
const noKeyTest = await makeRequest(`${BASE_URL}/api/heroes`);

if (noKeyTest.status === 401) {
  console.log('✅ Protección funciona correctamente');
} else {
  console.log('❌ Protección no funciona');
}

// Test 4: Probar con API Key en header diferente
console.log('4️⃣ Probando con header X-API-Key...');
const headerTest = await makeRequest(`${BASE_URL}/api/heroes`, {
  headers: {
    'X-API-Key': userApiKey
  }
});

if (headerTest.status === 200) {
  console.log('✅ Header X-API-Key funciona');
} else {
  console.log('❌ Header X-API-Key no funciona');
}

// Test 5: Verificar perfil del usuario
console.log('5️⃣ Verificando perfil del usuario...');
const profileTest = await makeRequest(`${BASE_URL}/api/auth/profile`, {
  headers: {
    'x-api-key': userApiKey
  }
});

if (profileTest.status === 200) {
  console.log('✅ Perfil accesible correctamente');
  console.log(`   Usuario: ${profileTest.data.data.user.username}`);
  console.log(`   Auth Type: ${profileTest.data.data.authType}`);
} else {
  console.log('❌ No se puede acceder al perfil');
}

console.log('');
console.log('🎯 RESUMEN DEL DIAGNÓSTICO:');
console.log(`   API Key: ${userApiKey}`);
console.log(`   Endpoint protegido: ${protectedTest.status === 200 ? '✅ Funciona' : '❌ No funciona'}`);
console.log(`   Protección sin key: ${noKeyTest.status === 401 ? '✅ Funciona' : '❌ No funciona'}`);
console.log(`   Header alternativo: ${headerTest.status === 200 ? '✅ Funciona' : '❌ No funciona'}`);
console.log(`   Perfil usuario: ${profileTest.status === 200 ? '✅ Funciona' : '❌ No funciona'}`); 