const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando Gaming Hub Ultimate...');
console.log(`📊 Puerto: ${PORT}`);
console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`💾 Memoria disponible: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);

// Verificar si existe el build de producción
const nextBuildPath = path.join(__dirname, '.next');
const buildExists = fs.existsSync(nextBuildPath);

if (!buildExists) {
  console.log('🔨 Build de producción no encontrado, construyendo...');
  console.log('⚡ Usando optimizaciones de memoria para Render...');
  
  try {
    // Usar variables de entorno optimizadas para memoria
    const buildEnv = {
      ...process.env,
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=384',
      NEXT_TELEMETRY_DISABLED: '1',
      GENERATE_SOURCEMAP: 'false',
      NEXT_DISABLE_SOURCEMAPS: 'true',
      NEXT_DISABLE_ESLINT: 'true',
      NEXT_DISABLE_TYPE_CHECK: 'true'
    };

    console.log('🔧 Variables de entorno optimizadas aplicadas');
    
    execSync('npm run build:render', {
      stdio: 'inherit',
      cwd: __dirname,
      env: buildEnv
    });
    
    console.log('✅ Build completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el build:', error);
    console.error('💡 Intentando build alternativo...');
    
    try {
      // Fallback: build más simple
      execSync('npm run build', {
        stdio: 'inherit',
        cwd: __dirname,
        env: { ...process.env, NODE_ENV: 'production' }
      });
      console.log('✅ Build alternativo completado');
    } catch (fallbackError) {
      console.error('❌ Error en build alternativo:', fallbackError);
      process.exit(1);
    }
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
  try {
    execSync('npm install next', {
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log('✅ Next.js instalado');
  } catch (installError) {
    console.error('❌ Error instalando Next.js:', installError);
    process.exit(1);
  }
}

console.log('🎯 Iniciando servidor Next.js...');

// Iniciar Next.js con optimizaciones de memoria
const nextProcess = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: {
    ...process.env,
    PORT: PORT.toString(),
    NODE_ENV: process.env.NODE_ENV || 'production',
    NODE_OPTIONS: '--max-old-space-size=384'
  }
});

// Manejar eventos del proceso
nextProcess.on('error', (error) => {
  console.error('❌ Error iniciando Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`📊 Proceso Next.js terminado con código: ${code}`);
  process.exit(code);
});

// Manejar señales del sistema
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida, cerrando...');
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Señal SIGINT recibida, cerrando...');
  nextProcess.kill('SIGINT');
});

console.log('🎯 Servidor iniciado correctamente');
console.log(`🌐 Accede a: http://localhost:${PORT}`); 