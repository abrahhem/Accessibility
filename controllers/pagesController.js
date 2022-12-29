
exports.pagesController = {

    getIndex(req, res) {
        res.render("index");
    },

    getHome(req, res) {
        if(!req.session.hasOwnProperty("userInfo"))
            res.render("index");
        else
            res.render("home");
    },

    getMap(req, res) {
        if(!req.session.hasOwnProperty("userInfo"))
            res.render("index");
        else
            res.render("map");
    },
    getError(req, res) {
        res.render("404");
    }
}