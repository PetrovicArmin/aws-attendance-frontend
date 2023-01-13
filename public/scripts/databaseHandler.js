import { INTEGER, Sequelize } from "sequelize";

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

const tabela = {
    Nastavnik: null,
    Predmet: null,
    Student: null,
    Prisustvo: null,
    PredmetStudent: null,
    NastavnikPredmet: null
};

let sequelize = null;


const fillDatabase = () => {
    let dummyNastavnici = [
        {
            username: 'USERNAME 1',
            passwordHash: '$2b$10$bUTsm3k/AUKFLGcGnd5ldeUBabAH5RyQ7f3WwuQihr.l25O3f.8lq'
        },
        {
            username: 'USERNAME 2',
            passwordHash: '$2b$10$jlO9.ZlbdAlax/4sylu9nuq/RKCmqLpaTFQeoeo1YeUBv02X39Ya2'
        }
    ];

    let dummyStudenti = [
        {
            naziv: 'Student 1',
            index: 1
        },
        {
            naziv: 'Student 2',
            index: 2
        },
        {
            naziv: 'Student 3',
            index: 3
        },
        {
            naziv: 'Student 4',
            index: 4
        },
        {
            naziv: 'Student 5',
            index: 5
        }
    ];

    let dummyPredmeti = [
        {
            naziv:'Predmet 1',
            predavanja:5,
            vjezbe:3
        },
        {
            naziv:'Predmet 2',
            predavanja:4,
            vjezbe: 4
        },
        {
            naziv:'Predmet 3',
            predavanja: 3,
            vjezbe: 5
        }
    ];


    tabela.Nastavnik.bulkCreate(dummyNastavnici).then(() => console.log('Kreirani dummy nastavnici!'));
    tabela.Student.bulkCreate(dummyStudenti).then(() => console.log('Kreirani dummy studenti!'));

    const nastavnici = [];
    const predmeti = [];
    const studenti = [];

    tabela.Predmet.bulkCreate(dummyPredmeti).then(async () => {
        for (let i = 1; i <= 2; i++)
            nastavnici.push(await tabela.Nastavnik.findOne({where: { username: `USERNAME ${i}`}}));

        for (let i = 1; i <= 3; i++)
            predmeti.push(await tabela.Predmet.findOne({where: { naziv: `Predmet ${i}`}}));

        for (let i = 1; i <= 5; i++)
            studenti.push(await tabela.Student.findOne({where: { naziv: `Student ${i}`}}));

        //dodjela predmeta profesorima
        await nastavnici[0].addPredmets([predmeti[0], predmeti[1]]);
        await nastavnici[1].addPredmets([predmeti[0], predmeti[1]]);

        //upisivanje studenata na predmete
        await predmeti[0].addStudents([studenti[0], studenti[1], studenti[2]]);
        await predmeti[1].addStudents([studenti[1], studenti[2], studenti[3]]);
        await predmeti[2].addStudents([studenti[2], studenti[3], studenti[4]]);

        //popunjavanje prisustva za svakog od studenata, na svakom od predmeta:
        let predmetStudent = await tabela.PredmetStudent.findAll({include: [{model:tabela.Predmet},{model: tabela.Student}]});

        for (let ps of predmetStudent) {
            let brojSedmica = getRandomIntInclusive(0, 13);
            const prisustva = [];
            for (let trenutnaSedmica = 1; trenutnaSedmica <= brojSedmica; trenutnaSedmica++) {
                const randomPredavanja = getRandomIntInclusive(0, ps.dataValues.Predmet.predavanja);
                const randomVjezbe = getRandomIntInclusive(0, ps.dataValues.Predmet.vjezbe);
                prisustva.push({
                    sedmica: trenutnaSedmica,
                    predavanja: randomPredavanja,
                    vjezbe: randomVjezbe,
                    PredmetStudentId: ps.dataValues.id
                });
            }

            await tabela.Prisustvo.bulkCreate(prisustva);
        }
    });
}

