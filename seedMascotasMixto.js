import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Mascota from './models/mascotaSchema.js';
import User from './models/User.js';

dotenv.config();

const N = 15; // cantidad de usuarios y mitad de mascotas

const usuarios = Array.from({ length: N }, (_, i) => ({
  username: `user${i + 1}`,
  password: bcrypt.hashSync(`password${i + 1}`, 10),
  isActive: true,
  role: 'user'
}));

const mascotasAdoptadas = Array.from({ length: N }, (_, i) => ({
  nombre: `MascotaAdoptada${i + 1}`,
  tipo: 'dragon',
  elemento: 'fuego',
  poder: `Poder especial ${i + 1}`,
  energia: 100,
  felicidad: 90,
  hambre: 10,
  sed: 10,
  cansancio: 5,
  estres: 5,
  adoptada: true // importante
  // propietarioId se asigna después de crear usuarios
}));

const mascotasDisponibles = Array.from({ length: N }, (_, i) => ({
  nombre: `MascotaDisponible${i + 1}`,
  tipo: 'unicornio',
  elemento: 'luz',
  poder: `Poder disponible ${i + 1}`,
  energia: 100,
  felicidad: 95,
  hambre: 5,
  sed: 5,
  cansancio: 2,
  estres: 2,
  adoptada: false // importante
  // sin propietarioId
}));

async function poblar() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones
    await Mascota.deleteMany({});
    await User.deleteMany({ username: /user[0-9]+/ });
    console.log('🧹 Colecciones limpiadas');

    // Crear usuarios
    const usuariosCreados = await User.insertMany(usuarios);
    console.log(`👤 ${usuariosCreados.length} usuarios creados`);

    // Asignar propietarioId a mascotas adoptadas
    mascotasAdoptadas.forEach((m, i) => {
      m.propietarioId = usuariosCreados[i]._id;
    });

    // Crear mascotas
    const mascotasCreadas = await Mascota.insertMany([
      ...mascotasAdoptadas,
      ...mascotasDisponibles
    ]);
    console.log(`🐾 ${mascotasCreadas.length} mascotas creadas (mitad adoptadas, mitad disponibles)`);

    // Resumen
    console.log('\nResumen:');
    console.log('Usuarios:');
    usuariosCreados.forEach((u, i) => {
      console.log(`  ${u.username} (id: ${u._id})`);
    });
    console.log('\nMascotas adoptadas:');
    mascotasCreadas.filter(m => m.adoptada).forEach((m, i) => {
      console.log(`  ${m.nombre} - Adoptada por: ${m.propietarioId}`);
    });
    console.log('\nMascotas disponibles:');
    mascotasCreadas.filter(m => !m.adoptada).forEach((m, i) => {
      console.log(`  ${m.nombre} - Disponible`);
    });

    console.log('\n🎉 ¡Base de datos poblada con éxito!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

poblar(); 