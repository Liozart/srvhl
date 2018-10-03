var express    = require("express");
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hilive'
});
var app = express();

var tokens = [];

/* Accepting CORS for all requests */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, email, password, token");
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
        res.json("query failed");
        console.log("getSales query failed");
    }
  });
});

app.post("/createUser", function(req, res){
    var querytest = 'SELECT email FROM t_users WHERE email = "' + req.headers.email + '"';
    var query = 'INSERT INTO t_users (email, password) VALUES ("' + req.headers.email + '","' + req.headers.password+ '")';
    var isNew = false;
    connection.query(querytest, function(err, rows, fields) {
        if (!err) {
            if (rows.length) {
                return res.json("Le compte existe");
            } else {
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        var t = genToken();
                        res.header('token', t);
                        res.send("Création du compte réussie");
                        console.log("createUser query success");
                    }
                    else {
                        res.json("Création du compte échouée");
                        console.log("createUser query failed");
                    }
                });
            }
        }else {
            res.json("Erreur ; Création du compte échouée");
            console.log("createUser query failed");
        }
    });
});

app.post("/connectUser", function(req, res){
    var query = 'SELECT * FROM t_users WHERE email = "' + req.headers.email + '" AND password = "' + req.headers.password +'"';
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            if (rows.length === 1) {
                res.json("Connexion réussie");
                console.log("connectUser query success");
            }
            else {
                res.json("Connexion échouée");
                console.log("connectUser query failed");
            }
        }
        else {
            res.json("Erreur ; Connexion échouée");
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
        if (!tokens.contains(t)) {
            tokens.add(t);
            gud = true;
        }
    } while (!gud);

    return t;
}

app.listen(3000);
console.log("Listening on port 3000");