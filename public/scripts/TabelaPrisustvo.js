function postojeDuplikati(array) {
    return (new Set(array)).size !== array.length;
}

const validirajPodatke = (podaci) => {    
    const brVjezbi = podaci.brojVjezbiSedmicno;
    const brPredavanja = podaci.brojPredavanjaSedmicno;
    const studenti = StrukturirajPrisustva(podaci);
    
    //Broj prisustva na predavanju/vježbi je veći od broja predavanja/vježbi sedmično
    //Broj prisustva je manji od nule
    if (brVjezbi < 0 || brPredavanja < 0)
        return false;
    if (podaci.prisustva.some(p => (p.predavanja < 0 || p.vjezbe < 0 || p.predavanja > brPredavanja || p.vjezbe > brVjezbi)))
        return false;

    //Isti student ima dva ili više unosa prisustva za istu sedmicu
    if (studenti.some(s => postojeDuplikati(s.prisustva.map(p => p.sedmica))))
        return false;

    //Postoje dva ili više studenata sa istim indeksom u listi studenata
    if (postojeDuplikati(studenti.map(s => s.index)))
        return false;


    //Postoji prisustvo za studenta koji nije u listi studenata
    if (!podaci.prisustva.map(p => p.index).every(ind => podaci.studenti.map(s => s.index).includes(ind)))
        return false;

    //Postoji sedmica, između dvije sedmice za koje je uneseno prisustvo bar jednom studentu, u kojoj nema unesenog prisustva. 
    let sedmice = podaci.prisustva.map(p => p.sedmica).filter((item, i, ar) => ar.indexOf(item) === i).sort((a,b) => a - b);

    if (Math.max(...sedmice.slice(1).map((v, i) => v - sedmice[i])) > 1)
        return false;
    
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

const KreirajTabelu = (podaci, trenutnaSedmica) => {
    //konstante potrebne za lakši rad
    const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    const brVjezbi = podaci.brojVjezbiSedmicno;
    const brPredavanja = podaci.brojPredavanjaSedmicno;
    const studenti = StrukturirajPrisustva(podaci);

    const zadnjaSedmica = (trenutnaSedmica) ? Math.max(...studenti.map(stud => Math.max(...stud.prisustva.map(pris => pris.sedmica)))) : 0;
    let redoviSadrzaj = [''];
    let html = "";
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
                    tekst = `${Math.round(((prisustvo.predavanja + prisustvo.vjezbe)/(1.0*(brVjezbi + brPredavanja)))*100)}%`;
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

        if (zadnjaSedmica) {
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
        }

        redoviSadrzaj.push(red);
    });


    redoviSadrzaj.forEach(red => html += `<tr> ${red} </tr> \n`);

    //dodavanje odgovarajućeg broja col tagova
    for (let k = 1; k < 2 + (zadnjaSedmica ? zadnjaSedmica + brPredavanja + brVjezbi : 1); k++)
        html += "<col>\n";

    let preostaloKolona = 15 - zadnjaSedmica;
    if (preostaloKolona > 10)
        preostaloKolona = 10;
    
    const postotakSirine = (preostaloKolona / 2) * 10;

    html += `<col style="width:${postotakSirine}%;">`;
    tabela.innerHTML = html;
    return tabela;
}

