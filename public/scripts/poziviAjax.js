const PoziviAjax = (()=>{
    //fnCallback u svim metodama se poziva kada stigne odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data, error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška poruka se prosljeđuje u error parametar callback-a, a data je tada null
    function impl_getPredmet(naziv,fnCallback){
        fetch(`http://localhost:3000/predmet/${naziv}`, { method: "GET", headers: { "Content-Type": "application/json" } })
        .then(res => res.json())
        .then(value => fnCallback(null, value))
        .catch(err => fnCallback(err.message, null));
    }

    // vraća listu predmeta za loginovanog nastavnika ili grešku da nastavnik nije loginovan
    function impl_getPredmeti(fnCallback){
        fetch("http://localhost:3000/predmeti", { method: "GET", headers: { "Content-Type": "application/json" } })
        .then(res => res.json())
        .then(value => fnCallback(null, value))
        .catch(err => fnCallback(err.message, null));
    }


    function impl_postLogin(username,password,fnCallback){
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => res.json())
          .then(value => fnCallback(null, value))
          .catch(err => fnCallback(err.message, null));
    }
    function impl_postLogout(fnCallback){
        fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            } 
        }).then(res => res.json()).then(value => fnCallback(null, value)).catch(err => fnCallback(err.message, null));        
    }
    //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
    function impl_postPrisustvo(naziv,index,prisustvo,fnCallback){
        console.log("podaci koje sam dobio:");
        console.log("ime predmeta: '" + naziv + "'");
        console.log("Indeks studenta: " + index);
        console.log("(predavanja, vjezbi, sedmica) = (" + prisustvo.predavanja + ", " + prisustvo.vjezbe + ", " + prisustvo.sedmica + ")!");

        fetch(`http://localhost:3000/prisustvo/predmet/${naziv}/student/${index}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prisustvo)
        }).then(res => res.json()).then(value => fnCallback(null, value)).catch(err => fnCallback(err.message, null));
    }

    return{
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getPredmet: impl_getPredmet,
        getPredmeti: impl_getPredmeti,
        postPrisustvo: impl_postPrisustvo
    };
})();