//funkcije za eksport našeg modula
const syncDatabase = async (generisiDummyPodatke) => {
    sequelize = new Sequelize("wt22", "root", "password", {
        host: "127.0.0.1",
        dialect: "mysql"
    });

    //struktura tabela
    tabela.Nastavnik = sequelize.define('Nastavnik', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        username: Sequelize.STRING,
        passwordHash: Sequelize.STRING
    });    

    tabela.Predmet = sequelize.define('Predmet', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        naziv: Sequelize.STRING,
        predavanja: Sequelize.INTEGER, 
        vjezbe: Sequelize.INTEGER
    });

    tabela.Student = sequelize.define('Student', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        naziv: Sequelize.STRING,
        index: Sequelize.INTEGER
    });
    
    tabela.NastavnikPredmet = sequelize.define('NastavnikPredmet', {});
    
    tabela.PredmetStudent = sequelize.define('PredmetStudent', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    
    tabela.Prisustvo = sequelize.define('Prisustvo', {
        PredmetStudentId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: tabela.PredmetStudent,
                key: 'id'
            } 
        },
        sedmica: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER
    });
    
    //asocijacije između tabela
    tabela.Nastavnik.belongsToMany(tabela.Predmet, { through: tabela.NastavnikPredmet });
    tabela.Predmet.belongsToMany(tabela.Nastavnik, { through: tabela.NastavnikPredmet });

    tabela.Nastavnik.hasMany(tabela.NastavnikPredmet);
    tabela.NastavnikPredmet.belongsTo(tabela.Nastavnik);

    tabela.Predmet.hasMany(tabela.NastavnikPredmet);
    tabela.NastavnikPredmet.belongsTo(tabela.Predmet);

    tabela.Predmet.hasMany(tabela.PredmetStudent);
    tabela.PredmetStudent.belongsTo(tabela.Predmet);

    tabela.Student.hasMany(tabela.PredmetStudent);
    tabela.PredmetStudent.belongsTo(tabela.Student);

    tabela.Predmet.belongsToMany(tabela.Student, { through: tabela.PredmetStudent });
    tabela.Student.belongsToMany(tabela.Predmet, { through: tabela.PredmetStudent });

    tabela.PredmetStudent.hasMany(tabela.Prisustvo);
    tabela.Prisustvo.belongsTo(tabela.PredmetStudent);

    sequelize.sync().then(async() => {
        if (generisiDummyPodatke) 
            fillDatabase();        
        //linija ispod je čisto testna!
        console.log(await kreirajPrisustvoPredmeta('Predmet 2'));
        await azurirajPrisustvo('Predmet 2', {sedmica: 5, predavanja: 0, vjezbe: 0, index: 4});
        console.log(await kreirajPrisustvoPredmeta('Predmet 2'));
    });

};

const kreirajPrisustvoPredmeta = async (nazivPredmeta) => {
    const prisustvoPredmeta = {
        studenti: [],
        prisustva: [],
        predmet: '',
        predavanja: 0,
        vjezbe: 0
    };

    const predmet = await tabela.Predmet.findOne({
        where: {
            naziv: nazivPredmeta
        },
        include: {
            model: tabela.PredmetStudent
        }
    });

    prisustvoPredmeta.predmet = predmet.dataValues.naziv;
    prisustvoPredmeta.predavanja = predmet.dataValues.predavanja;
    prisustvoPredmeta.vjezbe = predmet.dataValues.vjezbe;

    for (let ps of predmet.dataValues.PredmetStudents) {
        const student = await tabela.Student.findOne({ where: {id: ps.dataValues.StudentId}});
        prisustvoPredmeta.studenti.push({
            ime: student.dataValues.naziv,
            index: student.dataValues.index
        });

        const svaPrisustva = await tabela.Prisustvo.findAll({where: {PredmetStudentId: ps.dataValues.id}});
        for (let trenutnoPrisustvo of svaPrisustva) {
            prisustvoPredmeta.prisustva.push({
                sedmica: trenutnoPrisustvo.dataValues.sedmica,
                predavanja: trenutnoPrisustvo.dataValues.predavanja,
                vjezbe: trenutnoPrisustvo.dataValues.vjezbe,
                index: student.dataValues.index
            });
        }
    }

    return prisustvoPredmeta;
};

const pronadjiNastavnika = async (username) => {

}

const azurirajPrisustvo = async (nazivPredmeta, objekatPrisustva) => {
    const student = await tabela.Student.findOne({where: {index: objekatPrisustva.index}});
    const predmet = await tabela.Predmet.findOne({where: {naziv: nazivPredmeta}});
    const predmetStudent = await tabela.PredmetStudent.findOne({where: {StudentId: student.dataValues.id, PredmetId: predmet.dataValues.id}});
    await tabela.Prisustvo.update({ predavanja: objekatPrisustva.predavanja, vjezbe: objekatPrisustva.vjezbe }, {where: { sedmica: objekatPrisustva.sedmica, PredmetStudentId: predmetStudent.dataValues.id }});    
}

const DatabaseHandler = {
    syncDatabase
};

export default DatabaseHandler;