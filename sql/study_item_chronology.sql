CREATE TABLE IF NOT EXISTS study_item_chronology (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_study_item INT UNSIGNED NOT NULL,
    id_timeline INT UNSIGNED NOT NULL,
    register_type VARCHAR(30) NOT NULL,
    bar_color VARCHAR(30) NULL,
    date_format VARCHAR(30) NOT NULL,
    start_day INT NULL,
    start_month VARCHAR(20) NULL,
    start_year INT NULL,
    start_reference VARCHAR(10) NULL,
    end_day INT NULL,
    end_month VARCHAR(20) NULL,
    end_year INT NULL,
    end_reference VARCHAR(10) NULL,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_study_item_chronology_study_item (id_study_item),
    INDEX idx_study_item_chronology_timeline (id_timeline),
    CONSTRAINT fk_study_item_chronology_study_item
        FOREIGN KEY (id_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_study_item_chronology_timeline
        FOREIGN KEY (id_timeline) REFERENCES timeline(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
