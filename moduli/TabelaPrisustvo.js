const validirajPodatke = (podaci) => {
    return true;
}

const KreirajTabelu = (divRef, podaci, trenutnaSedmica) => {
    //početne vrijednosti nekih varijabli
    divRef.innerHTML = "";    
    const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    const upisanoZaglavljeSedmice = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    const prisustvaStudenataTrenutneSedmice = [];

    if (!validirajPodatke(podaci)) {
        divRef.innerHTML = "<em> Podaci o prisustvu nisu validni! </em>";
        return;
    }

    const ukupnoStudenata = podaci.studenti.length;
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
            let tekst = "";

            if (posljednjaRazmatranaSedmica != 15) {
                if (posljednjaRazmatranaSedmica == 14)
                    tekst = "XV";
                else 
                    tekst = `${sedmiceTekstualno[posljednjaRazmatranaSedmica+1]}-XV`
                htmlSadrzaj += `<th>${tekst}</th>`;
            }

            html += `<tr> ${htmlSadrzaj}  </tr>`;                
            return;
        }

        let dodatak = "";
        if (posljednjaRazmatranaSedmica != 15) {
            dodatak = `<td rowspan="2"></td> `;
        }

        htmlSadrzaj += `${dodatak} </tr> \n <tr> \n`;
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

    //dodavanje odgovarajućeg broja col tagova
    for (let k = 1; k < 2 + posljednjaRazmatranaSedmica + podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno; k++)
        html += "<col>";

    let preostaloKolona = 15 - posljednjaRazmatranaSedmica;
    if (preostaloKolona > 10)
        preostaloKolona = 10;
    
    const postotakSirine = (preostaloKolona / 2) * 10;

    html += `<col style="width:${postotakSirine}%;">`;
    tabela.innerHTML = html;
    divRef.appendChild(tabela);
}

let TabelaPrisustvo = function (divRef, podaci) {
    let trenutnaSedmica = podaci.prisustva[podaci.prisustva.length - 1].sedmica;

    //inicijalno pokazujemo podatke za posljednju sedmicu
    KreirajTabelu(divRef, podaci, trenutnaSedmica);    
    KreirajTabelu(divRef, podaci, trenutnaSedmica-1);
    
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
