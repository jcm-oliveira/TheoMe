const AttributeType = require("../model/AttributeTypeModel");
console.log("AttributeTypeController file starts...");

module.exports = {
    //------------------------------------------------
    //                SHOW PAGE ROUTINE
    //------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const [attributeTypes] = await AttributeType.selectAttributeTypes(filterStatus);
        const [countSelect] = await AttributeType.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-AttributeType-Q", {
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
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

        const [countSelect] = await AttributeType.countSelect(filterStatus);

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

        const [attributeTypes] = await AttributeType.selectAttributeTypes(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-AttributeType-Q", {
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
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

        return res.render("../views/cms/cms-AttributeType-C", {
            messages,
        });
    },

    async insertAttributeTypePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const insert = await AttributeType.insertAttributeTypes({
            attributeTypeStatus: req.body.attributeTypeStatus,
            attributeTypeName: req.body.attributeTypeName,
            attributeTypeDescription: req.body.attributeTypeDescription,
            attributeTypeImage: req.body.attributeTypeImage,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [attributeTypes] = await AttributeType.selectAttributeTypes(filterStatus);
        const [countSelect] = await AttributeType.countSelect(filterStatus);

        return res.render("../views/cms/cms-AttributeType-Q", {
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                 UPDATE ROUTINE
    //------------------------------------------------

    async loadUpdatePage(req, res) {
        const attributeTypeId = req.params.id;
        const [attributeTypeSelect] = await AttributeType.selectAttributeTypeById(
            attributeTypeId
        );
        const attributeType = attributeTypeSelect[0];

        if (!attributeType) {
            return res.send("AttributeType not found");
        }

        return res.render("../views/cms/cms-AttributeType-U", {
            attributeType,
        });
    },

    async updateAttributeTypePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const attributeTypeId = req.params.id;
        const update = await AttributeType.updateAttributeTypes(attributeTypeId, {
            attributeTypeStatus: req.body.attributeTypeStatus,
            attributeTypeName: req.body.attributeTypeName,
            attributeTypeDescription: req.body.attributeTypeDescription,
            attributeTypeImage: req.body.attributeTypeImage,
        });

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [attributeTypes] = await AttributeType.selectAttributeTypes(filterStatus);
        const [countSelect] = await AttributeType.countSelect(filterStatus);

        return res.render("../views/cms/cms-AttributeType-Q", {
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteAttributeTypePage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const attributeTypeId = req.params.id;
        const deleted = await AttributeType.deleteAttributeTypes(attributeTypeId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [attributeTypes] = await AttributeType.selectAttributeTypes(filterStatus);
        const [countSelect] = await AttributeType.countSelect(filterStatus);

        return res.render("../views/cms/cms-AttributeType-Q", {
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterAttributeTypePage(req, res) {
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

        const [attributeTypes] = await AttributeType.selectAttributeTypes(filterStatus);
        const [countSelect] = await AttributeType.countSelect(filterStatus);

        return res.render("../views/cms/cms-AttributeType-Q", {
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
