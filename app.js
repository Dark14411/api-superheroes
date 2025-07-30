const { spawn } = require('child_process');
const path = require('path');

// Configuración para Render
const PORT = process.env.PORT || 3000;

console.log('🎮 Gaming Hub Ultimate - Iniciando...');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
console.log(`📁 Directorio: ${__dirname}`);

// Verificar que Next.js esté instalado
try {
  require.resolve('next');
  console.log('✅ Next.js encontrado');
} catch (error) {
  console.error('❌ Next.js no encontrado, instalando...');
  const { execSync } = require('child_process');
  execSync('npm install', { stdio: 'inherit' });
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