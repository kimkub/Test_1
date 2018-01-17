exports.render = function(req, res) {
    res.render('index', {
        title: 'Hello World',
        username: req.user ? req.user.username : ''
    });
};