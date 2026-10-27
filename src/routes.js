//---------------------------------------------------
//               EXPRESS CONFIGURATIONS
//---------------------------------------------------

express = require('express');
const routes = express.Router()
const views = __dirname + "/views/"

//---------------------------------------------------
//                  REQUIRED FILES
//---------------------------------------------------

const ContinentController = require('./controllers/ContinentController.js')
const CountryController = require('./controllers/CountryController.js')
const RegionController = require('./controllers/RegionController.js')
const StateController = require('./controllers/StateController.js')
const CityController = require('./controllers/CityController.js')
const HistoricalPerspectiveController = require('./controllers/HistoricalPerspectiveController.js')
const CategoryController = require('./controllers/CategoryController.js')
const CategoryLevel2Controller = require('./controllers/CategoryLevel2Controller.js')
const CategoryLevel3Controller = require('./controllers/CategoryLevel3Controller.js')
const SectionController = require('./controllers/SectionController.js')
const StudyItemController = require('./controllers/StudyItemController.js')
const TimelineController = require('./controllers/TimelineController.js')
const AttributeTypeController = require('./controllers/AttributeTypeController.js')
const AttributeController = require('./controllers/AttributeController.js')
const BannerSliderController = require('./controllers/BannerSliderController.js')
const UserController = require('./controllers/UserController.js')
const PermissionController = require('./controllers/PermissionController.js')
const AuthController = require('./controllers/AuthController.js')
const { loginLimiter, changePasswordLimiter } = require('./auth/limits.js')
const ProfileController = require('./controllers/ProfileController.js')
const { avatarUpload } = require('./helpers/avatarUpload.js')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads', 'banners'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({ storage: storage })

const storageStudyItemAttributeImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads', 'study-item-attributes'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, 'attribute-image-' + uniqueSuffix + ext)
    }
})

const uploadStudyItemAttributeImage = multer({ storage: storageStudyItemAttributeImage })

//---------------------------------------------------
//                  PORTAL ROUTES
//---------------------------------------------------

routes.get('/', BannerSliderController.loadHomePage);

// TOOLS
routes.get('/Tools-MainPage', (req,res) => res.render(views + "tools/Tools-MainPage"));
routes.get('/HolyBible', (req,res) => res.render(views + "tools/HolyBible"));
routes.get('/BibleTypeSelection', (req,res) => res.render(views + "tools/BibleTypeSelection"));
routes.get('/ReadingChronologicalPage', (req,res) => res.render(views + "tools/ReadingChronologicalPage"));
routes.get('/ChronologicalEvents', (req,res) => res.render(views + "tools/ChronologicalEvents"));
routes.get('/Timeline', (req,res) => res.render(views + "tools/Timeline"));
routes.get('/Timeline-IframeBar.ejs', (req,res) => res.render(views + "tools/Timeline-IframeBar.ejs", { Period }));
routes.get('/T-BookSummary', (req,res) => res.render(views + "tools/T-BookSummary"));
routes.get('/T-BookData', (req,res) => res.render(views + "tools/T-BookData"));
routes.get('/T-BookSchemaOfContent', (req,res) => res.render(views + "tools/T-BookSchemaOfContent"));
routes.get('/T-BookReadingPage', (req,res) => res.render(views + "tools/T-BookReadingPage"));

// LIBRARY
routes.get('/Library-MainPage', (req,res) => res.render(views + "library/Library-MainPage"));

//CHRISTIANITY
routes.get('/Christianity-MainPage', (req,res) => res.render(views + "christianity/Christianity-MainPage"));

// COMMUNITY
routes.get('/Community-MainPage', (req,res) => res.render(views + "community/Community-MainPage"));

// ABOUT
routes.get('/WhoWeAre', (req,res) => res.render(views + "about/WhoWeAre"));
routes.get('/Collaboration', (req,res) => res.render(views + "about/Collaboration"));

