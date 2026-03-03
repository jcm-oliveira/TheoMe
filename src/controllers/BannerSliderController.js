const BannerSlider = require("../model/BannerSliderModel");
console.log("BannerSliderController file starts...");

module.exports = {

//------------------------------------------------
//                SHOW PAGE ROUTINE
//------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            status: Number(1),
            search: '%',
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const [countSelect] = await BannerSlider.countSelect(filterStatus)
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        }
        return res.render("../views/cms/cms-BannerSlider-Q", { bannerSliders, filterStatus, countSelect, messages });
    },

    async loadHomePage(req, res) {
        const filterStatus = {
            status: 1,
            search: '%',
            currentPage: 1,
            itemsPerPage: 100,
            pageStartItem: 0,
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        return res.render("../views/index", { bannerSliders })
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
        }     
        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--
                filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage 
            }
        }
        const [countSelect] = await BannerSlider.countSelect(filterStatus)
        if (filterStatus.nextBtn === "nextBtnClicked") {
            if ((filterStatus.pageStartItem + filterStatus.itemsPerPage) < countSelect[0].totalRegister) {
                filterStatus.currentPage++
                filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage
            }
        }      
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: ("Página " + filterStatus.currentPage + " selecionada."),
        }
        return res.render("../views/cms/cms-BannerSlider-Q", { bannerSliders, filterStatus, countSelect, messages });
    },

//------------------------------------------------
//                 INSERT ROUTINE
//------------------------------------------------

    async loadInsertPage(req, res) {        
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        }
        return res.render("../views/cms/cms-BannerSlider-C", { messages })            
    },

    async insertBannerSliderPage(req, res) {
        const filterStatus = {
            status: 1,
            search: '%',
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        }     
        const imageUrl = req.file ? ('/uploads/banners/' + req.file.filename) : (req.body.bannerImageUrl || null)
        const insert = await BannerSlider.insertBannerSlider({
            bannerStatus: req.body.bannerStatus,
            bannerTitle: req.body.bannerTitle,
            bannerDescription: req.body.bannerDescription,
            bannerLanguage: req.body.bannerLanguage,
            bannerImageUrl: imageUrl,
            bannerCtaUrl: req.body.bannerCtaUrl,
            bannerCtaText: req.body.bannerCtaText
        });
        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const [countSelect] = await BannerSlider.countSelect(filterStatus)
        return res.render('../views/cms/cms-BannerSlider-Q', { bannerSliders, filterStatus, countSelect, messages })
    },

//------------------------------------------------
//                 UPDATE ROUTINE
//------------------------------------------------

    async loadUpdatePage(req, res) {        
        const bannerId = req.params.id
        const filterStatus = {
            status: '%',
            search: '%',
            currentPage: 1,
            itemsPerPage: 100,
            pageStartItem: 0,
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const bannerSlider = bannerSliders.find(banner => Number(banner.id) === Number(bannerId))
        if (!bannerSlider) {
            return res.send('BannerSlider not found')
        }
        return res.render("../views/cms/cms-BannerSlider-U", { bannerSlider })     
    },

    async updateBannerSliderPage(req, res) {
        const filterStatus = {
            status: 1,
            search: '%',
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        } 
        const bannerId = req.params.id
        const imageUrl = req.file ? ('/uploads/banners/' + req.file.filename) : (req.body.bannerImageUrl || null)
        const updatedBannerSlider = {
            bannerStatus: req.body.bannerStatus,
            bannerTitle: req.body.bannerTitle,
            bannerDescription: req.body.bannerDescription,
            bannerLanguage: req.body.bannerLanguage,
            bannerImageUrl: imageUrl,
            bannerCtaUrl: req.body.bannerCtaUrl,
            bannerCtaText: req.body.bannerCtaText
        }
        const update = await BannerSlider.updateBannerSlider(bannerId, updatedBannerSlider)
        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const [countSelect] = await BannerSlider.countSelect(filterStatus)
        return res.render('../views/cms/cms-BannerSlider-Q', { bannerSliders, filterStatus, countSelect, messages })
    },

//------------------------------------------------
//                DELETE ROUTINE
//------------------------------------------------

    async deleteBannerSliderPage(req, res) {
        const filterStatus = {
            status: '1',
            search: '%',
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        } 
        const bannerId = req.params.id
        const deleted = await BannerSlider.deleteBannerSlider(bannerId)
        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const [countSelect] = await BannerSlider.countSelect(filterStatus)
        return res.render('../views/cms/cms-BannerSlider-Q', { bannerSliders, filterStatus, countSelect, messages })
    },

//------------------------------------------------
//               FILTER ROUTINE
//------------------------------------------------

    async filterBannerSliderPage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
        }
        console.log(filterStatus);
        
        if (filterStatus.status === Number(2)) {
            filterStatus.status = '%'
        }
        if (filterStatus.search === "") {
            filterStatus.search = '%'
        }
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        }
        const [bannerSliders] = await BannerSlider.selectBannerSliders(filterStatus)
        const [countSelect] = await BannerSlider.countSelect(filterStatus)
        return res.render("../views/cms/cms-BannerSlider-Q", { bannerSliders, filterStatus, countSelect, messages });
    }

}
