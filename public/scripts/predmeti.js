window.onload = () => {
    PoziviAjax.getPredmeti((err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        if (data.greska) {
            console.log(data.greska);
            return;
        }

        
        document.getElementById('username').innerHTML = `Greetings, ${data.username}`;

        const predmetiUl = document.getElementById('predmeti');
        predmetiUl.innerHTML = "";

        //TODO: dodati onclick mogućnost radi promjene tabele koja dolazi u naš prozor!
        //nakon toga, na click dodati još jednu funkciju koja će iscrtavati tabelu unutar našeg prozora!
        for (let predmet of data.predmeti) 
            predmetiUl.innerHTML += `<li class="nav-item" onclick="PoziviAjax.getPredmet('${predmet}', callbackPredmet)"> \n <a class="nav-link" href="#">${predmet}</a> \n </li>`;
    });
};

const callbackLogout = (err, data) => {
    if(err) { 
        console.log(err); 
        return;
    } 
    window.location.replace('http://localhost:3000/prijava.html');
}

const callbackPredmet = (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    if (data.poruka) {
        console.log(data.poruka)
        return;
    }
    TabelaPrisustvoClickable(document.getElementById('divSadrzaj'), data.prisustvo);
}

const prisustvaCallback = (err, data) => {
    if (err) {
        console.log(err);
        return;
    }   

    if (data.poruka) {
        console.log(data.poruka);
        return;
    }
    TabelaPrisustvoClickable(document.getElementById('divSadrzaj'), data.prisustvo, data.sedmica);
}