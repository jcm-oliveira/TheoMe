require("dotenv").config({ quiet: true });

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// tempo sem uso até a sessão expirar (renovado a cada requisição)
const SESSION_IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000;

function createSessionMiddleware() {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("Defina SESSION_SECRET no arquivo .env com pelo menos 32 caracteres (ver .env.example).");
    }

    // sessões gravadas no MySQL (tabela criada por sql/sessions.sql)
    const store = new MySQLStore({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        createDatabaseTable: false,
        clearExpired: true,
        expiration: SESSION_IDLE_TIMEOUT_MS,
    });

    return session({
        name: "theome.sid",
        secret,
        store,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            httpOnly: true,
            sameSite: "strict",
            // em produção o cookie só trafega por HTTPS
            secure: process.env.NODE_ENV === "production",
            maxAge: SESSION_IDLE_TIMEOUT_MS,
        },
    });
}

module.exports = { createSessionMiddleware };
