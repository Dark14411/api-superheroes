-- Crear tablas para el sistema de héroes y mascotas

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 100,
    gems INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de héroes
CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    class VARCHAR(50) NOT NULL, -- warrior, mage, archer, etc.
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    health INTEGER DEFAULT 100,
    energy INTEGER DEFAULT 100,
    happiness INTEGER DEFAULT 100,
    strength INTEGER DEFAULT 10,
    magic INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    appearance JSONB DEFAULT '{}', -- colors, costume, accessories
    last_fed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_trained TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de especies de mascotas fantásticas
CREATE TABLE IF NOT EXISTS pet_species (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- dragon, phoenix, unicorn, etc.
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    base_stats JSONB DEFAULT '{}',
    appearance JSONB DEFAULT '{}',
    abilities JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mascotas
CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER REFERENCES heroes(id) ON DELETE CASCADE,
    species_id INTEGER REFERENCES pet_species(id),
    name VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    health INTEGER DEFAULT 100,
    energy INTEGER DEFAULT 100,
    happiness INTEGER DEFAULT 100,
    hunger INTEGER DEFAULT 100,
    bond_level INTEGER DEFAULT 1, -- vínculo con el héroe
    stats JSONB DEFAULT '{}',
    appearance JSONB DEFAULT '{}',
    last_fed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- food, toy, equipment, potion
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) DEFAULT 'common',
    effects JSONB DEFAULT '{}',
    price_coins INTEGER DEFAULT 0,
    price_gems INTEGER DEFAULT 0,
    description TEXT,
    icon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de inventario de usuarios
CREATE TABLE IF NOT EXISTS user_inventory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Tabla de adopciones (historial)
CREATE TABLE IF NOT EXISTS adoptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    hero_id INTEGER REFERENCES heroes(id),
    pet_id INTEGER REFERENCES pets(id),
    adoption_type VARCHAR(50) DEFAULT 'found', -- found, purchased, gifted, bred
    cost_coins INTEGER DEFAULT 0,
    cost_gems INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un usuario predeterminado si no existe (para operaciones sin login)
INSERT INTO users (id, email, username, password_hash)
VALUES (1, 'default@example.com', 'Jugador1', 'no_password_needed')
ON CONFLICT (id) DO NOTHING;

-- Insertar especies de mascotas fantásticas iniciales
INSERT INTO pet_species (name, type, rarity, base_stats, appearance, abilities) VALUES
('Dragón de Fuego', 'dragon', 'epic', '{"attack": 15, "defense": 12, "speed": 8}', '{"color": "#FF4500", "size": "large", "wings": true}', '["fire_breath", "flight"]'),
('Fénix Dorado', 'phoenix', 'legendary', '{"attack": 12, "defense": 10, "speed": 18}', '{"color": "#FFD700", "size": "medium", "wings": true}', '["rebirth", "healing_aura", "flight"]'),
('Unicornio Místico', 'unicorn', 'rare', '{"attack": 8, "defense": 15, "speed": 12}', '{"color": "#E6E6FA", "size": "large", "horn": true}', '["healing", "purify", "teleport"]'),
('Lobo Sombra', 'wolf', 'rare', '{"attack": 14, "defense": 8, "speed": 16}', '{"color": "#2F2F2F", "size": "medium", "eyes": "glowing"}', '["stealth", "pack_hunt", "night_vision"]'),
('Hada Luminosa', 'fairy', 'common', '{"attack": 6, "defense": 6, "speed": 20}', '{"color": "#98FB98", "size": "small", "wings": true}', '["light_magic", "flight", "nature_bond"]'),
('Grifo Real', 'griffin', 'epic', '{"attack": 16, "defense": 14, "speed": 14}', '{"color": "#8B4513", "size": "large", "wings": true}', '["flight", "keen_sight", "dive_attack"]');

-- Insertar items iniciales
INSERT INTO items (name, type, category, rarity, effects, price_coins, price_gems, description, icon_url) VALUES
('Manzana Mágica', 'food', 'pet_food', 'common', '{"health": 20, "happiness": 10}', 10, 0, 'Una manzana que restaura salud y alegría', '/icons/magic-apple.png'),
('Poción de Energía', 'potion', 'consumable', 'common', '{"energy": 50}', 25, 0, 'Restaura la energía de tu mascota', '/icons/energy-potion.png'),
('Cristal de Experiencia', 'consumable', 'enhancement', 'rare', '{"experience": 100}', 0, 5, 'Otorga experiencia instantánea', '/icons/exp-crystal.png'),
('Pelota Encantada', 'toy', 'entertainment', 'common', '{"happiness": 30, "bond": 5}', 15, 0, 'Un juguete que fortalece el vínculo', '/icons/magic-ball.png'),
('Armadura Élfica', 'equipment', 'armor', 'epic', '{"defense": 25, "magic_resistance": 15}', 0, 50, 'Armadura ligera con protección mágica', '/icons/elven-armor.png'),
('Espada Flamígera', 'equipment', 'weapon', 'epic', '{"attack": 30, "fire_damage": 10}', 0, 45, 'Espada imbuida con poder de fuego', '/icons/flame-sword.png'); 