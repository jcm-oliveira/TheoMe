const User = require("../model/UserModel");
const Permission = require("../model/PermissionModel");
const { validatePassword, hashPassword } = require("../auth/password");
const { readProfileForm, validateProfileForm, loadProfileOptions, profileFromRow } = require("../helpers/userProfile");
const { discardUploadedAvatar, removeAvatarFile } = require("../helpers/avatarUpload");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// permissão que dá acesso a esta tela; o usuário logado não pode retirá-la de si mesmo
const USERS_PERMISSION_CODE = "cms.users";

function defaultFilterStatus() {
    return {
        status: 1,
        search: "%",
        currentPage: 1,
        itemsPerPage: 10,
        pageStartItem: 0,
    };
}

// aceita um id, uma lista de ids ou nada (nenhuma caixa marcada)
function parsePermissionIds(value) {
    const list = Array.isArray(value) ? value : value === undefined ? [] : [value];
    const ids = list.map(Number).filter((id) => Number.isInteger(id) && id > 0);
    return [...new Set(ids)];
}

// a senha nunca volta para a tela
function readUserForm(body) {
    return {
        userStatus: body.userStatus === "0" ? 0 : 1,
        userName: (body.userName || "").trim(),
        userEmail: (body.userEmail || "").trim().toLowerCase(),
        permissionIds: parsePermissionIds(body.permissionIds),
        ...readProfileForm(body),
    };
}

function validateUserForm(user, password, passwordConfirm, passwordRequired) {
    if (!user.userName || user.userName.length > 150) {
        return "Informe o nome completo (até 150 caracteres).";
    }
    if (!user.userEmail || user.userEmail.length > 254 || !EMAIL_PATTERN.test(user.userEmail)) {
        return "Informe um e-mail válido.";
    }
    if (!password && !passwordRequired) {
        return null;
    }
    return validatePassword(password, passwordConfirm);
}

// evita que o usuário logado se desative ou perca o acesso a esta tela
async function validateSelfUpdate(req, userId, user) {
    if (!req.session || req.session.userId !== userId) {
        return null;
    }
    if (user.userStatus !== 1) {
        return "Você não pode inativar o seu próprio usuário.";
    }
    const codes = await Permission.selectPermissionCodesByIds(user.permissionIds);
    if (!codes.includes(USERS_PERMISSION_CODE)) {
        return "Você não pode remover de si mesmo a permissão de acesso a Usuários.";
    }
    return null;
}

function errorMessages(textMessage) {
    return {
        display: "",
        alertType: "alert-danger",
        textMessage,
    };
}

async function renderShowPage(res, filterStatus, messages) {
    const [users] = await User.selectUsers(filterStatus);
    const [countSelect] = await User.countSelect(filterStatus);

    return res.render("../views/cms/cms-User-Q", {
        users,
        filterStatus,
        countSelect,
        messages,
    });
}

async function renderFormPage(res, view, data) {
    const [permissionOptions] = await Permission.selectPermissionOptions();

    return res.render("../views/cms/" + view, {
        permissionOptions,
        ...(await loadProfileOptions(User)),
        ...data,
    });
}

