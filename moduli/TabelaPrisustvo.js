const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
const upisanoZaglavljeSedmice = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
const prisustvaStudenataTrenutneSedmice = [];

let TabelaPrisustvo = function (divRef, podaci) {
    //formula za pristup zadnjoj koloni: |rb_kolone + 2 + br_predavanja + br_vjezbi - 1|
    //formula za pristup trenutnoj koloni: |rb_kolone + 2|

    divRef.innerHTML = "";

    //treba validirati podatke ovdje!
    const ukupnoStudenata = podaci.studenti.length;
    const trenutnaSedmica = podaci.prisustva[podaci.prisustva.length - 1].sedmica - 3;
    let posljednjaRazmatranaSedmica = 0;

    const tabela = document.createElement('table');
    let redovi = [];
    let html = "";

    //zaglavlje
    redovi.push(`<th>Ime i <br> prezime </th> \n <th> Index </th> \n`);

    //dvije kolone za ime i indeks studenata:
    podaci.studenti.forEach((student) => {
        redovi.push(`<td rowspan="2"> ${student.ime} </td> \n <td rowspan="2"> ${student.index} </td>`);
    });


    podaci.prisustva.forEach((prisustvo, i) => {
        if (!upisanoZaglavljeSedmice[prisustvo.sedmica]) {
            let dodatak = "";
            if (prisustvo.sedmica == trenutnaSedmica)
                dodatak = `colspan=${podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno}`;
            upisanoZaglavljeSedmice[prisustvo.sedmica] = true;            
            redovi[0] += `<th ${dodatak} > ${sedmiceTekstualno[prisustvo.sedmica]} </th> \n`
            posljednjaRazmatranaSedmica = prisustvo.sedmica;
        }

        const trenutniRed = (i%ukupnoStudenata) + 1;

        if (prisustvo.sedmica == trenutnaSedmica) {
            for (let k = 1; k <= podaci.brojPredavanjaSedmicno; k++)
                redovi[trenutniRed] += `<td class="center">P <br> ${k} </td> \n`;
            for (let k = 1; k <= podaci.brojVjezbiSedmicno; k++)
                redovi[trenutniRed] += `<td class="center">V <br> ${k} </td> \n`;
            
            prisustvaStudenataTrenutneSedmice[trenutniRed] = prisustvo;
        } else {
            const postotak = ((prisustvo.predavanja + prisustvo.vjezbe)/(podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno) * 100) + "%";
            redovi[trenutniRed] += `<td rowspan="2"> ${postotak} </td> \n`;
        }
    });

    
    redovi.forEach((htmlSadrzaj, index) => {
        if (index == 0) {
            html += `<tr> ${htmlSadrzaj} </tr>`;                
            return;
        }

        htmlSadrzaj += `</tr> <tr> \n`;
        let prisustvo = prisustvaStudenataTrenutneSedmice[index];

        for (let k = 1; k <= prisustvo.predavanja; k++)
            htmlSadrzaj += `<td class="zelena"> <br> </td> \n`;
        for (let k = prisustvo.predavanja + 1; k <= podaci.brojPredavanjaSedmicno; k++)
            htmlSadrzaj += `<td class="crvena"> <br> </td> \n`;
        for (let k = 1; k <= prisustvo.vjezbe; k++)
            htmlSadrzaj += `<td class="zelena"> <br> </td> \n`;
        for (let k = prisustvo.vjezbe + 1; k <= podaci.brojVjezbiSedmicno; k++)
            htmlSadrzaj += `<td class="crvena"> <br> </td> \n`;            
        html += `<tr> ${htmlSadrzaj} </tr>`;
    });

    tabela.innerHTML = html;

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
