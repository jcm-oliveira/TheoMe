const User = require("../model/UserModel");
const { avatarUrl } = require("../helpers/avatarUpload");

//---------------------------------------------------
//          PERMISSÃO EXIGIDA POR TELA DO CMS
//---------------------------------------------------
// A chave é o nome da tela na rota (/cms-<Tela>-...), em minúsculas.
// Uma tela nova do CMS fica bloqueada até ser incluída aqui (negação por padrão).

const CMS_SCREEN_PERMISSIONS = {
    // Bíblia
    bibletranslation: "cms.bible",
    book: "cms.bible",
    chapter: "cms.bible",

    // Pesquisa
    studyitem: "cms.content",
    studyitemold: "cms.content",

    // Cadastros
    historicalperspective: "cms.register",
    category: "cms.register",
    categorylevel2: "cms.register",
    categorylevel3: "cms.register",
    section: "cms.register",
    timeline: "cms.register",
    attributetype: "cms.register",
    attribute: "cms.register",
    periodtype: "cms.register",
    period: "cms.register",
    bibliographicreference: "cms.register",
    publisher: "cms.register",
    continent: "cms.register",
    country: "cms.register",
    region: "cms.register",
    state: "cms.register",
    city: "cms.register",

    // Sistema
    language: "cms.site",
    bannerslider: "cms.site",
    institutionalvideo: "cms.site",
    user: "cms.users",
    permission: "cms.permissions",
};

// telas do CMS abertas a qualquer pessoa
const CMS_PUBLIC_SCREENS = ["loginpage"];

// telas do CMS que exigem apenas estar logado
const CMS_LOGGED_SCREENS = ["mainpage", "logout", "changepassword", "myprofile", "useravatar"];

// permissões usadas acima; não podem ser excluídas, inativadas ou renomeadas
const PROTECTED_PERMISSION_CODES = [...new Set(Object.values(CMS_SCREEN_PERMISSIONS))];

// sessão encerrada após este tempo, mesmo com uso contínuo
const SESSION_ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000;

// as rotas do Express não diferenciam maiúsculas, por isso a comparação é em minúsculas
function getCmsScreen(path) {
    const match = /^\/cms-([a-z0-9]+)(?:[-/]|$)/.exec(path.toLowerCase());
    return match ? match[1] : null;
}

function isCmsPath(path) {
    return path.toLowerCase().startsWith("/cms-");
}

// destino após o login: só aceita caminhos internos do CMS
function safeNextPath(value) {
    if (typeof value === "string" && /^\/cms-[A-Za-z0-9/-]*$/.test(value) && getCmsScreen(value) !== "loginpage") {
        return value;
    }
    return "/cms-MainPage";
}

//---------------------------------------------------
//                   MIDDLEWARES
//---------------------------------------------------

// Bloqueia envios (POST etc.) feitos a partir de outro site (CSRF).
// O navegador informa a origem nos cabeçalhos Origin ou Referer.
function sameOriginGuard(req, res, next) {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
    }

    const expectedHost = process.env.APP_ORIGIN ? new URL(process.env.APP_ORIGIN).host : req.get("host");
    const source = req.get("origin") || req.get("referer");
    let sourceHost = null;
    try {
        sourceHost = new URL(source).host;
    } catch (error) {
        sourceHost = null;
    }

    if (sourceHost && sourceHost === expectedHost) {
        return next();
    }
    return res.status(403).send("Requisição bloqueada: não foi possível confirmar a origem do envio.");
}

// Carrega o usuário da sessão a cada requisição do CMS, para que inativação,
// exclusão, troca de senha e mudança de permissões valham na hora.
async function loadCurrentUser(req, res, next) {
    if (!isCmsPath(req.path) || !req.session || !req.session.userId) {
        return next();
    }

    try {
        const expired = Date.now() - (req.session.loginAt || 0) > SESSION_ABSOLUTE_TIMEOUT_MS;
        const user = expired ? null : await User.selectSessionUser(req.session.userId);

        if (!user || user.sessionVersion !== req.session.sessionVersion) {
            return req.session.destroy(() => next());
        }

        req.currentUser = user;
        res.locals.currentUser = {
            id: user.id,
            name: user.name,
            avatarUrl: avatarUrl(user.id, user.avatar),
        };
        res.locals.can = (code) => user.permissions.includes(code);
        return next();
    } catch (error) {
        return next(error);
    }
}

// Exige login e a permissão da tela em todas as rotas /cms-*.
function requireCmsAccess(req, res, next) {
    if (!isCmsPath(req.path)) {
        return next();
    }

    const screen = getCmsScreen(req.path);
    if (CMS_PUBLIC_SCREENS.includes(screen)) {
        return next();
    }

    if (!req.currentUser) {
        const next_ = req.method === "GET" ? "?next=" + encodeURIComponent(req.originalUrl) : "";
        return res.redirect("/cms-LoginPage" + next_);
    }

    if (CMS_LOGGED_SCREENS.includes(screen)) {
        return next();
    }

    const requiredPermission = CMS_SCREEN_PERMISSIONS[screen];
    if (requiredPermission && req.currentUser.permissions.includes(requiredPermission)) {
        return next();
    }

    return res.status(403).render("../views/cms/cms-AccessDenied");
}

module.exports = {
    PROTECTED_PERMISSION_CODES,
    safeNextPath,
    sameOriginGuard,
    loadCurrentUser,
    requireCmsAccess,
};
