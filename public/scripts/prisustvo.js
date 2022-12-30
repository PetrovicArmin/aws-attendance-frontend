let div = document.getElementById("divSadrzaj");
const prisustvo = JSON.parse(localStorage.getItem('prisustvo'));
TabelaPrisustvoClickable(div, prisustvo);

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