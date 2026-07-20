CREATE TABLE IF NOT EXISTS study_item_bible_markup (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_study_item INT UNSIGNED NOT NULL,
    id_book INT UNSIGNED NOT NULL,
    chapter INT NOT NULL,
    verse_start INT NOT NULL,
    verse_end INT NOT NULL,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_study_item_bible_markup_study_item (id_study_item),
    INDEX idx_study_item_bible_markup_book (id_book),
    CONSTRAINT fk_study_item_bible_markup_study_item
        FOREIGN KEY (id_study_item) REFERENCES study_item(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_study_item_bible_markup_book
        FOREIGN KEY (id_book) REFERENCES book(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE book
ADD COLUMN canonical_order INT UNSIGNED NULL AFTER abbreviation;