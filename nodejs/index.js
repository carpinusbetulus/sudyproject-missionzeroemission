
const express = require('express');
const app = express();
const MariaDB = require('MariaDB');
const bodyParser = require('body-parser');
//body Parser is a middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = MariaDB.createConnection({
  host: "141.45.92.87",
  user: "phpmyadmin",
  password : "Q2Jf6kY4aQuM",
  database : "NemoDB"
});
//connection.getConnection();

app.post("/profil.html" , function (req , res) {
  console.log(req.body);
  var sql = "INSERT INTO Profil_TB(profil_name, profil_vorname, profil_firma, profil_position, profil_fax, profil_tel, profil_email, profil_benutzername, profil_passwort) VALUES (null , " + req.body.NachnameInput + "' , '"+req.body.VornameInput+"' , '"+req.body.FirmennameInput+"', '"+req.body.PositionInput+"' ,'"+req.body.FaxInput+"' , '"+req.body.TelefonInput+"' , '"+req.body.EmailInput+"' , '"+ req.body.BenutzernameInput +"' , '"+req.body.PasswortInput+"')";
  connection.query(sql , function (err) {
    if (err) throw err;
    res.send("Data Is added to the database...")
  })
});
app.listen("3306");

// comment being the name of the database

