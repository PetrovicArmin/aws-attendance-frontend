const sedmiceTekstualno = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

let TabelaPrisustvo = function (divRef, podaci) {
    //formula za pristup zadnjoj koloni: |rb_kolone + 2 + br_predavanja + br_vjezbi - 1|
    //formula za pristup trenutnoj koloni: |rb_kolone + 2|

    divRef.innerHTML = "";

    //treba validirati podatke ovdje!

    let trenutniStudent = 0;
    const ukupnoStudenata = podaci.studenti.length;
    const trenutnaSedmica = podaci.prisustva[podaci.prisustva.length - 1].sedmica;

    const tabela = document.createElement('table');

    const zaglavlje = tabela.insertRow();

    podaci.studenti.forEach((student, indeks) => {
        const trenutniRed = tabela.insertRow();

        const tdImeIPrezime = trenutniRed.insertCell();
        tdImeIPrezime.appendChild(document.createTextNode(student.ime));
        tdImeIPrezime.setAttribute('rowSpan', '2');

        const tdIndeks = trenutniRed.insertCell();
        tdIndeks.appendChild(document.createTextNode(student.index));
        tdIndeks.setAttribute('rowSpan', '2');
    });


    let th1 = document.createElement('th');
    th1.innerHTML = "Ime i <br> prezime";
    let th2 = document.createElement('th');
    th2.innerHTML = "Index";

    zaglavlje.appendChild(th1);
    zaglavlje.appendChild(th2);


    podaci.prisustva.forEach((prisustvo, i) => {
        if (prisustvo.sedmica == trenutnaSedmica) {
            for (let j = 1; j <= podaci.brojPredavanjaSedmicno; j++) {
                
            }            
            return;            
        }        
        
        const postotak = ((prisustvo.predavanja + prisustvo.vjezbe)/(podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno) * 100) + "%";
        const td = tabela.rows[(i%ukupnoStudenata) + 1].insertCell();        
        td.appendChild(document.createTextNode(postotak));
        td.setAttribute('rowSpan', '2');
    });

    console.log(tabela.rows);

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
