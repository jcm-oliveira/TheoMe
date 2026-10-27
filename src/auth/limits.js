const { rateLimit } = require("express-rate-limit");

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

// limita tentativas de login erradas por IP (só as que falham contam)
const loginLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES_MS,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler(req, res) {
        return res.status(429).render("../views/cms/cms-LoginPage", {
            messages: {
                display: "",
                alertType: "alert-danger",
                textMessage: "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.",
            },
            email: "",
            next: "",
        });
    },
});

// limita tentativas de troca de senha por usuário logado
const changePasswordLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES_MS,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) => "user-" + req.currentUser.id,
    handler(req, res) {
        return res.status(429).render("../views/cms/cms-MainPage", {
            messages: {
                display: "",
                alertType: "alert-danger",
                textMessage: "Muitas tentativas de troca de senha. Aguarde 15 minutos e tente novamente.",
            },
        });
    },
});

module.exports = { loginLimiter, changePasswordLimiter };
