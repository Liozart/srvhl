const express    = require("express");
const mysql      = require('mysql');
const request = require('request');
const Parser = require('rss-parser');
const parser = new Parser();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hilive'
});

var app = express();

var tokens = [];

const url_getCityEvents = 'https://ladecadanse.darksite.ch/rss.php?type=evenements_auj';
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

/* Accepting CORS for all requests */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, email, password, shopid, token");
    next();
});
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

/* Initial connection to DB */
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});
/* Routes */
/**
 * getSales
 * Return the available sales
 */
app.get("/getSales",function(req,res){
connection.query('SELECT * from t_sales LIMIT 100', function(err, rows, fields) {
    if (!err) {
        res.json(rows);
        console.log("getSales query success");
    }
    else {
        res.json("erreur : query failed");
        console.log("getSales query failed");
    }
  });
});

app.get("/getCityEvents",function(req,res){
    parser.parseURL(url_getCityEvents, function(err, feed) {
        if (!err) {
            res.json(feed);
        }
        else {
            res.json("erreur : query failed");
            console.log("getCityEvents query failed");
        }
    });
});

app.post("/getSalesFromShop",function(req,res){
    connection.query('SELECT * from t_sales WHERE id_shop = ' + req.headers.shopid + " LIMIT 100", function(err, rows, fields) {
        if (!err) {
            res.json(rows);
            console.log("getSalesFromShop query success");
        }
        else {
            res.json("erreur : query failed");
            console.log("getSalesFromShop query failed");
        }
    });
});

app.get("/getShops",function(req,res){
    connection.query('SELECT * from t_shops LIMIT 100', function(err, rows, fields) {
        if (!err) {
            res.json(rows);
            console.log("getShops query success");
        }
        else {
            res.json("erreur : query failed");
            console.log("getShops query failed");
        }
    });
});

app.post("/createUser", function(req, res){
    var querytest = 'SELECT email FROM t_users WHERE email = "' + req.headers.email + '"';
    var query = 'INSERT INTO t_users (email, password) VALUES ("' + req.headers.email + '","' + req.headers.password+ '")';
    console.log(querytest + "\n" + query);
    connection.query(querytest, function(err, rows, fields) {
        if (!err) {
            if (rows.length) {
                return res.json("Le compte existe");
            } else {
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        res.json('ok');
                        console.log("createUser query success");
                    }
                    else {
                        res.json("erreur : Création du compte échouée");
                        console.log("createUser query failed");
                    }
                });
            }
        }else {
            res.json("erreur : Création du compte échouée");
            console.log("createUser query failed");
        }
    });
});

app.post("/connectUser", function(req, res){
    var query = 'SELECT * FROM t_users WHERE email = "' + req.headers.email + '" AND password = "' + req.headers.password +'"';
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            if (rows.length === 1) {
                var t = genToken();
                res.json(t);
                console.log("connectUser query success");
            }
            else {
                res.json("erreur : Connexion échouée");
                console.log("connectUser query failed");
            }
        }
        else {
            res.json("erreur : Connexion échouée");
            console.log("connectUser query failed");
        }
    });
});

function genToken() {
    var t = "", gud = false;
    var range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (var i = 0; i < 24; i++)
            t += range.charAt(Math.floor(Math.random() * range.length));
        if (!tokens.includes(t)) {
            tokens.push(t);
            gud = true;
        }
    } while (!gud);

    console.log(tokens);
    return t;
}

app.listen(3000);
console.log("Listening on port 3000");