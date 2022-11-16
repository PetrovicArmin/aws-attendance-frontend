let div = document.getElementById("divSadrzaj");
//instanciranje
let prisustvo = TabelaPrisustvo(div, {
	"studenti": [{
			"ime": "Neko Nekic",
			"index": 12345
		},
		{
			"ime": "Drugi Neko",
			"index": 12346
		}
	],
	"prisustva": [{
			"sedmica": 1,
			"predavanja": 2,
			"vjezbe": 1,
			"index": 12345
		},
		
		{
			"sedmica": 2,
			"predavanja": 2,
			"vjezbe": 0,
			"index": 12345
		},
        {
			"sedmica": 15,
			"predavanja": 2,
			"vjezbe": 0,
			"index": 12345
		}
	],
	"predmet": "Razvoj mobilnih aplikacija",
	"brojPredavanjaSedmicno": 2,
	"brojVjezbiSedmicno": 2
}
);

//pozivanje metoda - ove metode kasnije implementirati
//prisustvo.sljedecaSedmica();
//prisustvo.prethodnaSedmica();
