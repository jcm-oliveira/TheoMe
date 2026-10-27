const User = require("../model/UserModel");
const { validatePassword, hashPassword, verifyPassword } = require("../auth/password");
const { safeNextPath } = require("../auth/access");

// mensagem única para e-mail inexistente, senha errada ou usuário inativo,
// para não revelar quais e-mails estão cadastrados
const LOGIN_FAILED_MESSAGE = "E-mail ou senha inválidos.";

function hiddenMessages() {
    return {
        display: "d-none",
        alertType: "",
        textMessage: "",
    };
}

function renderLoginPage(res, data = {}) {
    return res.render("../views/cms/cms-LoginPage", {
        messages: hiddenMessages(),
        email: "",
        next: "",
        ...data,
    });
}

function renderMainPage(res, messages = hiddenMessages()) {
    return res.render("../views/cms/cms-MainPage", { messages });
}

module.exports = {
    //------------------------------------------------
    //                 LOGIN ROUTINE
    //------------------------------------------------

    loadLoginPage(req, res) {
        if (req.currentUser) {
            return res.redirect("/cms-MainPage");
        }
        return renderLoginPage(res, { next: safeNextPath(req.query.next) });
    },

    async login(req, res) {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        const nextPath = safeNextPath(req.body.next);

        const credentials = email ? await User.selectUserCredentialsByEmail(email) : null;
        const valid = await verifyPassword(password, credentials ? credentials.passwordHash : null);

        if (!valid) {
            // status 401 faz a tentativa contar no limite de tentativas de login
            res.status(401);
            return renderLoginPage(res, {
                email,
                next: nextPath,
                messages: { display: "", alertType: "alert-danger", textMessage: LOGIN_FAILED_MESSAGE },
            });
        }

        // nova sessão a cada login (evita fixação de sessão)
        return req.session.regenerate(async (error) => {
            if (error) {
                return res.status(500).send("Não foi possível iniciar a sessão.");
            }
            req.session.userId = credentials.id;
            req.session.sessionVersion = credentials.sessionVersion;
            req.session.loginAt = Date.now();
            await User.updateLastLogin(credentials.id);
            return req.session.save(() => res.redirect(nextPath));
        });
    },

    logout(req, res) {
        return req.session.destroy(() => {
            res.clearCookie("theome.sid");
            return res.redirect("/cms-LoginPage");
        });
    },

    //------------------------------------------------
    //                  MAIN PAGE
    //------------------------------------------------

    loadMainPage(req, res) {
        return renderMainPage(res);
    },

    //------------------------------------------------
    //            CHANGE OWN PASSWORD
    //------------------------------------------------

    async changePassword(req, res) {
        const error = (textMessage) => {
            res.status(400);
            return renderMainPage(res, { display: "", alertType: "alert-danger", textMessage });
        };

        const credentials = await User.selectUserCredentialsById(req.currentUser.id);
        const currentValid = await verifyPassword(req.body.currentPassword, credentials ? credentials.passwordHash : null);
        if (!currentValid) {
            return error("A senha atual não confere. A senha não foi alterada.");
        }

        const newPassword = String(req.body.newPassword || "");
        const validationError = validatePassword(newPassword, req.body.newPasswordConfirm);
        if (validationError) {
            return error(validationError + " A senha não foi alterada.");
        }

        const sessionVersion = await User.updateOwnPassword(req.currentUser.id, await hashPassword(newPassword));
        if (sessionVersion === null) {
            return error("Um erro ocorreu durante a troca de senha. A senha não foi alterada.");
        }

        // mantém esta sessão; as demais sessões do usuário são encerradas
        req.session.sessionVersion = sessionVersion;
        return renderMainPage(res, {
            display: "",
            alertType: "alert-success",
            textMessage: "Senha alterada com sucesso. As outras sessões abertas foram encerradas.",
        });
    },
};
