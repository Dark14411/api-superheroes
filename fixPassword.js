// Script para codificar la contraseña y generar la URI correcta
const password = 'Coopersac';
const encodedPassword = encodeURIComponent(password);

console.log('🔧 Generando URI correcta para Render...');
console.log('');

console.log('Contraseña original:', password);
console.log('Contraseña codificada:', encodedPassword);
console.log('');

// URI con contraseña codificada
const correctURI = `mongodb+srv://carlitoseuan2002:${encodedPassword}@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0`;

console.log('✅ URI CORRECTA para Render:');
console.log(correctURI);
console.log('');

console.log('📋 Copia y pega esta URI en Render en el campo MONGODB_URI');
console.log('');

// También mostrar sin la base de datos
const correctURINoDB = `mongodb+srv://carlitoseuan2002:${encodedPassword}@cluster0.mlzaawc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log('✅ URI alternativa (sin base de datos):');
console.log(correctURINoDB); 