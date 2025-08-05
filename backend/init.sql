-- Script de inicialização do banco de dados PostgreSQL
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabelas se não existirem
CREATE TABLE IF NOT EXISTS crypto_assets (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(20, 8),
    market_cap DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    price_change_24h DECIMAL(10, 2),
    price_change_percentage_24h DECIMAL(10, 2),
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    source VARCHAR(100),
    published_at TIMESTAMP,
    sentiment VARCHAR(20),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS economic_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    currency VARCHAR(10),
    impact VARCHAR(20),
    actual_value DECIMAL(15, 4),
    forecast_value DECIMAL(15, 4),
    previous_value DECIMAL(15, 4),
    event_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whale_transactions (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(255) UNIQUE,
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    amount DECIMAL(30, 18),
    symbol VARCHAR(20),
    usd_value DECIMAL(20, 2),
    transaction_type VARCHAR(50),
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS airdrops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(20),
    description TEXT,
    website_url TEXT,
    twitter_url TEXT,
    discord_url TEXT,
    telegram_url TEXT,
    eligibility_criteria TEXT,
    estimated_value DECIMAL(20, 2),
    end_date TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fed_updates (
    id SERIAL PRIMARY KEY,
    indicator_name VARCHAR(100) NOT NULL,
    value DECIMAL(15, 4),
    date DATE,
    frequency VARCHAR(50),
    units VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS market_summary (
    id SERIAL PRIMARY KEY,
    total_market_cap DECIMAL(20, 2),
    total_volume_24h DECIMAL(20, 2),
    btc_dominance DECIMAL(5, 2),
    eth_dominance DECIMAL(5, 2),
    market_sentiment VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    severity VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_crypto_assets_symbol ON crypto_assets(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_assets_updated_at ON crypto_assets(updated_at);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_economic_events_date ON economic_events(event_date);
CREATE INDEX IF NOT EXISTS idx_whale_transactions_timestamp ON whale_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_airdrops_status ON airdrops(status);
CREATE INDEX IF NOT EXISTS idx_fed_updates_date ON fed_updates(date);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);

-- Inserir dados iniciais de exemplo
INSERT INTO alerts (type, title, message, severity) VALUES
('system', 'Bem-vindo ao Crypto Dashboard', 'Sistema inicializado com sucesso!', 'info'),
('market', 'Monitoramento de Mercado Ativo', 'Sistema de alertas de mercado funcionando normalmente.', 'info')
ON CONFLICT DO NOTHING;

-- Comentário sobre o script
COMMENT ON TABLE crypto_assets IS 'Tabela para armazenar dados de criptomoedas';
COMMENT ON TABLE news IS 'Tabela para armazenar notícias do mercado';
COMMENT ON TABLE economic_events IS 'Tabela para armazenar eventos econômicos';
COMMENT ON TABLE whale_transactions IS 'Tabela para armazenar transações de baleias';
COMMENT ON TABLE airdrops IS 'Tabela para armazenar informações de airdrops';
COMMENT ON TABLE fed_updates IS 'Tabela para armazenar dados do Federal Reserve';
COMMENT ON TABLE market_summary IS 'Tabela para armazenar resumo do mercado';
COMMENT ON TABLE alerts IS 'Tabela para armazenar alertas do sistema'; 