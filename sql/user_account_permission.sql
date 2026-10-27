-- Vínculo entre usuários e permissões de acesso.
-- Executar depois de user_account.sql e permission.sql.
CREATE TABLE IF NOT EXISTS user_account_permission (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_user_account INT UNSIGNED NOT NULL,
    id_permission INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX uq_user_account_permission (id_user_account, id_permission),
    INDEX idx_user_account_permission_permission (id_permission),
    CONSTRAINT fk_user_account_permission_user
        FOREIGN KEY (id_user_account)
        REFERENCES user_account(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_user_account_permission_permission
        FOREIGN KEY (id_permission)
        REFERENCES permission(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