const KreirajTabeluClickable = (podaci, trenutnaSedmica) => {
    //konstante potrebne za lakši rad
    const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    const brVjezbi = podaci.brojVjezbiSedmicno;
    const brPredavanja = podaci.brojPredavanjaSedmicno;
    const studenti = StrukturirajPrisustva(podaci);

    const zadnjaSedmica = (trenutnaSedmica) ? Math.max(...studenti.map(stud => Math.max(...stud.prisustva.map(pris => pris.sedmica)))) : 0;
    let redoviSadrzaj = [''];
    let html = "";
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
                    tekst = `${Math.round(((prisustvo.predavanja + prisustvo.vjezbe)/(1.0*(brVjezbi + brPredavanja)))*100)}%`;
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

        if (zadnjaSedmica) {
            if (prisustvoTrenutneSedmice == null) {
                for (let j = 1; j <= brPredavanja; j++)
                    red += `<td> <br> </td> \n`;
                for (let j = 1; j <= brVjezbi; j++)
                    red += `<td> <br> </td> \n`;
            } else {
                p = prisustvoTrenutneSedmice;
                for (let k = 1; k <= prisustvoTrenutneSedmice.predavanja; k++)
                    red += `<td class="zelena popup" onclick="PoziviAjax.postPrisustvo('${podaci.predmet}', ${student.index}, {'sedmica': ${p.sedmica}, 'vjezbe': ${p.vjezbe}, 'predavanja': ${p.predavanja-1}}, prisustvaCallback)"> <br> </td> \n`;
                for (let k = prisustvoTrenutneSedmice.predavanja + 1; k <= brPredavanja; k++)
                    red += `<td class="crvena popup" onclick="PoziviAjax.postPrisustvo('${podaci.predmet}', ${student.index}, {'sedmica': ${p.sedmica}, 'vjezbe': ${p.vjezbe}, 'predavanja': ${p.predavanja+1}}, prisustvaCallback)"> <br> </td> \n`;
                for (let k = 1; k <= prisustvoTrenutneSedmice.vjezbe; k++)
                    red += `<td class="zelena popup" onclick="PoziviAjax.postPrisustvo('${podaci.predmet}', ${student.index}, {'sedmica': ${p.sedmica}, 'vjezbe': ${p.vjezbe-1}, 'predavanja': ${p.predavanja}}, prisustvaCallback)"> <br> </td> \n`;
                for (let k = prisustvoTrenutneSedmice.vjezbe + 1; k <= brVjezbi; k++)
                    red += `<td class="crvena popup" onclick="PoziviAjax.postPrisustvo('${podaci.predmet}', ${student.index}, {'sedmica': ${p.sedmica}, 'vjezbe': ${p.vjezbe+1}, 'predavanja': ${p.predavanja}}, prisustvaCallback)"> <br> </td> \n`;            
            }
        }

        redoviSadrzaj.push(red);
    });


    redoviSadrzaj.forEach(red => html += `<tr> ${red} </tr> \n`);

    //dodavanje odgovarajućeg broja col tagova
    for (let k = 1; k < 2 + (zadnjaSedmica ? zadnjaSedmica + brPredavanja + brVjezbi : 1); k++)
        html += "<col>\n";

    let preostaloKolona = 15 - zadnjaSedmica;
    if (preostaloKolona > 10)
        preostaloKolona = 10;
    
    const postotakSirine = (preostaloKolona / 2) * 10;

    html += `<col style="width:${postotakSirine}%;">`;
    tabela.innerHTML = html;
    return tabela;
}

const PopuniDiv = (div, podaci, trenutnaSedmica) => {
    div.innerHTML = "";

    if (!validirajPodatke(podaci)) {
        div.innerHTML = "Podaci o prisustvu nisu validni!";
        return;
    }

    //kreiranje tabele na osnovu podataka
    const tabela = KreirajTabelu(podaci, trenutnaSedmica);

    const predmetElement = document.createElement('p');
    predmetElement.appendChild(document.createTextNode(`Predmet: ${podaci.predmet}`));

    const predavanjaElement = document.createElement('p');
    predavanjaElement.appendChild(document.createTextNode(`Broj predavanja sedmično: ${podaci.brojPredavanjaSedmicno}`));

    const vjezbeElement = document.createElement('p');
    vjezbeElement.appendChild(document.createTextNode(`Broj vježbi sedmično: ${podaci.brojVjezbiSedmicno}`));


    div.appendChild(predmetElement);
    div.appendChild(predavanjaElement);
    div.appendChild(vjezbeElement);
    div.appendChild(tabela);
    div.appendChild(buttonLijevo);
    div.appendChild(buttonDesno);

    return div;
}

