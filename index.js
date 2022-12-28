import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
const public_folder = path.join(__dirname, "public");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
          console.error(error);
          res.json({'poruka': 'Neuspješna prijava'});
          return;
        }
      
        const nastavniciArray = JSON.parse(data);
        //TODO: provjeriti da li postoji nastavnik koji se prijavljuje
        //TODO: poslati u ovisnosti od toga poruku o prijavi
        //TODO: zapisati u sesiju (da ostane zapisan nastavnik) nastavnika - vidjeti kasnije kako!
        res.json(nastavniciArray);
      });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});