CREATE TABLE IF NOT EXISTS study_item_attribute (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_study_item INT UNSIGNED NOT NULL,
    id_attribute_type INT UNSIGNED NOT NULL,
    id_attribute INT UNSIGNED NOT NULL,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    layout_figure VARCHAR(120) NULL,
    video_url VARCHAR(255) NULL,
    layout_video VARCHAR(120) NULL,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_study_item_attribute_study_item (id_study_item),
    INDEX idx_study_item_attribute_type (id_attribute_type),
    INDEX idx_study_item_attribute_attribute (id_attribute),
    CONSTRAINT fk_study_item_attribute_study_item
        FOREIGN KEY (id_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_study_item_attribute_type
        FOREIGN KEY (id_attribute_type) REFERENCES attribute_type(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_study_item_attribute_attribute
        FOREIGN KEY (id_attribute) REFERENCES attribute(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
