CREATE TABLE IF NOT EXISTS category_level_3 (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_historical_perspective INT UNSIGNED NOT NULL,
    id_category_level_2 INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_category_level_3_historical_perspective (id_historical_perspective),
    INDEX idx_category_level_3_level_2 (id_category_level_2),
    INDEX idx_category_level_3_status (status),
    INDEX idx_category_level_3_excluded (excluded),
    INDEX idx_category_level_3_name (name),
    CONSTRAINT fk_category_level_3_historical_perspective
        FOREIGN KEY (id_historical_perspective)
        REFERENCES historical_perspective(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_category_level_3_level_2
        FOREIGN KEY (id_category_level_2)
        REFERENCES category_level_2(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
