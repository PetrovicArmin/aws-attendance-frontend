const fnCallback = (err, data) => {
    if (err) {
        console.log(err)
        return;
    }

    if (data.poruka == 'Uspješna prijava') {
        window.location.replace("http://localhost:3000/predmeti");
        return;
    } 

    console.log("Prijava nije bila uspješna (postoje greške)!");
}
