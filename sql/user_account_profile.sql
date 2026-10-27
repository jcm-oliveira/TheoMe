-- Dados pessoais do usuário (antiga tela "Preferências", agora "Meus dados").
-- Rodar apenas em bancos onde user_account já existe.
-- Em instalações novas, sql/user_account.sql já cria estas colunas.
ALTER TABLE user_account
    ADD COLUMN contact VARCHAR(100) NULL AFTER email,
    ADD COLUMN birth_year SMALLINT UNSIGNED NULL AFTER contact,
    ADD COLUMN id_city INT NULL AFTER birth_year,
    ADD COLUMN avatar VARCHAR(100) NULL AFTER id_city,
    ADD COLUMN newsletter_opt_in TINYINT(1) NOT NULL DEFAULT 0 AFTER avatar,
    ADD INDEX idx_user_account_city (id_city),
    ADD CONSTRAINT fk_user_account_city
        FOREIGN KEY (id_city)
        REFERENCES city(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL;
