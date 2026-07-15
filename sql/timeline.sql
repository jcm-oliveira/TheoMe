CREATE TABLE IF NOT EXISTS timeline (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_historical_perspective INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    visualization VARCHAR(50) NULL,
    background_color VARCHAR(30) NULL,
    icon VARCHAR(255) NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    excluded TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_timeline_historical_perspective
        FOREIGN KEY (id_historical_perspective) REFERENCES historical_perspective (id),
    INDEX idx_timeline_historical_perspective (id_historical_perspective),
    INDEX idx_timeline_status (status),
    INDEX idx_timeline_excluded (excluded),
    INDEX idx_timeline_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
