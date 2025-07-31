const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuración para Render
const PORT = process.env.PORT || 3000;

console.log('🎮 Gaming Hub Ultimate - Iniciando...');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
console.log(`📁 Directorio: ${__dirname}`);

// Configurar límites de memoria para Node.js
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '--max-old-space-size=384';

// Verificar si existe el build de producción
const nextBuildPath = path.join(__dirname, '.next');
const buildExists = fs.existsSync(nextBuildPath);

if (!buildExists) {
  console.log('🔨 Build de producción no encontrado, construyendo...');
  try {
    // Usar menos memoria durante el build
    const buildEnv = {
      ...process.env,
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=384',
      NEXT_TELEMETRY_DISABLED: '1'
    };
    
    execSync('npm run build:render', { 
      stdio: 'inherit',
      cwd: __dirname,
      env: buildEnv
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

// Verificar si existe el servidor standalone
const standaloneServerPath = path.join(__dirname, '.next/standalone/server.js');
const standaloneExists = fs.existsSync(standaloneServerPath);

if (standaloneExists) {
  console.log('🚀 Iniciando servidor standalone...');
  const serverProcess = spawn('node', [standaloneServerPath], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: PORT.toString(),
      NODE_ENV: process.env.NODE_ENV || 'production',
      NODE_OPTIONS: '--max-old-space-size=384',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Error al iniciar servidor standalone:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code) => {
    console.log(`📤 Proceso terminado con código: ${code}`);
    process.exit(code);
  });

  // Manejar señales de terminación
  process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM, cerrando...');
    serverProcess.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('🛑 Recibida señal SIGINT, cerrando...');
    serverProcess.kill('SIGINT');
  });
} else {
  console.log('🚀 Iniciando servidor Next.js estándar...');
  const nextProcess = spawn('npm', ['run', 'start:render'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: PORT.toString(),
      NODE_ENV: process.env.NODE_ENV || 'production',
      NODE_OPTIONS: '--max-old-space-size=384',
      NEXT_TELEMETRY_DISABLED: '1'
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
}

console.log('🎯 Servidor iniciado correctamente'); 