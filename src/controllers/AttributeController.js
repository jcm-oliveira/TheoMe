const Attribute = require("../model/AttributeModel");

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
            attributeTypeFilter: "%",
        };

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributes] = await Attribute.selectAttributes(filterStatus);
        const [countSelect] = await Attribute.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-Attribute-Q", {
            attributes,
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
            attributeTypeFilter: req.body.attributeTypeFilter,
        };

        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem - filterStatus.itemsPerPage;
            }
        }

        const [countSelect] = await Attribute.countSelect(filterStatus);

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

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributes] = await Attribute.selectAttributes(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-Attribute-Q", {
            attributes,
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

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();

        return res.render("../views/cms/cms-Attribute-C", {
            messages,
            attributeTypes,
        });
    },

    async insertAttributePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            attributeTypeFilter: "%",
        };

        const insert = await Attribute.insertAttributes({
            attributeStatus: req.body.attributeStatus,
            attributeName: req.body.attributeName,
            attributeDescription: req.body.attributeDescription,
            attributeImage: req.body.attributeImage,
            attributeIdType: req.body.id_AttributeType,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributes] = await Attribute.selectAttributes(filterStatus);
        const [countSelect] = await Attribute.countSelect(filterStatus);

        return res.render("../views/cms/cms-Attribute-Q", {
            attributes,
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
        const attributeId = req.params.id;
        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributeSelect] = await Attribute.selectAttributeById(attributeId);
        const attribute = attributeSelect[0];

        if (!attribute) {
            return res.send("Attribute not found");
        }

        return res.render("../views/cms/cms-Attribute-U", {
            attribute,
            attributeTypes,
        });
    },

    async updateAttributePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            attributeTypeFilter: "%",
        };

        const attributeId = req.params.id;
        const update = await Attribute.updateAttributes(attributeId, {
            attributeStatus: req.body.attributeStatus,
            attributeName: req.body.attributeName,
            attributeDescription: req.body.attributeDescription,
            attributeImage: req.body.attributeImage,
            attributeIdType: req.body.id_AttributeType,
        });

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributes] = await Attribute.selectAttributes(filterStatus);
        const [countSelect] = await Attribute.countSelect(filterStatus);

        return res.render("../views/cms/cms-Attribute-Q", {
            attributes,
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteAttributePage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            attributeTypeFilter: "%",
        };

        const attributeId = req.params.id;
        const deleted = await Attribute.deleteAttributes(attributeId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributes] = await Attribute.selectAttributes(filterStatus);
        const [countSelect] = await Attribute.countSelect(filterStatus);

        return res.render("../views/cms/cms-Attribute-Q", {
            attributes,
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterAttributePage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            attributeTypeFilter: req.body.attributeTypeFilter,
        };

        if (filterStatus.status === Number(2)) {
            filterStatus.status = "%";
        }
        if (filterStatus.search === "") {
            filterStatus.search = "%";
        }
        if (filterStatus.attributeTypeFilter === "0") {
            filterStatus.attributeTypeFilter = "%";
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        };

        const [attributeTypes] = await Attribute.filterSelectAttributeTypes();
        const [attributes] = await Attribute.selectAttributes(filterStatus);
        const [countSelect] = await Attribute.countSelect(filterStatus);

        return res.render("../views/cms/cms-Attribute-Q", {
            attributes,
            attributeTypes,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
