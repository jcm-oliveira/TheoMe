express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

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
        backgroundcolor: "#483D8B",
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
        backgroundcolor: "#BDB76B",
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
        backgroundcolor: "#9370DB",
        timelineVisualization: "timeline-continuous",
        periodVisualization: "period-continuous",
    },
    //LIVROS BÍBLICOS
    {
        id: "d",
        name: "Gênesis",
        timelineId: 2,
        timelineName:"Bible Books",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1406,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1050,
        duration: 356,
        backgroundcolor: "#EEE8AA",
        timelineVisualization: "timeline-expanded",
        periodVisualization: "period-expanded",
    },
    {
        id: "e",
        name: "Êxodo",
        timelineId: 2,
        timelineName:"Bible Books",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1406,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1050,
        duration: 300,
        backgroundcolor: "#EEE8AA",
        timelineVisualization: "timeline-expanded",
        periodVisualization: "period-expanded",
    },
    {
        id: "f",
        name: "Levídico",
        timelineId: 2,
        timelineName:"Bible Books",
        startDateDay: 1,
        startDateMonth: 1,
        startDateYear: -1406,
        endDateDay: 1,
        endDateMonth: 1,
        endDateYear: -1050,
        duration: 400,
        backgroundcolor: "#EEE8AA",
        timelineVisualization: "timeline-expanded",
        periodVisualization: "period-expanded",
    },
]

// ROUTES

routes.get('/', (req,res) => res.render(views + "index"));

// TOOLS
routes.get('/Tools-MainPage', (req,res) => res.render(views + "tools/Tools-MainPage"));
routes.get('/SchemaOfContent', (req,res) => res.render(views + "tools/SchemaOfContent"));
routes.get('/SchemaOfContent-BookDashboard', (req,res) => res.render(views + "tools/SchemaOfContent-BookDashboard"));
routes.get('/SchemaOfContent-BookPage', (req,res) => res.render(views + "tools/SchemaOfContent-BookPage"));
routes.get('/SchemaOfContent-ChronologicalDashboard', (req,res) => res.render(views + "tools/SchemaOfContent-ChronologicalDashboard"));
routes.get('/SchemaOfContent-ChronologicalPage', (req,res) => res.render(views + "tools/SchemaOfContent-ChronologicalPage"));
routes.get('/ChronologicalEvents', (req,res) => res.render(views + "tools/ChronologicalEvents"));
routes.get('/Timeline', (req,res) => res.render(views + "tools/Timeline"));
routes.get('/Timeline-IframeBar.ejs', (req,res) => res.render(views + "tools/Timeline-IframeBar.ejs", { Period }));


// LIBRARY
routes.get('/Library-MainPage', (req,res) => res.render(views + "library/Library-MainPage"));

//CHRISTIANITY
routes.get('/Christianity-MainPage', (req,res) => res.render(views + "christianity/Christianity-MainPage"));

// COMMUNITY
routes.get('/Community-MainPage', (req,res) => res.render(views + "community/Community-MainPage"));

// ABOUT
routes.get('/WhoWeAre', (req,res) => res.render(views + "about/WhoWeAre"));
routes.get('/Collaboration', (req,res) => res.render(views + "about/Collaboration"));

// CMS - Content Management System - B4
routes.get('/cms-LoginPage', (req,res) => res.render(views + "cms/cms-LoginPage"));
routes.get('/cms-MainPage', (req,res) => res.render(views + "cms/cms-MainPage"));

// RESEARCH
routes.get('/cms-StudyItem-Q', (req,res) => res.render(views + "cms/cms-StudyItem-Q"));
routes.get('/cms-StudyItem-C', (req,res) => res.render(views + "cms/cms-StudyItem-C"));

// BIBLE
routes.get('/cms-BibleTranslation-Q', (req,res) => res.render(views + "cms/cms-BibleTranslation-Q"));
routes.get('/cms-BibleTranslation-C', (req,res) => res.render(views + "cms/cms-BibleTranslation-C"));

