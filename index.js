import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';
import DatabaseHandler from './public/scripts/databaseHandler.js';

const app = express();

/////
/////parametar govori da li želite da generišete neke dummy podatke.
//ukoliko ostavite false, neće se generisati nikakvi podaci.
//ako postavite na true, generišu se testni podaci za bazu podataka.
await DatabaseHandler.syncDatabase(false);
////

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


app.get('/predmet.html', (req, res) => {
    res.sendFile("html/predmet.html", { root: public_folder });
});

app.get('/prisustvo.html', (req, res) => {
    res.sendFile("html/prisustvo.html", { root: public_folder });
});

app.get('/prijava.html', (req, res) => {
    if (req.session.username) {
        res.redirect('predmeti.html');
        return;
    }
    res.sendFile("html/prijava.html", { root: public_folder });
});

app.get('/predmeti.html', (req, res) => {
    if (!req.session.username) {
        res.redirect('prijava.html');
        return;
    }
    res.sendFile("html/predmeti.html", { root: public_folder });
});

app.get('/predmeti', (req, res) => {
    if (!req.session.username) {
        res.json({ greska: 'Nastavnik nije loginovan' });
        return;
    }

    res.json({
        username: req.session.username,
        predmeti: req.session.listaPredmeta
    });
});

app.get('/predmet/:naziv', async (req, res) => {
    const objekat_prisustvo = await DatabaseHandler.kreirajPrisustvoPredmeta(req.params.naziv);

    if (!objekat_prisustvo) {
        res.json({'poruka': 'Ne postoji promatrani predmet!'});
        return;
    }

    res.json({ 'prisustvo' : objekat_prisustvo });
});


app.post('/prisustvo/predmet/:naziv/student/:index', async (req, res) => {
    const objekat_prisustvo = await DatabaseHandler.kreirajPrisustvoPredmeta(req.params.naziv);
    
    if (!objekat_prisustvo) {
        res.json({'poruka': 'Ne postoji promatrani predmet!'});
        return;
    }
    
    let zapis = objekat_prisustvo.prisustva.find(element => element.sedmica == Number(req.body.sedmica) && element.index == Number(req.params.index));

    if (!zapis) {
        zapis = {
            sedmica: Number(req.body.sedmica),
            predavanja: 0,
            vjezbe: 0,
            index: Number(req.params.index) 
        };
        objekat_prisustvo.prisustva.push(zapis);
    }

    zapis.predavanja = Number(req.body.predavanja);
    zapis.vjezbe = Number(req.body.vjezbe);

    await DatabaseHandler.azurirajISpremiPrisustvo(req.params.naziv, zapis);

    res.json({'prisustvo': objekat_prisustvo, 'sedmica': req.body.sedmica});
});

app.post('/login', async (req, res) => {
    let nastavnik = await DatabaseHandler.pronadjiNastavnika(req.body.username);

    if (!nastavnik) {
        res.json({'poruka': 'Neuspješna prijava'});
        return;
    }

    bcrypt.compare(req.body.password, nastavnik.password_hash, (err, ista) => {
        
        if (err || !ista) {
            res.json({'poruka': 'Neuspješna prijava'});
            return;
        }
        
        req.session.username = req.body.username;
        req.session.listaPredmeta = nastavnik.predmeti;
        
        res.json({'poruka': 'Uspješna prijava'});
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.sendStatus(404).json({'poruka': 'greška prilikom brisanja sesije!'});
            return;
        }
        res.json({'poruka': 'uspješno obrisana sesija!'});
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});