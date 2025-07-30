const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuración para Render
const PORT = process.env.PORT || 3000;

console.log('🎮 Gaming Hub Ultimate - Iniciando...');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
console.log(`📁 Directorio: ${__dirname}`);

// Verificar si existe el build de producción
const nextBuildPath = path.join(__dirname, '.next');
const buildExists = fs.existsSync(nextBuildPath);

if (!buildExists) {
  console.log('🔨 Build de producción no encontrado, construyendo...');
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
    console.log('✅ Build completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el build:', error);
    process.exit(1);
  }
} else {
  console.log('✅ Build de producción encontrado');
}

// Verificar que Next.js esté instalado
try {
  require.resolve('next');
  console.log('✅ Next.js encontrado');
} catch (error) {
  console.error('❌ Next.js no encontrado, instalando...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
}

// Ejecutar Next.js
console.log('🚀 Iniciando servidor Next.js...');
const nextProcess = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: {
    ...process.env,
    PORT: PORT.toString(),
    NODE_ENV: process.env.NODE_ENV || 'production'
  }
});

nextProcess.on('error', (error) => {
  console.error('❌ Error al iniciar Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`📤 Proceso terminado con código: ${code}`);
  process.exit(code);
});

// Manejar señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando...');
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando...');
  nextProcess.kill('SIGINT');
});

console.log('🎯 Servidor iniciado correctamente'); 