const buttonLijevo = document.createElement('button');
buttonLijevo.setAttribute('type', 'button');
buttonLijevo.innerHTML = `<i class="fa fa-solid fa-arrow-left fa-4x"></i>`;

const buttonDesno = document.createElement('button');
buttonDesno.setAttribute('type', 'button');
buttonDesno.setAttribute('class', "desni_button");
buttonDesno.innerHTML = `<i class="fa fa-solid fa-arrow-right fa-4x"></i>`;



let TabelaPrisustvo = function (divRef, podaci) {
    //inicijalno popunjavanje referentnog div-a
    let trenutnaSedmica = 0;
    
    if (podaci.prisustva.length)
        trenutnaSedmica = Math.max(...podaci.prisustva.map(pr => pr.sedmica));
    
    const posljednjaSaPrisustvom = trenutnaSedmica;
    
    PopuniDiv(divRef, podaci, trenutnaSedmica);
    
    //implementacija metoda
    let prethodnaSedmica = function () {
        if (trenutnaSedmica == 1 || trenutnaSedmica == 0)
            return;
        trenutnaSedmica--;    
        PopuniDiv(divRef, podaci, trenutnaSedmica);        
    }

    let sljedecaSedmica = function () {
        if (trenutnaSedmica >= posljednjaSaPrisustvom)
            return;
        trenutnaSedmica++;
        PopuniDiv(divRef, podaci, trenutnaSedmica);
    }

    buttonLijevo.addEventListener('click', prethodnaSedmica);
    buttonDesno.addEventListener('click', sljedecaSedmica);

    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
};

const PopuniDivClickable = (div, podaci, trenutnaSedmica) => {
    div.innerHTML = "";

    if (!validirajPodatke(podaci)) {
        div.innerHTML = "Podaci o prisustvu nisu validni!";
        return;
    }

    //kreiranje tabele na osnovu podataka
    const tabela = KreirajTabeluClickable(podaci, trenutnaSedmica);

    const predmetElement = document.createElement('p');
    predmetElement.appendChild(document.createTextNode(`Predmet: ${podaci.predmet}`));

    const predavanjaElement = document.createElement('p');
    predavanjaElement.appendChild(document.createTextNode(`Broj predavanja sedmično: ${podaci.brojPredavanjaSedmicno}`));

    const vjezbeElement = document.createElement('p');
    vjezbeElement.appendChild(document.createTextNode(`Broj vježbi sedmično: ${podaci.brojVjezbiSedmicno}`));


    div.appendChild(predmetElement);
    div.appendChild(predavanjaElement);
    div.appendChild(vjezbeElement);
    div.appendChild(tabela);
    div.appendChild(buttonLijevo);
    div.appendChild(buttonDesno);

    return div;
}


let TabelaPrisustvoClickable = (divRef, podaci, trenutnaSedmica=0) => {
    //inicijalno popunjavanje referentnog div-a
    let posljednjaSaPrisustvom = 0;

    if (podaci.prisustva.length)
        posljednjaSaPrisustvom = Math.max(...podaci.prisustva.map(pr => pr.sedmica));

    if (trenutnaSedmica == 0)
        trenutnaSedmica = posljednjaSaPrisustvom;
    
    
    PopuniDivClickable(divRef, podaci, trenutnaSedmica);
    
    //implementacija metoda
    let prethodnaSedmica = function () {
        if (trenutnaSedmica == 1 || trenutnaSedmica == 0)
            return;
        trenutnaSedmica--;    
        PopuniDivClickable(divRef, podaci, trenutnaSedmica);        
    }

    let sljedecaSedmica = function () {
        if (trenutnaSedmica >= posljednjaSaPrisustvom)
            return;
        trenutnaSedmica++;
        PopuniDivClickable(divRef, podaci, trenutnaSedmica);
    }

    buttonLijevo.addEventListener('click', prethodnaSedmica);
    buttonDesno.addEventListener('click', sljedecaSedmica);

    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
};
