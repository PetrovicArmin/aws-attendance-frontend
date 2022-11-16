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
    return nizStudenata;
}

const KreirajTabelu = (divRef, podaci, trenutnaSedmica) => {
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
            red += `<td rowspan="2"></td> \n`;
        red += `</tr> <tr> \n`;

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


let TabelaPrisustvo = function (divRef, podaci) {
    let trenutnaSedmica = podaci.prisustva[podaci.prisustva.length - 1].sedmica;

    //inicijalno pokazujemo podatke za posljednju sedmicu
    KreirajTabelu(divRef, podaci, trenutnaSedmica);

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
