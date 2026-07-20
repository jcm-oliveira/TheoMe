CREATE TABLE IF NOT EXISTS study_item (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status TINYINT(1) NOT NULL DEFAULT 1,
    language VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    id_historical_perspective INT UNSIGNED NOT NULL,
    id_category_level_1 INT UNSIGNED NOT NULL,
    id_category_level_2 INT UNSIGNED NOT NULL,
    id_category_level_3 INT UNSIGNED NOT NULL,
    id_section INT UNSIGNED NOT NULL,
    id_continent INT NULL,
    id_country INT NULL,
    id_region INT NULL,
    id_state INT NULL,
    id_city INT NULL,
    district VARCHAR(255) NULL,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_study_item_historical_perspective
        FOREIGN KEY (id_historical_perspective) REFERENCES historical_perspective(id),
    CONSTRAINT fk_study_item_category_level_1
        FOREIGN KEY (id_category_level_1) REFERENCES category_level_1(id),
    CONSTRAINT fk_study_item_category_level_2
        FOREIGN KEY (id_category_level_2) REFERENCES category_level_2(id),
    CONSTRAINT fk_study_item_category_level_3
        FOREIGN KEY (id_category_level_3) REFERENCES category_level_3(id),
    CONSTRAINT fk_study_item_section
        FOREIGN KEY (id_section) REFERENCES section(id),
    CONSTRAINT fk_study_item_continent
        FOREIGN KEY (id_continent) REFERENCES continent(id),
    CONSTRAINT fk_study_item_country
        FOREIGN KEY (id_country) REFERENCES country(id),
    CONSTRAINT fk_study_item_region
        FOREIGN KEY (id_region) REFERENCES region(id),
    CONSTRAINT fk_study_item_state
        FOREIGN KEY (id_state) REFERENCES state(id),
    CONSTRAINT fk_study_item_city
        FOREIGN KEY (id_city) REFERENCES city(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
