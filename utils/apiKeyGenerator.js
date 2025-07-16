import crypto from 'crypto';

// Generar API Key única para usuario
export const generateUserApiKey = (userId, username) => {
  // Crear una API Key basada en el ID del usuario y timestamp
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const userHash = crypto.createHash('sha256')
    .update(`${userId}_${username}_${timestamp}_${randomBytes}`)
    .digest('hex')
    .substring(0, 32);
  
  // Formato: user_<hash>_<timestamp>
  return `user_${userHash}_${timestamp}`;
};

// Verificar si una API Key es de usuario o global
export const isUserApiKey = (apiKey) => {
  return apiKey && apiKey.startsWith('user_');
};

// Extraer información de la API Key de usuario
export const extractUserInfoFromApiKey = (apiKey) => {
  if (!isUserApiKey(apiKey)) return null;
  
  const parts = apiKey.split('_');
  if (parts.length >= 3) {
    return {
      type: 'user',
      hash: parts[1],
      timestamp: parts[2]
    };
  }
  return null;
}; 