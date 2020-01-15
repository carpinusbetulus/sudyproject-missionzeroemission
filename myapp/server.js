//these are the dependence
const express = require('express');
const app = express();
const session = require("express-session")
const mariadb = require('mariadb/callback');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const path = require('path')

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//shows what is happening on the server and post it on the terminal(Logger)
app.use(morgan('short'))

app.set('views', path.join(__dirname, 'public')); //changed from 'views' to 'public'
app.set('view engine', 'ejs'); //changed from 'jade' to 'ejs'

//body Parser is a middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

//Connection to Database
function getConnection() {
  return mariadb.createConnection({
    host: "141.45.92.87",
    user: "phpmyadmin",
    password: "Q2Jf6kY4aQuM",
    database: "DoriDB"
  });
}

getConnection().connect((err) => {
  if (err) {
    console.log("Failed" + err);
  }
  else
    console.log("Database connected");
});

app.listen(3003, () => {
  console.log("server is up and listening on port 3003...")
});


//Routing
//It is a messy solution, but it works for now, until a new link is added, then it has to be implented here as well.
//index
app.get('/', function (req, res) {
  res.render('index', { page: 'Startseite', menuId: 'index' })
});
app.get('/index', function (req, res) {
  // ## Gesamtansicht ##
  // Jahr
  var sqlquery = "SELECT DISTINCT umsatz_jahr FROM umsatz_tb";
  var years = [];
  getConnection().query(sqlquery, function (err, result) {
    if (err) {
      console.log("Failed to get year data..." + err);
      res.sendStatus(500);
      return res.status(204).send();
    } else {
      //     // while (result.isValid) {
      //     //   years.push(result.umsatz_jahr);
      //     //   result.next();
      //     // }
      //     // var rows = JSON.parse(JSON.stringify(result[0]));

      //     // // here you can access rows
      //     // console.log(rows);
          Object.keys(result).forEach(function (key) {
            var row = result[key];
            years.push(row.name)
          });
      // for (var i in result) {
      //   years.push(result[i].umsatz_jahr)
      // }
      //     // for (let i = 0; i < result.length; i++) {
      //     //   years.push(result[i].umsatz_jahr);
      //     // }
      return years;
    }
  });
  // Umsatz
  // var revenue = new Array();
  // for (let i = 0; i < years.length; i++) {
  //   sqlquery = "SELECT SUM(umsatz_umsatz) FROM umsatz_tb WHERE umsatz_jahr = ?";
  //   getConnection().query(sqlquery,[years[i]], function(err, result) {
  //   if (err) {
  //     console.log("Failed to get year data..." + err);
  //     res.sendStatus(500);
  //     return res.status(204).send();
  //   } else {
  //     revenue.push(result[i]);
  //   }
  //   return revenue;
  // });
  // }
  return res.render('index', { page: 'Startseite', menuId: 'index', jahre: years }); //, umsatz: revenue
  // var name = 'Amy';
  // var adr = 'Mountain 21';
  // var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
  // con.query(sql, [name, adr], function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });
  // ## Firmenansicht ##
  // var sqlquery = "SELECT DISTINCT umsatz_jahr FROM umsatz_tb WHERE"; //FIRMA einfügen
});
//Maßnahmenkatalog
app.get('/massnahmen-katalog', function (req, res) {
  var queryString = "SELECT res_kategorie_tb.res_kategorie_id, res_kategorie_tb.res_kategorie_name, massnahmen_tb.massnahmen_name, massnahmen_tb.massnahmen_beschreibung FROM massnahmen_tb INNER JOIN res_kategorie_tb ON massnahmen_tb.massnahmen_res_kategorie = res_kategorie_tb.res_kategorie_id ORDER BY res_kategorie_tb.res_kategorie_id";

  getConnection().query(queryString, function (err, result) {
    if (err) {
      console.log("Failed to get massnahmen_tb data..." + err);
      res.sendStatus(500);
      return res.status(204).send();
    } else {
      return res.render('massnahmen-katalog', { page: 'Maßnahmenkatalog', menuId: 'massnahmen-katalog', massnahmen: result });
    }
  });
});
//Maßnahmenübersicht --> Für die Firma
app.get('/massnahmen-uebersicht', function (req, res) {
  var queryString = "SELECT res_kategorie_tb.res_kategorie_name, massnahmen_tb.massnahmen_id, massnahmen_tb.massnahmen_name, massnahmen_tb.massnahmen_beschreibung, firma_tb.firma_name, mn_firma_massnahmen_tb.mn_firma_massnahmen_anfangsdatum FROM mn_firma_massnahmen_tb INNER JOIN firma_tb ON mn_firma_massnahmen_tb.mn_firma_massnahmen_firma = firma_tb.firma_id INNER JOIN massnahmen_tb ON mn_firma_massnahmen_tb.mn_firma_massnahmen_massnahme = massnahmen_tb.massnahmen_id INNER JOIN res_kategorie_tb ON massnahmen_tb.massnahmen_res_kategorie= res_kategorie_tb.res_kategorie_id ORDER BY firma_tb.firma_name ";

  getConnection().query(queryString, function (err, result) {
    if (err) {
      console.log("Failed to get massnahmen_tb data..." + err);
      res.sendStatus(500);
      return res.status(204).send();
    } else {
      return res.render('massnahmen-uebersicht', { page: 'Maßnahmen Übersicht', menuId: 'massnahmen-uebersicht', massnahmen: result });
    }

  });
});
//Eingabenauswahl
app.get('/eingabeauswahl', function (req, res) {
  res.render('eingabeauswahl', { page: 'Eingabeauswahl', menuId: 'eingabeauswahl' });
});
//profil
app.get("/profil", function (req, res, next) {
  res.render('profil', { page: 'Profil', menuId: 'profil' });
});
//Login
app.get('/login', function (req, res) {
  res.render('login', { page: 'Login', menuId: 'login' });
});

