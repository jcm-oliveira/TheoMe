CREATE TABLE IF NOT EXISTS study_item_hierarchy (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_study_item INT UNSIGNED NOT NULL,
    id_superior_study_item INT UNSIGNED NULL,
    id_inferior_study_item INT UNSIGNED NULL,
    id_previous_study_item INT UNSIGNED NULL,
    id_next_study_item INT UNSIGNED NULL,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_study_item_hierarchy_study_item (id_study_item),
    CONSTRAINT fk_study_item_hierarchy_study_item
        FOREIGN KEY (id_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_study_item_hierarchy_superior
        FOREIGN KEY (id_superior_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_study_item_hierarchy_inferior
        FOREIGN KEY (id_inferior_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_study_item_hierarchy_previous
        FOREIGN KEY (id_previous_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_study_item_hierarchy_next
        FOREIGN KEY (id_next_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
