
module.exports = function RequestsHandler(db){
    this.logIn = function(req, res){
        req.session.userId = req.body.userId;
    };
};


