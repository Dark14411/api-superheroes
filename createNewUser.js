import mongoose from 'mongoose';

// Script para probar con un nuevo usuario
const testNewUser = async () => {
    console.log('🔧 Instrucciones para crear nuevo usuario en MongoDB Atlas:');
    console.log('');
    console.log('1. Ve a MongoDB Atlas → Database Access');
    console.log('2. Haz clic en "ADD DATABASE USER"');
    console.log('3. Username: render_user');
    console.log('4. Password: Render2024!');
    console.log('5. Built-in Role: Read and write to any database');
    console.log('6. Haz clic en "Add User"');
    console.log('');
    console.log('✅ URI para usar en Render después de crear el usuario:');
    console.log('mongodb+srv://render_user:Render2024!@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0');
    console.log('');
    console.log('📋 Variables completas para Render:');
    console.log('MONGODB_URI: mongodb+srv://render_user:Render2024!@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0');
    console.log('NODE_ENV: production');
    console.log('JWT_SECRET: tu_jwt_secret_super_seguro_2024_produccion');
    console.log('API_KEY_AUTH_ENABLED: true');
    console.log('API_KEY_HEADER_NAME: X-API-Key');
    console.log('API_KEY_QUERY_PARAM: apiKey');
    console.log('API_KEY_REQUIRED: true');
    console.log('JWT_EXPIRES_IN: 24h');
    console.log('USECURS_ENABLED: true');
    console.log('USECURS_URL: https://api.usecurs.com');
    console.log('USECURS_API_KEY: tu_usecurs_api_key');
};

testNewUser(); 