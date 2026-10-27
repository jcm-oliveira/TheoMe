const Permission = require("../model/PermissionModel");

const { PROTECTED_PERMISSION_CODES } = require("../auth/access");

// código no formato "modulo.acao": letras minúsculas, números, ".", "_" ou "-"
const PERMISSION_CODE_PATTERN = /^[a-z0-9]+([._-][a-z0-9]+)*$/;

// permissões usadas pelo controle de acesso não podem ser excluídas, inativadas ou renomeadas
async function validateProtectedPermission(permissionId, permission) {
    const [permissionSelect] = await Permission.selectPermissionById(permissionId);
    const current = permissionSelect[0];
    if (!current || !PROTECTED_PERMISSION_CODES.includes(current.code)) {
        return null;
    }
    if (!permission) {
        return "A permissão \"" + current.code + "\" é usada pelo sistema e não pode ser excluída.";
    }
    if (permission.permissionCode !== current.code || permission.permissionStatus !== 1) {
        return "A permissão \"" + current.code + "\" é usada pelo sistema: o identificador não pode mudar e ela deve ficar ativa.";
    }
    return null;
}

function defaultFilterStatus() {
    return {
        status: 1,
        search: "%",
        currentPage: 1,
        itemsPerPage: 10,
        pageStartItem: 0,
    };
}

function readPermissionForm(body) {
    return {
        permissionStatus: body.permissionStatus === "0" ? 0 : 1,
        permissionCode: (body.permissionCode || "").trim().toLowerCase(),
        permissionName: (body.permissionName || "").trim(),
        permissionDescription: (body.permissionDescription || "").trim() || null,
    };
}

function validatePermissionForm(permission) {
    if (!permission.permissionName || permission.permissionName.length > 150) {
        return "Informe o nome da permissão (até 150 caracteres).";
    }
    if (
        !permission.permissionCode ||
        permission.permissionCode.length > 100 ||
        !PERMISSION_CODE_PATTERN.test(permission.permissionCode)
    ) {
        return "Informe um código válido (ex.: cms.users), usando letras minúsculas, números, \".\", \"_\" ou \"-\".";
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
    const [permissions] = await Permission.selectPermissions(filterStatus);
    const [countSelect] = await Permission.countSelect(filterStatus);

    return res.render("../views/cms/cms-Permission-Q", {
        permissions,
        filterStatus,
        countSelect,
        messages,
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

        const [countSelect] = await Permission.countSelect(filterStatus);

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

        return res.render("../views/cms/cms-Permission-C", {
            messages,
            permission: readPermissionForm({}),
        });
    },

    async insertPermissionPage(req, res) {
        const permission = readPermissionForm(req.body);
        const validationError = validatePermissionForm(permission);

        if (validationError) {
            return res.render("../views/cms/cms-Permission-C", {
                messages: errorMessages(validationError),
                permission,
            });
        }

        const insert = await Permission.insertPermissions(permission);

        if (insert.alertTypeResult === "alert-danger") {
            return res.render("../views/cms/cms-Permission-C", {
                messages: errorMessages(insert.textResult),
                permission,
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
        const permissionId = req.params.id;
        const [permissionSelect] = await Permission.selectPermissionById(permissionId);
        const permissionRow = permissionSelect[0];

        if (!permissionRow) {
            return res.redirect("/cms-Permission-Q");
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página editar carregada.",
        };

        return res.render("../views/cms/cms-Permission-U", {
            messages,
            permissionId: permissionRow.id,
            permission: {
                permissionStatus: permissionRow.status,
                permissionCode: permissionRow.code,
                permissionName: permissionRow.name,
                permissionDescription: permissionRow.description,
            },
        });
    },

    async updatePermissionPage(req, res) {
        const permissionId = Number(req.params.id);
        const permission = readPermissionForm(req.body);
        const validationError = validatePermissionForm(permission)
            || (await validateProtectedPermission(permissionId, permission));

        if (validationError) {
            return res.render("../views/cms/cms-Permission-U", {
                messages: errorMessages(validationError),
                permissionId,
                permission,
            });
        }

        const update = await Permission.updatePermissions(permissionId, permission);

        if (update.alertTypeResult === "alert-danger") {
            return res.render("../views/cms/cms-Permission-U", {
                messages: errorMessages(update.textResult),
                permissionId,
                permission,
            });
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

    async deletePermissionPage(req, res) {
        const permissionId = Number(req.params.id);
        const protectedError = await validateProtectedPermission(permissionId, null);

        if (protectedError) {
            return renderShowPage(res, defaultFilterStatus(), errorMessages(protectedError));
        }

        const deleted = await Permission.deletePermissions(permissionId);

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

    async filterPermissionPage(req, res) {
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