routes.get('/cms-Book-Q', (req,res) => res.render(views + "cms/cms-Book-Q"));
routes.get('/cms-Book-C', (req,res) => res.render(views + "cms/cms-Book-C"));

routes.get('/cms-Chapter-Q', (req,res) => res.render(views + "cms/cms-Chapter-Q"));
routes.get('/cms-Chapter-C', (req,res) => res.render(views + "cms/cms-Chapter-C"));

// REGISTER
routes.get('/cms-Category-Q', (req,res) => res.render(views + "cms/cms-Category-Q"));
routes.get('/cms-Category-C', (req,res) => res.render(views + "cms/cms-Category-C"));

routes.get('/cms-Timeline-Q', (req,res) => res.render(views + "cms/cms-Timeline-Q"));
routes.get('/cms-Timeline-C', (req,res) => res.render(views + "cms/cms-Timeline-C"));

routes.get('/cms-HistoricalPerspective-Q', (req,res) => res.render(views + "cms/cms-HistoricalPerspective-Q"));
routes.get('/cms-HistoricalPerspective-C', (req,res) => res.render(views + "cms/cms-HistoricalPerspective-C"));

routes.get('/cms-PeriodType-Q', (req,res) => res.render(views + "cms/cms-PeriodType-Q"));
routes.get('/cms-PeriodType-C', (req,res) => res.render(views + "cms/cms-PeriodType-C"));

routes.get('/cms-Period-Q', (req,res) => res.render(views + "cms/cms-Period-Q"));
routes.get('/cms-Period-C', (req,res) => res.render(views + "cms/cms-Period-C"));

routes.get('/cms-Continent-Q', (req,res) => res.render(views + "cms/cms-Continent-Q"));
routes.get('/cms-Continent-C', (req,res) => res.render(views + "cms/cms-Continent-C"));

routes.get('/cms-Country-Q', (req,res) => res.render(views + "cms/cms-Country-Q"));
routes.get('/cms-Country-C', (req,res) => res.render(views + "cms/cms-Country-C"));

routes.get('/cms-Region-Q', (req,res) => res.render(views + "cms/cms-Region-Q"));
routes.get('/cms-Region-C', (req,res) => res.render(views + "cms/cms-Region-C"));

routes.get('/cms-State-Q', (req,res) => res.render(views + "cms/cms-State-Q"));
routes.get('/cms-State-C', (req,res) => res.render(views + "cms/cms-State-C"));

routes.get('/cms-City-Q', (req,res) => res.render(views + "cms/cms-City-Q"));
routes.get('/cms-City-C', (req,res) => res.render(views + "cms/cms-City-C"));

routes.get('/cms-BibliographicReference-Q', (req,res) => res.render(views + "cms/cms-BibliographicReference-Q"));
routes.get('/cms-BibliographicReference-C', (req,res) => res.render(views + "cms/cms-BibliographicReference-C"));

routes.get('/cms-Publisher-Q', (req,res) => res.render(views + "cms/cms-Publisher-Q"));
routes.get('/cms-Publisher-C', (req,res) => res.render(views + "cms/cms-Publisher-C"));

//SYSTEM
routes.get('/cms-User-Q', (req,res) => res.render(views + "cms/cms-User-Q"));
routes.get('/cms-User-C', (req,res) => res.render(views + "cms/cms-User-C"));

routes.get('/cms-Language-Q', (req,res) => res.render(views + "cms/cms-Language-Q"));
routes.get('/cms-Language-C', (req,res) => res.render(views + "cms/cms-Language-C"));

routes.get('/cms-BannerSlider-Q', (req,res) => res.render(views + "cms/cms-BannerSlider-Q"));
routes.get('/cms-BannerSlider-C', (req,res) => res.render(views + "cms/cms-BannerSlider-C"));

routes.get('/cms-InstitutionalVideo-C', (req,res) => res.render(views + "cms/cms-InstitutionalVideo-C"));


module.exports = routes;