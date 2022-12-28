import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';
import bcrypt from 'bcrypt';
import session from 'express-session';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
const public_folder = path.join(__dirname, "public");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'tajni-kljuc',
    resave: false,
    saveUninitialized: true
}));


app.get('/predmet', (req, res) => {
    res.sendFile("html/predmet.html", { root: public_folder });
});

app.get('/prisustvo', (req, res) => {
    res.sendFile("html/prisustvo.html", { root: public_folder });
});

app.get('/prijava', (req, res) => {
    res.sendFile("html/prijava.html", { root: public_folder });
});


app.post('/login', (req, res) => {
    fs.readFile('data/nastavnici.json', (error, data) => {
        if (error) {
          res.json({'poruka': 'Neuspješna prijava'});
          return;
        }
      
        let nastavniciArray = JSON.parse(data);

        nastavniciArray = nastavniciArray.filter(obj => obj.nastavnik.username == req.body.username);

        if (nastavniciArray.length != 1) {
            res.json({'poruka': 'Neuspješna prijava'});
            return;
        }

        const zeljeni_objekat = nastavniciArray[0];

        bcrypt.compare(req.body.password, zeljeni_objekat.nastavnik.password_hash, (err, ista) => {
            
            if (err || !ista) {
                res.json({'poruka': 'Neuspješna prijava'});
                return;
            }
            
            req.session.username = req.body.username;
            req.session.listaPredmeta = zeljeni_objekat.predmeti;
            
            res.json({'poruka': 'Uspješna prijava'});
        });
      });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});