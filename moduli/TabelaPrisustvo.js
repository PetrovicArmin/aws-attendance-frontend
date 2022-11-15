const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
const upisanoZaglavljeSedmice = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

let TabelaPrisustvo = function (divRef, podaci) {
    //formula za pristup zadnjoj koloni: |rb_kolone + 2 + br_predavanja + br_vjezbi - 1|
    //formula za pristup trenutnoj koloni: |rb_kolone + 2|

    divRef.innerHTML = "";

    //treba validirati podatke ovdje!

    let trenutniStudent = 0;
    const ukupnoStudenata = podaci.studenti.length;
    const trenutnaSedmica = podaci.prisustva[podaci.prisustva.length - 1].sedmica;

    const tabela = document.createElement('table');
    let redovi = [];

    //zaglavlje
    redovi.push(`<th>Ime i <br> prezime </th> \n <th> Index </th> \n`);

    //dvije kolone za ime i indeks studenata:
    podaci.studenti.forEach((student) => {
        redovi.push(`<td rowspan="2"> ${student.ime} </td> \n <td rowspan="2"> ${student.index} </td>`);
    });


    podaci.prisustva.forEach((prisustvo, i) => {
        if (!upisanoZaglavljeSedmice[prisustvo.sedmica]) {
            upisanoZaglavljeSedmice[prisustvo.sedmica] = true;
            redovi[0] += `<th> ${sedmiceTekstualno[prisustvo.sedmica]} </th> \n`
        }

        if (prisustvo.sedmica == trenutnaSedmica) {
            //radi nešto sa trenutnom sedmicom,
            //što je drugačije nego sa običnim sedmicama
            return;
        }        
        
        const postotak = ((prisustvo.predavanja + prisustvo.vjezbe)/(podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno) * 100) + "%";
        redovi[(i%ukupnoStudenata) + 1] += `<td rowspan="2"> ${postotak} </td> \n`;
    });


    redovi.forEach(htmlSadrzaj => {
        tabela.innerHTML += `<tr> ${htmlSadrzaj} </tr>`;                
    });

    //ovdje još treba dodati mnoštvo <col> tagova!
    divRef.appendChild(tabela);

    //implementacija metoda
    let sljedecaSedmica = function () {

    }

    let prethodnaSedmica = function () {

    }

    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
};
