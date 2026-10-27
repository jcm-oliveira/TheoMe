-- Permissões de acesso da área logada (CMS).
-- A parte pública do site não exige permissão.
CREATE TABLE IF NOT EXISTS permission (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    -- garante código único apenas entre registros não excluídos
    code_active VARCHAR(100) GENERATED ALWAYS AS (IF(excluded = 0, code, NULL)) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX uq_permission_code_active (code_active),
    INDEX idx_permission_name (name),
    INDEX idx_permission_status (status),
    INDEX idx_permission_excluded (excluded)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carga inicial (proposta): uma permissão por grupo do menu do CMS.
-- Ajuste conforme a necessidade antes de executar.
INSERT INTO permission (code, name, description)
SELECT * FROM (
    SELECT 'cms.bible' AS code, 'Bíblia' AS name, 'Traduções, livros e capítulos.' AS description
    UNION ALL SELECT 'cms.content', 'Conteúdo', 'Itens de estudo.'
    UNION ALL SELECT 'cms.register', 'Cadastros', 'Perspectivas, categorias, seções, linhas temporais, atributos, referências e localidades.'
    UNION ALL SELECT 'cms.site', 'Site', 'Banner slider, vídeo institucional e idiomas.'
    UNION ALL SELECT 'cms.users', 'Usuários', 'Cadastro de usuários da área logada.'
    UNION ALL SELECT 'cms.permissions', 'Permissões de acesso', 'Cadastro de permissões de acesso.'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM permission);
