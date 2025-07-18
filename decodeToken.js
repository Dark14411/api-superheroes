import jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdhODI4MTQ2YjI4YjRhMmI3MjMxZjYiLCJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTc1Mjg3NzU2NiwiZXhwIjoxNzUyOTYzOTY2fQ.xOoClsMXtaGo4VS6VlC9rYpVDYqFyfSm--VekLqTTSY';

try {
    const decoded = jwt.decode(token);
    console.log('🔍 Token decodificado:');
    console.log('User ID:', decoded.userId);
    console.log('Username:', decoded.username);
    console.log('Expira:', new Date(decoded.exp * 1000).toLocaleString());
    console.log('Token completo:', JSON.stringify(decoded, null, 2));
} catch (error) {
    console.error('Error decodificando token:', error.message);
} 