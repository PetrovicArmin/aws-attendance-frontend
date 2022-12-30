const div = document.getElementById('divSadrzaj');

const initialActions = () => {
    PoziviAjax.getPredmeti((err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        if (data.greska) {
            console.log(data.greska);
            return;
        }

        
        document.getElementById('username').innerHTML = `Dobrodošli, ${data.username}`;

        const predmetiUl = document.getElementById('predmeti');
        predmetiUl.innerHTML = "";

        for (let predmet of data.predmeti) 
            predmetiUl.innerHTML += `<li class="nav-item shadow" onclick="PoziviAjax.getPredmet('${predmet}', callbackPredmet)"> \n <a class="nav-link" href="#">${predmet}</a> \n </li>\n`;
    });
};

initialActions();

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

    TabelaPrisustvoClickable(div, data.prisustvo);
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
    
    TabelaPrisustvoClickable(div, data.prisustvo, data.sedmica);
}