import { Sequelize } from "sequelize";

const tabela = {
    Nastavnik: null,
    Predmet: null,
    Student: null,
    Prisustvo: null,
    PredmetStudent: null
};

let sequelize = null;

//funkcije za eksport našeg modula
const syncDatabase = () => {
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

    tabela.Prisustvo = sequelize.define('Prisustvo', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sedmica: Sequelize.INTEGER,
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER
    });

    tabela.PredmetStudent = sequelize.define('PredmetStudent', {
        student_id: {
            type: Sequelize.INTEGER,
            references: {
                model: tabela.Student,
                key: 'id'
            }
        },
        predmet_id: {
            type: Sequelize.INTEGER,
            references: {
                model: tabela.Predmet,
                key: 'id'
            }
        }
    });

    //asocijacije između tabela
    tabela.Nastavnik.hasMany(tabela.Predmet, {
        foreignKey: 'nastavnik_id'
    });
    tabela.Predmet.belongsTo(tabela.Nastavnik);



    tabela.Predmet.hasMany(tabela.Prisustvo, {
        foreignKey: 'predmet_id'
    });
    tabela.Prisustvo.belongsTo(tabela.Predmet);



    tabela.Student.hasMany(tabela.Prisustvo, {
        foreignKey: 'student_id'
    });
    tabela.Prisustvo.belongsTo(tabela.Student);



    tabela.Predmet.belongsToMany(tabela.Student, { through: tabela.PredmetStudent });
    tabela.Student.belongsToMany(tabela.Predmet, { through: tabela.PredmetStudent });

    sequelize.sync().then(() => {
        //popuniti dummy podacima ove tabele koje smo napravili!
    });
};

const DatabaseHandler = {
    syncDatabase
};

export default DatabaseHandler;