//---------------------------------------------------
//                  CMS ROUTES
//---------------------------------------------------

// CMS - Content Management System - B4
// login, sessão e controle de acesso: ver src/auth/access.js
routes.get('/cms-LoginPage', AuthController.loadLoginPage);
routes.post('/cms-LoginPage', loginLimiter, AuthController.login);
routes.post('/cms-Logout', AuthController.logout);
routes.get('/cms-MainPage', AuthController.loadMainPage);
routes.post('/cms-ChangePassword', changePasswordLimiter, AuthController.changePassword);
routes.get('/cms-MyProfile', ProfileController.loadProfilePage);
routes.post('/cms-MyProfile', avatarUpload, ProfileController.updateProfilePage);
routes.get('/cms-UserAvatar/:id', ProfileController.sendUserAvatar);

// RESEARCH
routes.get('/cms-StudyItem-Q', StudyItemController.loadShowPage);
routes.post('/cms-StudyItem-F', StudyItemController.filterStudyItemPage)
routes.get('/cms-StudyItem-C', StudyItemController.loadInsertPage);
routes.get('/cms-StudyItem-C/:id', StudyItemController.loadUpdatePage);
routes.post('/cms-StudyItem-C', StudyItemController.insertStudyItemPage)
routes.post('/cms-StudyItem-U/:id', StudyItemController.updateStudyItemPage)
routes.post('/cms-StudyItem-D/:id', StudyItemController.deleteStudyItemPage)
routes.post('/cms-StudyItem-X-HistoricalPerspective', StudyItemController.historicalPerspectiveListener)
routes.post('/cms-StudyItem-X-Level1', StudyItemController.level1Listener)
routes.post('/cms-StudyItem-X-Level2', StudyItemController.level2Listener)
routes.post('/cms-StudyItem-X-Level3', StudyItemController.level3Listener)
routes.post('/cms-StudyItem-X-AttributeType', StudyItemController.attributeTypeListener)
routes.post('/cms-StudyItem-X-Association-Section', StudyItemController.associationSectionListener)
routes.post('/cms-StudyItem-Upload-Attribute-Image', uploadStudyItemAttributeImage.single('attributeImage'), StudyItemController.uploadAttributeImage)
routes.post('/cms-StudyItem-X-Continent', StudyItemController.continentListener)
routes.post('/cms-StudyItem-X-Country', StudyItemController.countryListener)
routes.post('/cms-StudyItem-X-Region', StudyItemController.regionListener)
routes.post('/cms-StudyItem-X-State', StudyItemController.stateListener)
routes.get('/cms-StudyItemOld-Q', (req,res) => res.render(views + "cms/cms-StudyItemOld-Q"));
routes.get('/cms-StudyItemOld-C', (req,res) => res.render(views + "cms/cms-StudyItemOld-C"));

// BIBLE
routes.get('/cms-BibleTranslation-Q', (req,res) => res.render(views + "cms/cms-BibleTranslation-Q"));
routes.get('/cms-BibleTranslation-C', (req,res) => res.render(views + "cms/cms-BibleTranslation-C"));

routes.get('/cms-Book-Q', (req,res) => res.render(views + "cms/cms-Book-Q"));
routes.get('/cms-Book-C', (req,res) => res.render(views + "cms/cms-Book-C"));

routes.get('/cms-Chapter-Q', (req,res) => res.render(views + "cms/cms-Chapter-Q"));
routes.get('/cms-Chapter-C', (req,res) => res.render(views + "cms/cms-Chapter-C"));

routes.get('/cms-BibliographicReference-Q', (req,res) => res.render(views + "cms/cms-BibliographicReference-Q"));
routes.get('/cms-BibliographicReference-C', (req,res) => res.render(views + "cms/cms-BibliographicReference-C"));
routes.get('/cms-Publisher-Q', (req,res) => res.render(views + "cms/cms-Publisher-Q"));
routes.get('/cms-Publisher-C', (req,res) => res.render(views + "cms/cms-Publisher-C"));

