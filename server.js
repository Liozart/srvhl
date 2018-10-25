const express    = require("express");
const mysql      = require('mysql');
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

/* getSales
 * Returns all sales
 */
app.get("/getSales",function(req,res){
connection.query('SELECT * from t_sales', function(err, rows, fields) {
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

/* getSalesFromShop
 * Returns sales from specific shop
 */
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

/* getCityEvents
 * Returns events from rss flux
 */
app.get("/getCityEvents",function(req,res){
    parser.parseURL(url_getCityEvents, function(err, feed) {
        if (!err) {
            res.json(feed);
            console.log("getCityEvents query success");
        }
        else {
            res.json("erreur : query failed");
            console.log("getCityEvents query failed");
        }
    });
});

/* getShops
 * Returns subscribed shops
 */
app.get("/getShops",function(req,res){
    connection.query('SELECT * from t_shops', function(err, rows, fields) {
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

/* getSalesFromShop
 * Returns subscribed shops
 */
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

/* createUser
 * create a new user in t_users and new profile in t_profile
 */
app.post("/createUser", function(req, res){
    var querytest = 'SELECT email FROM t_users WHERE email = "' + req.headers.email + '"';
    var queryuser = 'INSERT INTO t_users (email, password) VALUES ("' + req.headers.email + '","' + req.headers.password + '")';
    var queryforid = 'SELECT * FROM t_users WHERE email = "' + req.headers.email + '"';
    //Query to test existing user
    connection.query(querytest, function(err1, rows1, fields1) {
        if (!err1) {
            if (rows1.length >= 1) {
                return res.json("Le compte existe");
            } else {
                //Insert new user in t_users
                connection.query(queryuser, function (err2, rows2, fields2) {
                    if (!err2) {
                        //get new user id
                        connection.query(queryforid, function (err3, rows3, fields3) {
                            if (!err3) {
                                console.log(rows3[0].id);
                                var queryprofile = 'INSERT INTO t_profiles (id_user) VALUES ("' + rows3[0].id + '")';
                                //Insert new profile in t_profiles
                                connection.query(queryprofile, function (err4, rows4, fields4) {
                                    if (!err4) {
                                        res.json('1');
                                        console.log("createUser query success");
                                    } else {
                                        res.json("erreur : Création du compte échouée");
                                        console.log("createUser query failed at err4");
                                    }
                                });
                            } else {
                                res.json("erreur : Création du compte échouée");
                                console.log("createUser query failed at err3");
                            }
                        });
                    }
                    else {
                        res.json("erreur : Création du compte échouée");
                        console.log("createUser query failed at err2");
                    }
                });
            }
        } else {
            res.json("erreur : Création du compte échouée");
            console.log("createUser query failed at err1");
        }
    });
});

/* connectUser
 * Returns connect token if user infos are corrects
 */
app.post("/connectUser", function(req, res){
    var query = 'SELECT * FROM t_users WHERE email = "' + req.headers.email + '" AND password = "' + req.headers.password +'"';
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            if (rows.length === 1) {
                var t = genToken(rows[0].email);
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

/* logOutUser
 * Terminate a user session
 */
app.post("/logOutUser", function(req, res){
    for (t in tokens){
        if (t.token == req.headers.token) {
            tokens.remove(tokens.indexOf(t));
        }
    }
});

/* genToken
 * generate a random 24 chars string
 */
function genToken(email) {
    var t = "", gud = false;
    var range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (var i = 0; i < 24; i++)
            t += range.charAt(Math.floor(Math.random() * range.length));
        if (!tokens.includes(t)) {
            tokens.push({email: email, token: t});
            gud = true;
        }
    } while (!gud);

    console.log(tokens);
    return t;
}

app.listen(3000);
console.log("Listening on port 3000");