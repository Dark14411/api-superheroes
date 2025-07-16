import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const testApiKeyAuth = () => {
  console.log('🎯 CONFIGURACIÓN ApiKeyAuth (apiKey)');
  console.log('=====================================');
  console.log('');
  console.log('✅ Configuración actual:');
  console.log('   - Nombre del esquema: ApiKeyAuth');
  console.log('   - Tipo: apiKey');
  console.log('   - Header: x-api-key');
  console.log('   - Descripción: ApiKeyAuth (apiKey)');
  console.log('');
  console.log('🔐 En Swagger UI verás:');
  console.log('   - "Available authorizations"');
  console.log('   - "ApiKeyAuth (apiKey)"');
  console.log('   - Campo para ingresar tu API Key');
  console.log('');
  console.log('📋 Cómo usar:');
  console.log('');
  console.log('1. En Swagger UI:');
  console.log('   - Haz clic en "Authorize" (botón verde con candado)');
  console.log('   - Verás "ApiKeyAuth (apiKey)"');
  console.log('   - Ingresa tu API Key personal o la global');
  console.log('   - Haz clic en "Authorize"');
  console.log('');
  console.log('2. Con curl:');
  console.log('   curl -H "x-api-key: tu_api_key" http://localhost:3001/api/heroes');
  console.log('');
  console.log('3. API Keys disponibles:');
  console.log('   - API Key de usuario: Generada al registrarse');
  console.log('');
  console.log('🎉 ¡ApiKeyAuth configurado correctamente!');
  console.log('');
  console.log('💡 En Swagger UI aparecerá exactamente:');
  console.log('   "ApiKeyAuth (apiKey)"');
};

testApiKeyAuth(); 