// REGISTER
routes.get('/cms-AttributeType-Q', AttributeTypeController.loadShowPage);
routes.get('/cms-AttributeType-C', AttributeTypeController.loadInsertPage);
routes.get('/cms-AttributeType-C/:id', AttributeTypeController.loadUpdatePage);
routes.post('/cms-AttributeType-Q', AttributeTypeController.paginationView);
routes.post('/cms-AttributeType-C', AttributeTypeController.insertAttributeTypePage);
routes.post('/cms-AttributeType-U/:id', AttributeTypeController.updateAttributeTypePage);
routes.post('/cms-AttributeType-D/:id', AttributeTypeController.deleteAttributeTypePage);
routes.post('/cms-AttributeType-F', AttributeTypeController.filterAttributeTypePage);

routes.get('/cms-Attribute-Q', AttributeController.loadShowPage);
routes.get('/cms-Attribute-C', AttributeController.loadInsertPage);
routes.get('/cms-Attribute-C/:id', AttributeController.loadUpdatePage);
routes.post('/cms-Attribute-Q', AttributeController.paginationView);
routes.post('/cms-Attribute-C', AttributeController.insertAttributePage);
routes.post('/cms-Attribute-U/:id', AttributeController.updateAttributePage);
routes.post('/cms-Attribute-D/:id', AttributeController.deleteAttributePage);
routes.post('/cms-Attribute-F', AttributeController.filterAttributePage);

// Backward compatibility routes (legacy names)
routes.get('/cms-PeriodType-Q', (req,res) => res.redirect('/cms-AttributeType-Q'));
routes.get('/cms-PeriodType-C', (req,res) => res.redirect('/cms-AttributeType-C'));
routes.get('/cms-Period-Q', (req,res) => res.redirect('/cms-Attribute-Q'));
routes.get('/cms-Period-C', (req,res) => res.redirect('/cms-Attribute-C'));

//___________________Continent________________________

routes.get('/cms-Continent-Q', ContinentController.loadShowPage)
routes.get('/cms-Continent-C', ContinentController.loadInsertPage)
routes.get('/cms-Continent-C/:id', ContinentController.loadUpdatePage)
routes.post('/cms-Continent-Q', ContinentController.paginationView)
routes.post('/cms-Continent-C', ContinentController.insertContinentPage)
routes.post('/cms-Continent-U/:id', ContinentController.updateContinentPage)
routes.post('/cms-Continent-D/:id', ContinentController.deleteContinentPage)
routes.post('/cms-Continent-F', ContinentController.filterContinentPage)

//_____________________Country_________________________

routes.get('/cms-Country-Q', CountryController.loadShowPage)
routes.get('/cms-Country-C', CountryController.loadInsertPage)
routes.get('/cms-Country-C/:id', CountryController.loadUpdatePage)
routes.post('/cms-Country-Q', CountryController.paginationView)
routes.post('/cms-Country-C', CountryController.insertCountryPage)
routes.post('/cms-Country-U/:id', CountryController.updateCountryPage)
routes.post('/cms-Country-D/:id', CountryController.deleteCountryPage)
routes.post('/cms-Country-F', CountryController.filterCountryPage)

//_____________________Region__________________________

routes.get('/cms-Region-Q', RegionController.loadShowPage)
routes.get('/cms-Region-C', RegionController.loadInsertPage)
routes.get('/cms-Region-C/:id', RegionController.loadUpdatePage)
routes.post('/cms-Region-Q', RegionController.paginationView)
routes.post('/cms-Region-C', RegionController.insertRegionPage)
routes.post('/cms-Region-U/:id', RegionController.updateRegionPage)
routes.post('/cms-Region-D/:id', RegionController.deleteRegionPage)
routes.post('/cms-Region-F', RegionController.filterCountryPage)
routes.post('/cms-Region-X', RegionController.continentListener)

