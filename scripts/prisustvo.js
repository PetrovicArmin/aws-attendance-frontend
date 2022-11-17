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
			"vjezbe": 2,
			"index": 12345
		},
		
		{
			"sedmica": 5,
			"predavanja": 2,
			"vjezbe": 2,
			"index": 12345
		},
        {
			"sedmica": 14,
			"predavanja": 2,
			"vjezbe": 2,
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
