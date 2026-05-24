PRAGMA foreign_keys = ON;

-- USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- REGRAS (Reference)
CREATE TABLE IF NOT EXISTS vantagens (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cost TEXT,
    description TEXT,
    requirements TEXT
);

CREATE TABLE IF NOT EXISTS desvantagens (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cost TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS pericias (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS tecnicas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cost TEXT,
    description TEXT,
    duration TEXT,
    requirements TEXT
);

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaign_chapters (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ENTITIES (personagens, npcs, monstros)
CREATE TABLE IF NOT EXISTS personagens (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    archetype TEXT,
    concept TEXT,
    pontos INTEGER,
    Habilidade INTEGER DEFAULT 0,
    Poder INTEGER DEFAULT 0,
    Resistencia INTEGER DEFAULT 0,
    Pontos_Vida INTEGER DEFAULT 1,
    Pontos_Acao INTEGER DEFAULT 1,
    Pontos_Mana INTEGER DEFAULT 1,
    image TEXT,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS npcs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    archetype TEXT,
    concept TEXT,
    pontos INTEGER,
    Habilidade INTEGER DEFAULT 0,
    Poder INTEGER DEFAULT 0,
    Resistencia INTEGER DEFAULT 0,
    Pontos_Vida INTEGER DEFAULT 1,
    Pontos_Acao INTEGER DEFAULT 1,
    Pontos_Mana INTEGER DEFAULT 1,
    image TEXT,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monstros (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    archetype TEXT,
    concept TEXT,
    pontos INTEGER,
    Habilidade INTEGER DEFAULT 0,
    Poder INTEGER DEFAULT 0,
    Resistencia INTEGER DEFAULT 0,
    Pontos_Vida INTEGER DEFAULT 1,
    Pontos_Acao INTEGER DEFAULT 1,
    Pontos_Mana INTEGER DEFAULT 1,
    image TEXT,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PERSONAGENS JUNCTIONS
CREATE TABLE IF NOT EXISTS personagens_vantagens (
    personagem_id TEXT NOT NULL REFERENCES personagens(id) ON DELETE CASCADE,
    vantagem_id TEXT NOT NULL REFERENCES vantagens(id) ON DELETE CASCADE,
    PRIMARY KEY (personagem_id, vantagem_id)
);

CREATE TABLE IF NOT EXISTS personagens_desvantagens (
    personagem_id TEXT NOT NULL REFERENCES personagens(id) ON DELETE CASCADE,
    desvantagem_id TEXT NOT NULL REFERENCES desvantagens(id) ON DELETE CASCADE,
    PRIMARY KEY (personagem_id, desvantagem_id)
);

CREATE TABLE IF NOT EXISTS personagens_pericias (
    personagem_id TEXT NOT NULL REFERENCES personagens(id) ON DELETE CASCADE,
    pericia_id TEXT NOT NULL REFERENCES pericias(id) ON DELETE CASCADE,
    PRIMARY KEY (personagem_id, pericia_id)
);

CREATE TABLE IF NOT EXISTS personagens_tecnicas (
    personagem_id TEXT NOT NULL REFERENCES personagens(id) ON DELETE CASCADE,
    tecnica_id TEXT NOT NULL REFERENCES tecnicas(id) ON DELETE CASCADE,
    PRIMARY KEY (personagem_id, tecnica_id)
);

-- NPCS JUNCTIONS
CREATE TABLE IF NOT EXISTS npcs_vantagens (
    npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    vantagem_id TEXT NOT NULL REFERENCES vantagens(id) ON DELETE CASCADE,
    PRIMARY KEY (npc_id, vantagem_id)
);

CREATE TABLE IF NOT EXISTS npcs_desvantagens (
    npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    desvantagem_id TEXT NOT NULL REFERENCES desvantagens(id) ON DELETE CASCADE,
    PRIMARY KEY (npc_id, desvantagem_id)
);

CREATE TABLE IF NOT EXISTS npcs_pericias (
    npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    pericia_id TEXT NOT NULL REFERENCES pericias(id) ON DELETE CASCADE,
    PRIMARY KEY (npc_id, pericia_id)
);

CREATE TABLE IF NOT EXISTS npcs_tecnicas (
    npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    tecnica_id TEXT NOT NULL REFERENCES tecnicas(id) ON DELETE CASCADE,
    PRIMARY KEY (npc_id, tecnica_id)
);

-- MONSTROS JUNCTIONS
CREATE TABLE IF NOT EXISTS monstros_vantagens (
    monstro_id TEXT NOT NULL REFERENCES monstros(id) ON DELETE CASCADE,
    vantagem_id TEXT NOT NULL REFERENCES vantagens(id) ON DELETE CASCADE,
    PRIMARY KEY (monstro_id, vantagem_id)
);

CREATE TABLE IF NOT EXISTS monstros_desvantagens (
    monstro_id TEXT NOT NULL REFERENCES monstros(id) ON DELETE CASCADE,
    desvantagem_id TEXT NOT NULL REFERENCES desvantagens(id) ON DELETE CASCADE,
    PRIMARY KEY (monstro_id, desvantagem_id)
);

CREATE TABLE IF NOT EXISTS monstros_pericias (
    monstro_id TEXT NOT NULL REFERENCES monstros(id) ON DELETE CASCADE,
    pericia_id TEXT NOT NULL REFERENCES pericias(id) ON DELETE CASCADE,
    PRIMARY KEY (monstro_id, pericia_id)
);

CREATE TABLE IF NOT EXISTS monstros_tecnicas (
    monstro_id TEXT NOT NULL REFERENCES monstros(id) ON DELETE CASCADE,
    tecnica_id TEXT NOT NULL REFERENCES tecnicas(id) ON DELETE CASCADE,
    PRIMARY KEY (monstro_id, tecnica_id)
);

-- SESSIONS & SUB-TABLES
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    comeco_forte TEXT,
    gancho_proxima_aventura TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS session_objetivos (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS session_ganchos_personagens (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    personagem_id TEXT REFERENCES personagens(id) ON DELETE SET NULL,
    personagem_name TEXT, -- Keeping as fallback if needed for existing data
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session_locais_interessantes (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS session_locais_caracteristicas (
    id TEXT PRIMARY KEY,
    local_id TEXT NOT NULL REFERENCES session_locais_interessantes(id) ON DELETE CASCADE,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session_npcs_importantes (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    npc_id TEXT REFERENCES npcs(id) ON DELETE SET NULL,
    name TEXT,
    role TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS session_encontros_desafios (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    mecanica TEXT
);

CREATE TABLE IF NOT EXISTS session_segredos_rumores (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    revealed BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS session_tesouros_recompensas (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    claimed BOOLEAN DEFAULT 0
);