//_____________________State__________________________

routes.get('/cms-State-Q', StateController.loadShowPage)
routes.get('/cms-State-C', StateController.loadInsertPage)
routes.get('/cms-State-C/:id', StateController.loadUpdatePage)
routes.post('/cms-State-Q', StateController.paginationView)
routes.post('/cms-State-C', StateController.insertStatePage)
routes.post('/cms-State-U/:id', StateController.updateStatePage)
routes.post('/cms-State-D/:id', StateController.deleteStatePage)
routes.post('/cms-State-F', StateController.filterStatePage)
routes.post('/cms-State-X-Continent', StateController.continentListener)
routes.post('/cms-State-X-Country', StateController.countryListener)

//_____________________City__________________________

routes.get('/cms-City-Q', CityController.loadShowPage)
routes.get('/cms-City-C', CityController.loadInsertPage)
routes.get('/cms-City-C/:id', CityController.loadUpdatePage)
routes.post('/cms-City-Q', CityController.paginationView)
routes.post('/cms-City-C', CityController.insertCityPage)
routes.post('/cms-City-U/:id', CityController.updateCityPage)
routes.post('/cms-City-D/:id', CityController.deleteCityPage)
routes.post('/cms-City-F', CityController.filterCityPage)
routes.post('/cms-City-X-Continent', CityController.continentListener)
routes.post('/cms-City-X-Country', CityController.countryListener)
routes.post('/cms-City-X-Region', CityController.regionListener)

//_________________HistoricalPerspective________________

routes.get('/cms-HistoricalPerspective-Q', HistoricalPerspectiveController.loadShowPage)
routes.get('/cms-HistoricalPerspective-C', HistoricalPerspectiveController.loadInsertPage)
routes.get('/cms-HistoricalPerspective-C/:id', HistoricalPerspectiveController.loadUpdatePage)
routes.post('/cms-HistoricalPerspective-Q', HistoricalPerspectiveController.paginationView)
routes.post('/cms-HistoricalPerspective-C', HistoricalPerspectiveController.insertHistoricalPerspectivePage)
routes.post('/cms-HistoricalPerspective-U/:id', HistoricalPerspectiveController.updateHistoricalPerspectivePage)
routes.post('/cms-HistoricalPerspective-D/:id', HistoricalPerspectiveController.deleteHistoricalPerspectivePage)
routes.post('/cms-HistoricalPerspective-F', HistoricalPerspectiveController.filterHistoricalPerspectivePage)

//______________________Timeline________________________

routes.get('/cms-Timeline-Q', TimelineController.loadShowPage)
routes.get('/cms-Timeline-C', TimelineController.loadInsertPage)
routes.get('/cms-Timeline-C/:id', TimelineController.loadUpdatePage)
routes.post('/cms-Timeline-Q', TimelineController.paginationView)
routes.post('/cms-Timeline-C', TimelineController.insertTimelinePage)
routes.post('/cms-Timeline-U/:id', TimelineController.updateTimelinePage)
routes.post('/cms-Timeline-D/:id', TimelineController.deleteTimelinePage)
routes.post('/cms-Timeline-F', TimelineController.filterTimelinePage)

//_____________________Category__________________________

routes.get('/cms-Category-Q', CategoryController.loadShowPage)
routes.get('/cms-Category-C', CategoryController.loadInsertPage)
routes.get('/cms-Category-C/:id', CategoryController.loadUpdatePage)
routes.post('/cms-Category-Q', CategoryController.paginationView)
routes.post('/cms-Category-C', CategoryController.insertCategoryPage)
routes.post('/cms-Category-U/:id', CategoryController.updateCategoryPage)
routes.post('/cms-Category-D/:id', CategoryController.deleteCategoryPage)
routes.post('/cms-Category-F', CategoryController.filterCategoryPage)

//___________________CategoryLevel2____________________

