import fs from 'fs';
import path from 'path';

console.log('🔧 Actualizando configuración local...');
console.log('');

const envContent = `# Configuración de la base de datos
MONGODB_URI=mongodb+srv://Dark144:Cooper144467@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas

# Puerto del servidor
PORT=3001

# Configuración de entorno
NODE_ENV=development

# Configuración de ApiKeyAuth (apiKey)
API_KEY_AUTH_ENABLED=true
API_KEY_HEADER_NAME=X-API-Key
API_KEY_QUERY_PARAM=apiKey
API_KEY_REQUIRED=true

# Configuración JWT
JWT_SECRET=tu_jwt_secret_super_seguro_2024
JWT_EXPIRES_IN=24h

# Configuración de Usecurs
USECURS_ENABLED=true
USECURS_URL=https://api.usecurs.com
USECURS_API_KEY=tu_usecurs_api_key
`;

try {
    fs.writeFileSync('.env', envContent);
    console.log('✅ Archivo .env actualizado correctamente');
    console.log('');
    console.log('📋 Contenido del archivo .env:');
    console.log(envContent);
    console.log('');
    console.log('🚀 Ahora puedes ejecutar: npm start');
    console.log('');
    console.log('✅ Resultado esperado:');
    console.log('✅ MongoDB conectado: ac-9qu7uxk-shard-00-00.mlzaawc.mongodb.net');
    console.log(' Servidor corriendo en el puerto 3001');
    console.log('📚 Documentación Swagger disponible en: http://localhost:3001/api-docs');
    
} catch (error) {
    console.error('❌ Error al actualizar .env:', error.message);
    console.log('');
    console.log('📋 Copia y pega este contenido en tu archivo .env:');
    console.log(envContent);
} 