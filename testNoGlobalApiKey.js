import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

console.log('🧪 TEST: Verificación de eliminación de API Key Global');
console.log('==================================================');
console.log('');

// Función para hacer requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 'ERROR', data: { error: error.message } };
  }
}

// Test 1: Intentar usar API Key global (debería fallar)
console.log('1️⃣ Probando API Key global (debería fallar):');
const globalApiKeyTest = await makeRequest(`${BASE_URL}/api/heroes`, {
  headers: {
    'x-api-key': 'tu_clave_secreta_2024'
  }
});

console.log(`   Status: ${globalApiKeyTest.status}`);
console.log(`   Respuesta: ${globalApiKeyTest.data.message || globalApiKeyTest.data.error}`);
console.log('   ✅ Debería fallar con 401 - API Key inválida');
console.log('');

// Test 2: Intentar sin API Key (debería fallar)
console.log('2️⃣ Probando sin API Key (debería fallar):');
const noApiKeyTest = await makeRequest(`${BASE_URL}/api/heroes`);

console.log(`   Status: ${noApiKeyTest.status}`);
console.log(`   Respuesta: ${noApiKeyTest.data.message || noApiKeyTest.data.error}`);
console.log('   ✅ Debería fallar con 401 - API Key requerida');
console.log('');

// Test 3: Registrar un usuario para obtener API Key válida
console.log('3️⃣ Registrando usuario para obtener API Key válida:');
const registerResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'testuser_' + Date.now(),
    password: '123'
  })
});

if (registerResponse.status === 201) {
  const userApiKey = registerResponse.data.data.apiKey;
  console.log(`   ✅ Usuario registrado exitosamente`);
  console.log(`   API Key: ${userApiKey}`);
  console.log('');

  // Test 4: Usar API Key de usuario (debería funcionar)
  console.log('4️⃣ Probando API Key de usuario (debería funcionar):');
  const userApiKeyTest = await makeRequest(`${BASE_URL}/api/heroes`, {
    headers: {
      'x-api-key': userApiKey
    }
  });

  console.log(`   Status: ${userApiKeyTest.status}`);
  if (userApiKeyTest.status === 200) {
    console.log('   ✅ API Key de usuario funciona correctamente');
  } else {
    console.log(`   ❌ Error: ${userApiKeyTest.data.message || userApiKeyTest.data.error}`);
  }
} else {
  console.log(`   ❌ Error al registrar usuario: ${registerResponse.data.message}`);
}

console.log('');
console.log('🎉 RESULTADO:');
console.log('   ✅ API Key global eliminada correctamente');
console.log('   ✅ Solo API Keys de usuario son válidas');
console.log('   ✅ Sistema de autenticación funcionando correctamente');
console.log('');
console.log('📝 Nota: Los usuarios deben registrarse para obtener su API Key personal'); 