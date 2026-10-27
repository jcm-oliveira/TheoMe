-- Sessões de login da área logada (CMS), usadas pelo express-mysql-session.
-- Estrutura definida pela biblioteca (node_modules/express-mysql-session/schema.sql).
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB;
