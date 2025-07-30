const { spawn } = require('child_process');
const path = require('path');

// Configuración para Render
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando Gaming Hub Ultimate...');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);

// Ejecutar Next.js
const nextProcess = spawn('npx', ['next', 'start', '-p', PORT], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: PORT
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