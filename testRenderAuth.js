import mongoose from 'mongoose';

// Test different URI formats for Render
const testURIs = [
    // Original URI
    'mongodb+srv://carlitoseuan2002:Cooper144467@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0',
    
    // URI with encoded password
    'mongodb+srv://carlitoseuan2002:Cooper144467@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0',
    
    // URI without database name
    'mongodb+srv://carlitoseuan2002:Cooper144467@cluster0.mlzaawc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
];

const testConnection = async (uri, testName) => {
    try {
        console.log(`\n🔍 Probando: ${testName}`);
        console.log(`   URI: ${uri.replace(/:[^:@]+@/, ':***@')}`);
        
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`✅ ${testName} - Conexión exitosa!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   DB: ${conn.connection.name}`);
        
        await mongoose.connection.close();
        return true;
        
    } catch (error) {
        console.log(`❌ ${testName} - Error: ${error.message}`);
        return false;
    }
};

const runTests = async () => {
    console.log('🧪 Probando diferentes formatos de URI para Render...');
    
    for (let i = 0; i < testURIs.length; i++) {
        const success = await testConnection(testURIs[i], `Test ${i + 1}`);
        if (success) {
            console.log(`\n🎉 ¡Test ${i + 1} funcionó! Usa esta URI en Render:`);
            console.log(testURIs[i]);
            break;
        }
    }
    
    process.exit(0);
};

runTests(); 