app.post("/login" , function(req , res){
  var username = req.body.BenutzernameInput;
  var passowrd = req.body.PasswortInput;
  loginQuery= "SELECT firma_benutzername, firma_passwort FROM firma_tb WHERE firma_benutzername = ? AND firma_passwort = ?";

  if ( username && passowrd){
    getConnection().query(loginQuery, [username , password] , function(err , result){
      if(result.length > 0){
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/index')
      }
      else {
        res.send("Incorrect username and/or password")
      }
      res.end();
    });
  }
  else{
    res.send("Please enter your Username and Password");
    res.end();

  }
});


//Passwort-Vergessen
app.get('/passwort-vergessen', function (req, res) {
  res.render('passwort-vergessen', { page: 'Passwort vergessen', menuId: 'passwort-vergessen' });
});
//RESSOURCEN
//Strom
app.get('/ressourcen/strom', function (req, res) {
  res.render('./ressourcen/strom', { page: 'Strom', menuId: 'strom' });
});
//Heizung
app.get('/ressourcen/heizung', function (req, res) {
  res.render('./ressourcen/heizung', { page: 'Heizung', menuId: 'heizung' });
});
//Erdgas
app.get('/ressourcen/erdgas', function (req, res) {
  res.render('./ressourcen/erdgas', { page: 'Gas', menuId: 'erdgas' });
});
//Wasser
app.get('/ressourcen/wasser', function (req, res) {
  res.render('./ressourcen/wasser', { page: 'Wasser', menuId: 'wasser' });
});
//Abfall
app.get('/ressourcen/abfall', function (req, res) {
  res.render('./ressourcen/abfall', { page: 'Abfall', menuId: 'abfall' });
});
//Neue-Massnahme
app.get('/ressourcen/neue-massnahme', function (req, res) {
  res.render('./ressourcen/neue-massnahme', { page: 'Neue Maßnahme', menuId: 'neue-massnahme' });
});
//Umsatz
app.get('/ressourcen/umsatz', function (req, res) {
  res.render('./ressourcen/umsatz', { page: 'Umsatz', menuId: 'umsatz' });
});
//CO2Schaetzung
app.get('/ressourcen/co2schaetzung', function (req, res) {
  res.render('./ressourcen/co2schaetzung', { page: 'CO2 Schätzung', menuId: 'co2schaetzung' });
});
// Input Data from Profil to DB
app.post('/', function (req, res) {
  console.log("Trying to log in..")
  console.log("First name: " + req.body.VornameInput);
  const Vorname = req.body.VornameInput;
  const Nachname = req.body.NachnameInput;
  const Firma = req.body.FirmennameInput;
  const Email = req.body.emailInput;
  const Telephone = req.body.TelefonInput;


  var queryString = "INSERT INTO nutzer_tb VALUE (NULL,?,?,?,?,?,CURRENT_TIMESTAMP)";
  getConnection().query(queryString, [Vorname, Nachname, Firma, Email, Telephone], function (err, result) {
    if (err) {
      console.log("Failed to update user data..." + err);
      res.sendStatus(500);
      return res.status(204).send();
    }
  });

   console.log("Inserted new user");

  res.end()
});

app.post('/umsatz', function (req, res) {
  console.log("Entering sales data..")
  const JahresUmsatz = req.body.UmsatzInput;
  const Datum = req.body.DatumUmsatzInput;

  var umsatzQuery = "INSERT INTO umsatz_tb VALUE (NULL,?,?,NULL)";
  getConnection().query(umsatzQuery, [JahresUmsatz, Datum], function (err, result) {
    if (err) {
      console.log("Failed to Insert into the database..." + err);
      res.sendStatus(500);
      return
    }
  });

  console.log("Inserted new umsatz Data");
  res.end()
})

app.post('/strom' , function(req , res){
  console.log('Entering Strom Data..')
  const StromArt = req.body.StromArtInput;
  var Firma = "Märkische Kiste"
  const Ablesung = req.body.AblesungInput;
  const StromVerbrauch = req.body.StromverbrauchInput;
  const AbrechnungZeitraum = req.body.ZeitraumMonat;
  
  var stromQuery = "INSERT INTO res_strom_regulaer_tb VALUE (NULL,?,?,?,Strom,?,?)";
  getConnection().query(stromQuery,[Firma,StromArt,Ablesung,AbrechnungZeitraum,StromVerbrauch], function(err , result){if (err){
    console.log("Faild to Insert into database..."+ err); 
    res.sendStatus(500);
    return
  }});

  console.log("Inserted new Strom Data!");
  res.end()
});


