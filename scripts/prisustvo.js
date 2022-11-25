let div = document.getElementById("divSadrzaj");
//instanciranje
let prisustvo = TabelaPrisustvo(div, {
	"studenti": [{
			"ime": "Neko Nekić",
			"index": 12345
		},
		{
			"ime": "Neko Nekić 1",
			"index": 23441
		},
        {
            "ime": "Neko nekić 3",
            "index": 53545
        },
        {
            "ime": "Neko nekić 3",
            "index": 60
        }
	],
	"prisustva": [
        {
			"sedmica": 4,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 60
		},
        {
			"sedmica": 5,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 53545
		},{
			"sedmica": 3,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 23441
		}
	],
	"predmet": "P1",
	"brojPredavanjaSedmicno": 3,
	"brojVjezbiSedmicno": 2
}
);

//pozivanje metoda - ove metode kasnije implementirati
//prisustvo.sljedecaSedmica();
//prisustvo.prethodnaSedmica();
