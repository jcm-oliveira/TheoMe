CREATE TABLE IF NOT EXISTS study_item_association (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_study_item INT UNSIGNED NOT NULL,
    id_historical_perspective INT UNSIGNED NOT NULL,
    id_category_level_1 INT UNSIGNED NOT NULL,
    id_category_level_2 INT UNSIGNED NOT NULL,
    id_category_level_3 INT UNSIGNED NOT NULL,
    id_section INT UNSIGNED NOT NULL,
    id_associated_study_item INT UNSIGNED NOT NULL,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_study_item_association_study_item (id_study_item),
    INDEX idx_study_item_association_associated (id_associated_study_item),
    CONSTRAINT fk_study_item_association_study_item
        FOREIGN KEY (id_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_study_item_association_historical_perspective
        FOREIGN KEY (id_historical_perspective) REFERENCES historical_perspective(id),
    CONSTRAINT fk_study_item_association_category_level_1
        FOREIGN KEY (id_category_level_1) REFERENCES category_level_1(id),
    CONSTRAINT fk_study_item_association_category_level_2
        FOREIGN KEY (id_category_level_2) REFERENCES category_level_2(id),
    CONSTRAINT fk_study_item_association_category_level_3
        FOREIGN KEY (id_category_level_3) REFERENCES category_level_3(id),
    CONSTRAINT fk_study_item_association_section
        FOREIGN KEY (id_section) REFERENCES section(id),
    CONSTRAINT fk_study_item_association_associated_study_item
        FOREIGN KEY (id_associated_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
