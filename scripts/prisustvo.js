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
			"sedmica": 3,
			"predavanja": 2,
			"vjezbe": 2,
			"index": 12346
		},
		
		{
			"sedmica": 2,
			"predavanja": 2,
			"vjezbe": 2,
			"index": 12346
		},
        {
			"sedmica": 1,
			"predavanja": 2,
			"vjezbe": 2,
			"index": 12345
		}
	],
	"predmet": "Razvoj mobilnih aplikacija",
	"brojPredavanjaSedmicno": 5,
	"brojVjezbiSedmicno": 6
}
);

//pozivanje metoda - ove metode kasnije implementirati
//prisustvo.sljedecaSedmica();
//prisustvo.prethodnaSedmica();