module.exports = {
    //------------------------------------------------
    //                SHOW PAGE ROUTINE
    //------------------------------------------------

    async loadShowPage(req, res) {
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return renderShowPage(res, defaultFilterStatus(), messages);
    },

    //------------------------------------------------
    //              PAGINATION CONTROL
    //------------------------------------------------

    async paginationView(req, res) {
        const filterStatus = {
            status: req.body.status,
            search: req.body.search,
            currentPage: Number(req.body.currentPage),
            itemsPerPage: Number(req.body.itemsPerPage),
            pageStartItem: Number(req.body.pageStartItem),
            prevBtn: req.body.previousButton,
            nextBtn: req.body.nextButton,
        };

        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem - filterStatus.itemsPerPage;
            }
        }

        const [countSelect] = await User.countSelect(filterStatus);

        if (filterStatus.nextBtn === "nextBtnClicked") {
            if (
                filterStatus.pageStartItem + filterStatus.itemsPerPage <
                countSelect[0].totalRegister
            ) {
                filterStatus.currentPage++;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem + filterStatus.itemsPerPage;
            }
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return renderShowPage(res, filterStatus, messages);
    },

    //------------------------------------------------
    //                 INSERT ROUTINE
    //------------------------------------------------

    async loadInsertPage(req, res) {
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        };

        return renderFormPage(res, "cms-User-C", {
            messages,
            user: readUserForm({}),
        });
    },

    async insertUserPage(req, res) {
        const user = readUserForm(req.body);
        const password = req.body.userPassword || "";
        const validationError = validateUserForm(user, password, req.body.userPasswordConfirm, true)
            || req.avatarError
            || (await validateProfileForm(user, User))
            || (await User.emailInUse(user.userEmail) ? "Já existe um usuário com este e-mail." : null);

        if (validationError) {
            discardUploadedAvatar(req);
            return renderFormPage(res, "cms-User-C", {
                messages: errorMessages(validationError),
                user,
            });
        }

        user.permissionIds = await User.filterValidPermissionIds(user.permissionIds);
        user.passwordHash = await hashPassword(password);
        user.avatar = req.file ? req.file.filename : null;

        const insert = await User.insertUsers(user);

        if (insert.alertTypeResult === "alert-danger") {
            discardUploadedAvatar(req);
            user.avatar = undefined;
            return renderFormPage(res, "cms-User-C", {
                messages: errorMessages(insert.textResult),
                user,
            });
        }

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        return renderShowPage(res, defaultFilterStatus(), messages);
    },

    //------------------------------------------------
    //                 UPDATE ROUTINE
    //------------------------------------------------

    async loadUpdatePage(req, res) {
        const userId = Number(req.params.id);
        const [userSelect] = await User.selectUserById(userId);
        const userRow = userSelect[0];

        if (!userRow) {
            return res.redirect("/cms-User-Q");
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página editar carregada.",
        };

        return renderFormPage(res, "cms-User-U", {
            messages,
            userId: userRow.id,
            user: {
                userStatus: userRow.status,
                userName: userRow.name,
                userEmail: userRow.email,
                permissionIds: await User.selectUserPermissionIds(userId),
                ...profileFromRow(userRow),
            },
        });
    },

    async updateUserPage(req, res) {
        const userId = Number(req.params.id);
        const [userSelect] = await User.selectUserById(userId);
        const currentRow = userSelect[0];

        if (!currentRow) {
            discardUploadedAvatar(req);
            return res.redirect("/cms-User-Q");
        }

        const user = readUserForm(req.body);
        const password = req.body.userPassword || "";
        const validationError = validateUserForm(user, password, req.body.userPasswordConfirm, false)
            || req.avatarError
            || (await validateProfileForm(user, User))
            || (await User.emailInUse(user.userEmail, userId) ? "Já existe um usuário com este e-mail." : null);

        // ao voltar para a tela com erro, mostra a foto que continua gravada
        const renderError = (textMessage) => {
            discardUploadedAvatar(req);
            return renderFormPage(res, "cms-User-U", {
                messages: errorMessages(textMessage),
                userId,
                user: { ...user, avatar: currentRow.avatar },
            });
        };

        if (validationError) {
            return renderError(validationError);
        }

        user.permissionIds = await User.filterValidPermissionIds(user.permissionIds);

        const selfUpdateError = await validateSelfUpdate(req, userId, user);
        if (selfUpdateError) {
            return renderError(selfUpdateError);
        }

        if (password) {
            user.passwordHash = await hashPassword(password);
        }
        user.avatar = req.file ? req.file.filename : user.removeAvatar ? null : undefined;

        const update = await User.updateUsers(userId, user);

        if (update.alertTypeResult === "alert-danger") {
            return renderError(update.textResult);
        }

        // foto substituída ou removida: apaga o arquivo antigo
        if (user.avatar !== undefined && currentRow.avatar) {
            removeAvatarFile(currentRow.avatar);
        }

        // a troca de senha encerra as outras sessões, mas mantém a do próprio usuário
        if (password && req.session && req.session.userId === userId) {
            const sessionUser = await User.selectSessionUser(userId);
            req.session.sessionVersion = sessionUser ? sessionUser.sessionVersion : null;
        }

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        return renderShowPage(res, defaultFilterStatus(), messages);
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteUserPage(req, res) {
        const userId = Number(req.params.id);

        if (req.session && req.session.userId === userId) {
            return renderShowPage(res, defaultFilterStatus(), errorMessages("Você não pode excluir o seu próprio usuário."));
        }

        const deleted = await User.deleteUsers(userId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        return renderShowPage(res, defaultFilterStatus(), messages);
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterUserPage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
        };

        if (filterStatus.status === Number(2)) {
            filterStatus.status = "%";
        }
        if (filterStatus.search === "") {
            filterStatus.search = "%";
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        };

        return renderShowPage(res, filterStatus, messages);
    },
};