routes.get('/cms-CategoryLevel2-Q', CategoryLevel2Controller.loadShowPage)
routes.get('/cms-CategoryLevel2-C', CategoryLevel2Controller.loadInsertPage)
routes.get('/cms-CategoryLevel2-C/:id', CategoryLevel2Controller.loadUpdatePage)
routes.post('/cms-CategoryLevel2-Q', CategoryLevel2Controller.paginationView)
routes.post('/cms-CategoryLevel2-C', CategoryLevel2Controller.insertCategoryLevel2Page)
routes.post('/cms-CategoryLevel2-U/:id', CategoryLevel2Controller.updateCategoryLevel2Page)
routes.post('/cms-CategoryLevel2-D/:id', CategoryLevel2Controller.deleteCategoryLevel2Page)
routes.post('/cms-CategoryLevel2-F', CategoryLevel2Controller.filterCategoryLevel2Page)
routes.post('/cms-CategoryLevel2-X-HistoricalPerspective', CategoryLevel2Controller.historicalPerspectiveListener)

//___________________CategoryLevel3____________________

routes.get('/cms-CategoryLevel3-Q', CategoryLevel3Controller.loadShowPage)
routes.get('/cms-CategoryLevel3-C', CategoryLevel3Controller.loadInsertPage)
routes.get('/cms-CategoryLevel3-C/:id', CategoryLevel3Controller.loadUpdatePage)
routes.post('/cms-CategoryLevel3-Q', CategoryLevel3Controller.paginationView)
routes.post('/cms-CategoryLevel3-C', CategoryLevel3Controller.insertCategoryLevel3Page)
routes.post('/cms-CategoryLevel3-U/:id', CategoryLevel3Controller.updateCategoryLevel3Page)
routes.post('/cms-CategoryLevel3-D/:id', CategoryLevel3Controller.deleteCategoryLevel3Page)
routes.post('/cms-CategoryLevel3-F', CategoryLevel3Controller.filterCategoryLevel3Page)
routes.post('/cms-CategoryLevel3-X-HistoricalPerspective', CategoryLevel3Controller.historicalPerspectiveListener)
routes.post('/cms-CategoryLevel3-X-Level1', CategoryLevel3Controller.level1Listener)

//_______________________Section_______________________

routes.get('/cms-Section-Q', SectionController.loadShowPage)
routes.get('/cms-Section-C', SectionController.loadInsertPage)
routes.get('/cms-Section-C/:id', SectionController.loadUpdatePage)
routes.post('/cms-Section-Q', SectionController.paginationView)
routes.post('/cms-Section-C', SectionController.insertSectionPage)
routes.post('/cms-Section-U/:id', SectionController.updateSectionPage)
routes.post('/cms-Section-D/:id', SectionController.deleteSectionPage)
routes.post('/cms-Section-F', SectionController.filterSectionPage)
routes.post('/cms-Section-X-HistoricalPerspective', SectionController.historicalPerspectiveListener)
routes.post('/cms-Section-X-Level1', SectionController.level1Listener)
routes.post('/cms-Section-X-Level2', SectionController.level2Listener)



//SYSTEM

//_______________________User__________________________

routes.get('/cms-User-Q', UserController.loadShowPage)
routes.get('/cms-User-C', UserController.loadInsertPage)
routes.get('/cms-User-C/:id', UserController.loadUpdatePage)
routes.post('/cms-User-Q', UserController.paginationView)
routes.post('/cms-User-C', avatarUpload, UserController.insertUserPage)
routes.post('/cms-User-U/:id', avatarUpload, UserController.updateUserPage)
routes.post('/cms-User-D/:id', UserController.deleteUserPage)
routes.post('/cms-User-F', UserController.filterUserPage)

//____________________Permission_______________________

