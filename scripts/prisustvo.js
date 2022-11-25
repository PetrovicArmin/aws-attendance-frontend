let div = document.getElementById("divSadrzaj");
//instanciranje
let prisustvo = TabelaPrisustvo(div, {
	"studenti": [{
			"ime": "Student A",
			"index": 1
		},
		{
			"ime": "Student B",
			"index": 2
		},
        {
            "ime": "Neko nekić 3",
            "index": 53545
        },
        {
            "ime": "Neko nekić 3",
            "index": 60
        },
        {
            "ime": "Vanredni student",
            "index": 999
        }
	],
	"prisustva": [
        {
            "sedmica": 5,
            "predavanja": 4,
            "vjezbe": 4,
            "index": 999
        },
        {
			"sedmica": 4,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 1
		},
        {
			"sedmica": 2,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 1
		},
        {
			"sedmica": 1,
			"predavanja": 0,
			"vjezbe": 0,
			"index": 1
		},
        {
			"sedmica": 2,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 2
		},
        {
			"sedmica": 3,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 2
		},
        {
			"sedmica": 1,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 2
		}
	],
	"predmet": "P1",
	"brojPredavanjaSedmicno": 6,
	"brojVjezbiSedmicno": 6
}
);

//pozivanje metoda - ove metode kasnije implementirati
//prisustvo.sljedecaSedmica();
//prisustvo.prethodnaSedmica();
