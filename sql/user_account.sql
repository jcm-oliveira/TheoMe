-- Usuários da área logada (CMS).
-- A senha nunca é gravada em texto: password_hash guarda o hash bcrypt.
CREATE TABLE IF NOT EXISTS user_account (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    -- dados pessoais opcionais (tela "Meus dados")
    contact VARCHAR(100) NULL,
    birth_year SMALLINT UNSIGNED NULL,
    id_city INT NULL,
    -- nome do arquivo da foto, guardado fora da pasta pública (storage/avatars)
    avatar VARCHAR(100) NULL,
    -- consentimento para receber novidades; desmarcado por padrão
    newsletter_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    password_hash VARCHAR(255) NOT NULL,
    -- incrementado a cada troca de senha; encerra as sessões abertas com a senha antiga
    session_version INT UNSIGNED NOT NULL DEFAULT 1,
    status TINYINT(1) NOT NULL DEFAULT 1,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    -- garante e-mail único apenas entre registros não excluídos
    email_active VARCHAR(254) GENERATED ALWAYS AS (IF(excluded = 0, email, NULL)) STORED,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX uq_user_account_email_active (email_active),
    INDEX idx_user_account_name (name),
    INDEX idx_user_account_status (status),
    INDEX idx_user_account_excluded (excluded),
    INDEX idx_user_account_city (id_city),
    CONSTRAINT fk_user_account_city
        FOREIGN KEY (id_city)
        REFERENCES city(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
