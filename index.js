let express = require('express');
let needle = require("needle");
let cheerio = require('cheerio');

let app = express();
let bodyParser = require('body-parser');
const { request } = require('needle');
let urlencodeParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('forms');
});

app.post('/news', urlencodeParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    var arrayCss = [];
    var arrayJs = [];
    var tt = res;
    var url = req.body.site;

    needle.get(url, tt, function(err, res){
        if(err) throw(err);
        let $ = cheerio.load(res.body);

        links = $('link');
        (links).each(function(i, link){
            arrayCss.push($(link).attr('href'))
        });

        links = $('script');
        (links).each(function(i, link){
            arrayJs.push($(link).attr('src'))
        });
        tt.render('news', {resultCss: arrayCss, resultJs: arrayJs});
    });
});

app.listen(8080);