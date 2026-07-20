CREATE TABLE IF NOT EXISTS section (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_historical_perspective INT UNSIGNED NOT NULL,
    id_category_level_3 INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_section_historical_perspective (id_historical_perspective),
    INDEX idx_section_level_3 (id_category_level_3),
    INDEX idx_section_status (status),
    INDEX idx_section_excluded (excluded),
    INDEX idx_section_name (name),
    CONSTRAINT fk_section_historical_perspective
        FOREIGN KEY (id_historical_perspective)
        REFERENCES historical_perspective(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_section_level_3
        FOREIGN KEY (id_category_level_3)
        REFERENCES category_level_3(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
