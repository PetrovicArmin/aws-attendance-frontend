const validirajPodatke = (podaci) => {
    
    return true;
}

const StrukturirajPrisustva = (podaci) => {
    const nizStudenata = [];

    podaci.studenti.forEach(student => {
        let noviStudent = JSON.parse(JSON.stringify(student));
        noviStudent.prisustva = podaci.prisustva.filter(prisustvo => prisustvo.index == noviStudent.index);
        nizStudenata.push(noviStudent);
    });

    console.log(podaci);
    console.log(nizStudenata);
    return nizStudenata;
}

const KreirajTabelu1 = (divRef, podaci, trenutnaSedmica) => {
    //konstante potrebne za lakši rad
    const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    const brVjezbi = podaci.brojVjezbiSedmicno;
    const brPredavanja = podaci.brojPredavanjaSedmicno;
    const studenti = StrukturirajPrisustva(podaci);
    const zadnjaSedmica = Math.max(...studenti.map(stud => Math.max(...stud.prisustva.map(pris => pris.sedmica))));
    let redoviSadrzaj = [''];
    let html = "";
    divRef.innerHTML = "";
    let tabela = document.createElement('table');

    //popunjavanje zaglavlja tabele
    redoviSadrzaj[0] = `<th>Ime i <br> prezime</th> \n <th>Index</th> \n`;
    for (let i = 1 ; i <= zadnjaSedmica; i++) {
        let colspan = (i == trenutnaSedmica) ? `colspan=${brVjezbi + brPredavanja}` : ``;
        redoviSadrzaj[0] += `<th ${colspan}> ${sedmiceTekstualno[i]} </th> \n`;
    }

    let tekstPosljednjeKolone = "XV";
    if (zadnjaSedmica <= 13)
        tekstPosljednjeKolone = `${sedmiceTekstualno[zadnjaSedmica + 1]} - XV`;
   
    if (zadnjaSedmica != 15) 
        redoviSadrzaj[0] += `<th> ${tekstPosljednjeKolone} </th> \n`;
    

    //popunjavanje ostalih redova tabele
    studenti.forEach(student => {
        let red = ``;
        let prisustvoTrenutneSedmice = null;

        red += `<td rowspan="2">${student.ime}</td> \n <td rowspan="2">${student.index}</td> \n`;
        for (let i = 1; i <= zadnjaSedmica; i++) {
            //provjeri da li student posjeduje tu sedmicu:
            let nizSedmica = student.prisustva.filter(prisustvo => prisustvo.sedmica == i);
            let prisustvo = (nizSedmica.length == 0) ? null : nizSedmica[0];
            
            if (i != trenutnaSedmica) {
                let tekst = "";
                if (prisustvo)
                    tekst = `${((prisustvo.predavanja + prisustvo.vjezbe)/(1.0*(brVjezbi + brPredavanja)))*100}%`;
                red += `<td rowspan="2">${tekst}</td> \n`;    
            } else {
                prisustvoTrenutneSedmice = prisustvo;
                for (let j = 1; j <= brPredavanja; j++)
                    red += `<td class="center">P <br> ${j}</td> \n`;
                for (let j = 1; j <= brVjezbi; j++)
                    red += `<td class="center">V <br> ${j}</td> \n`;
            }
        }

        if (zadnjaSedmica != 15)
            red += `<td rowspan="2"></td> \n </tr> <tr> \n`;

        if (prisustvoTrenutneSedmice == null) {
            for (let j = 1; j <= brPredavanja; j++)
                red += `<td> <br> </td> \n`;
            for (let j = 1; j <= brVjezbi; j++)
                red += `<td> <br> </td> \n`;
        } else {
            for (let k = 1; k <= prisustvoTrenutneSedmice.predavanja; k++)
                red += `<td class="zelena"> <br> </td> \n`;
            for (let k = prisustvoTrenutneSedmice.predavanja + 1; k <= brPredavanja; k++)
                red += `<td class="crvena"> <br> </td> \n`;
            for (let k = 1; k <= prisustvoTrenutneSedmice.vjezbe; k++)
                red += `<td class="zelena"> <br> </td> \n`;
            for (let k = prisustvoTrenutneSedmice.vjezbe + 1; k <= brVjezbi; k++)
                red += `<td class="crvena"> <br> </td> \n`;            
        }

        redoviSadrzaj.push(red);
    });


    redoviSadrzaj.forEach(red => html += `<tr> ${red} </tr> \n`);

    //dodavanje odgovarajućeg broja col tagova
    for (let k = 1; k < 2 + zadnjaSedmica + brPredavanja + brVjezbi; k++)
        html += "<col>\n";

    let preostaloKolona = 15 - zadnjaSedmica;
    if (preostaloKolona > 10)
        preostaloKolona = 10;
    
    const postotakSirine = (preostaloKolona / 2) * 10;

    html += `<col style="width:${postotakSirine}%;">`;
    tabela.innerHTML = html;
    divRef.appendChild(tabela);
}

//napraviti potpuni refaktoring načina kreiranja ove tabele, jer mi se ovo niti malo ne svidja, 
//i uopće nije skalabilno!
const KreirajTabelu = (divRef, podaci, trenutnaSedmica) => {
    //početne vrijednosti nekih varijabli
    divRef.innerHTML = "";    
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
    KreirajTabelu1(divRef, podaci, trenutnaSedmica);
    KreirajTabelu1(divRef, podaci, 1);

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