routes.get('/cms-Permission-Q', PermissionController.loadShowPage)
routes.get('/cms-Permission-C', PermissionController.loadInsertPage)
routes.get('/cms-Permission-C/:id', PermissionController.loadUpdatePage)
routes.post('/cms-Permission-Q', PermissionController.paginationView)
routes.post('/cms-Permission-C', PermissionController.insertPermissionPage)
routes.post('/cms-Permission-U/:id', PermissionController.updatePermissionPage)
routes.post('/cms-Permission-D/:id', PermissionController.deletePermissionPage)
routes.post('/cms-Permission-F', PermissionController.filterPermissionPage)

routes.get('/cms-Language-Q', (req,res) => res.render(views + "cms/cms-Language-Q"));
routes.get('/cms-Language-C', (req,res) => res.render(views + "cms/cms-Language-C"));

routes.get('/cms-BannerSlider-Q', BannerSliderController.loadShowPage)
routes.get('/cms-BannerSlider-C', BannerSliderController.loadInsertPage)
routes.get('/cms-BannerSlider-C/:id', BannerSliderController.loadUpdatePage)
routes.post('/cms-BannerSlider-Q', BannerSliderController.paginationView)
routes.post('/cms-BannerSlider-C', upload.single('bannerImage'), BannerSliderController.insertBannerSliderPage)
routes.post('/cms-BannerSlider-U/:id', upload.single('bannerImage'), BannerSliderController.updateBannerSliderPage)
routes.post('/cms-BannerSlider-D/:id', BannerSliderController.deleteBannerSliderPage)
routes.post('/cms-BannerSlider-F', BannerSliderController.filterBannerSliderPage)

routes.get('/cms-InstitutionalVideo-C', (req,res) => res.render(views + "cms/cms-InstitutionalVideo-C"));

module.exports = routes;


// OBJECT

const Period = [
    // PERÍDOS BÍBLICOS
    {
        id: "a",
        name: "A Família Escolhida de Deus",
        timelineId: 1,
        timelineName:"Períodos teológicos",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -2100,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1800,
        duration: 300,
        barColor: "#483D8B",
        backgroundcolor: "#ADD8E6",
        timelineVisualization: "timeline-continuous",
        periodVisualization: "period-continuous",
    },
    {
        id: "b",
        name: "Nascimento de Israel",
        timelineId: 1,
        timelineName:"Períodos teológicos",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1800,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1406,
        duration: 394,
        barColor: "#BDB76B",
        backgroundcolor: "#ADD8E6",
        timelineVisualization: "timeline-continuous",
        periodVisualization: "period-continuous",
    },
    {
        id: "c",
        name: "A posse da terra",
        timelineId: 1,
        timelineName:"Períodos teológicos",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1406,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1050,
        duration: 356,
        barColor: "#9370DB",
        backgroundcolor: "#ADD8E6",
        timelineVisualization: "timeline-continuous",
        periodVisualization: "period-continuous",
    },
    //LIVROS BÍBLICOS
    {
        id: "d",
        name: "Gênesis",
        timelineId: 2,
        timelineName:"Livros da Bíblia",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -2100,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1805,
        duration: 295,
        barColor: "#EEE8AA",
        backgroundcolor: "#D3D3D3",
        timelineVisualization: "timeline-expanded",
        periodVisualization: "period-expanded",
    },
    {
        id: "e",
        name: "Êxodo",
        timelineId: 2,
        timelineName:"Livros da Bíblia",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1500,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1445,
        duration: 55,
        barColor: "#EEE8AA",
        backgroundcolor: "#D3D3D3",
        timelineVisualization: "timeline-expanded",
        periodVisualization: "period-expanded",
    },
    {
        id: "f",
        name: "Levídico",
        timelineId: 2,
        timelineName:"Livros da Bíblia",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1445,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1444,
        duration: 1,
        barColor: "#EEE8AA",
        backgroundcolor: "#D3D3D3",
        timelineVisualization: "timeline-expanded",
        periodVisualization: "period-expanded",
    },
]
