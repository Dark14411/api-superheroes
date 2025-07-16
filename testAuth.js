import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';

// Cargar variables de entorno
dotenv.config();

const testAuth = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conectado a la base de datos');

    // Limpiar usuarios de prueba anteriores
    await User.deleteMany({ username: { $regex: /^test_/ } });
    console.log('🧹 Usuarios de prueba anteriores eliminados');

    // Crear usuario de prueba
    const testUser = new User({
      username: 'test_user',
      email: 'test@example.com',
      password: 'Test123!'
    });

    await testUser.save();
    console.log('✅ Usuario de prueba creado:', testUser.username);

    // Verificar que la contraseña se hasheó correctamente
    const isPasswordValid = await testUser.comparePassword('Test123!');
    console.log('🔐 Contraseña válida:', isPasswordValid);

    // Buscar usuario por username
    const foundUser = await User.findOne({ username: 'test_user' });
    console.log('👤 Usuario encontrado:', foundUser.username);

    // Verificar que la contraseña no se muestra en el JSON
    const userJSON = foundUser.toJSON();
    console.log('📄 Usuario sin contraseña:', userJSON);

    console.log('\n🎉 Pruebas de autenticación completadas exitosamente!');
    console.log('\n📋 Endpoints disponibles:');
    console.log('POST /api/auth/register - Registrar usuario');
    console.log('POST /api/auth/login - Iniciar sesión');
    console.log('GET /api/auth/profile - Obtener perfil (requiere token)');
    console.log('POST /api/auth/logout - Cerrar sesión (requiere token)');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
};

testAuth(); 