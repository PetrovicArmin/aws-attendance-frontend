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

        for (let predmet of data.predmeti) 
            predmetiUl.innerHTML += `<li class="nav-item"> \n <a class="nav-link" href="#">${predmet}</a> \n </li>`;
    });
};