CREATE TABLE IF NOT EXISTS attribute (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_attribute_type INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_attribute_attribute_type (id_attribute_type),
    INDEX idx_attribute_name (name),
    INDEX idx_attribute_status (status),
    INDEX idx_attribute_excluded (excluded),
    CONSTRAINT fk_attribute_attribute_type
        FOREIGN KEY (id_attribute_type)
        REFERENCES attribute_type(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
