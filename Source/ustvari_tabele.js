//ustvari povezavo z bazo
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'geslo123',
        database: 'zdravnikisi',
    }
});

const bcrypt = require('bcryptjs');

async function napolniBazo(){
//DROPANJE
    //ocenjevanje
    await knex.schema.dropTableIfExists('ocenjevanje')
    .catch((err) => {console.log(err); throw err});

    //zdravnik
    await knex.schema.dropTableIfExists('zdravnik')
    .catch((err) => {console.log(err); throw err});

    //poslovalnica
/*
    await knex.schema.dropTableIfExists('poslovalnica')
    .catch((err) => {console.log(err); throw err});
    

    //izvajanje storitev
    await knex.schema.dropTableIfExists('izvajanje_storitev')
    .catch((err) => {console.log(err); throw err});

    //specializacija
    await knex.schema.dropTableIfExists('specializacija')
    .catch((err) => {console.log(err); throw err});
*/

    //uporabnik
    await knex.schema.dropTableIfExists('uporabnik')
    .catch((err) => {console.log(err); throw err});


//KREIRANJE
    //uporabnik
    await knex.schema.createTable('uporabnik', (table) => {
        table.increments('id_uporabnik').notNullable();
        table.string('ime').notNullable();
        table.string('priimek').notNullable();
        table.string('uporabnisko_ime').notNullable();
        table.string('email').notNullable();
        table.string('geslo').notNullable();
        table.tinyint('admin');
    }).then(() => console.log("Uporabnik tabela narejena"))
    .catch((err) => {console.log(err); throw err});

    //specializacija
/*
    await knex.schema.createTable('specializacija', (table) => {
        table.increments('id');
        table.string('tip_specializacije').notNullable();
    }).then(() => console.log("Specializacija tabela narejena"))
    .catch((err) => {console.log(err); throw err});

    //izvajanje storitev
    await knex.schema.createTable('izvajanje', (table) => {
        table.increments('id');
        table.string('tip_izvajanja_storitev');
    }).then(() => console.log("Izvajanje storitev tabela narejena"))
    .catch((err) => {console.log(err); throw err});

    //poslovalnica
    await knex.schema.createTable('poslovalnica', (table) => {
        table.increments('id');
        table.string('naslov').notNullable();
        table.string('pokrajina').notNullable();
    }).then(() => console.log("Poslovalnica tabela narejena"))
    .catch((err) => {console.log(err); throw err});
*/

    //zdravnik
    await knex.schema.createTable('zdravnik', (table) => {
        table.increments('id_zdravnik');
        table.string('ime');
        table.string('priimek');
        table.string('email');
        table.string('telefon');
        table.string('cas');
        table.integer('prosto');
        table.string('opis');
        table.string('specializacija');
        table.string('izvajanje');
        table.string('poslovalnica');
        table.string('lokacija');
    }).then(() => console.log("Zdravnik tabela narejena"))
    .catch((err) => {console.log(err); throw err});

    //ocenjevanje
    await knex.schema.createTable('ocenjevanje', (table) => {
        table.increments('id_ocena');
        table.integer('ocena');
        table.string('vsebina_komentarja');
        table.binary('nalozeno_dokazilo');
        table.string('datum_cas_ocene');
        table.boolean('preverjena_ocena');
        table.integer('zdravnik_id').references('id_zdravnik').inTable('zdravnik');
        table.integer('uporabnik_id').references('id_uporabnik').inTable('uporabnik');
    }).then(() => console.log("Ocenjevanje tabela narejena"))
    .catch((err) => {console.log(err); throw err});


// VSI PODATKI
    const uporabniki = [
        //stranke
        {ime: 'miha', priimek: 'novak', uporabnisko_ime: 'mihanovak', email: 'miha.novak@gmail.com', geslo: bcrypt.hashSync('geslogeslo', 12), admin: 0},
        {ime: 'anja', priimek: 'podjavršek', uporabnisko_ime: 'anjica', email: 'anja.podjavrsek1@gmail.com', geslo: bcrypt.hashSync('anja123', 12), admin: 0},
        {ime: 'vito', priimek: 'jurič', uporabnisko_ime: 'vitojur', email: 'vito.juric2@gmail.com', geslo: bcrypt.hashSync('fitnes', 12), admin: 0},
        {ime: 'primoz', priimek: 'zupanič', uporabnisko_ime: 'primorec', email: 'primoz.zupanic@gmail.com', geslo: bcrypt.hashSync('jazsempes', 12), admin: 0},
        {ime: 'lara', priimek: 'ferlinc', uporabnisko_ime: 'zdravnikifan', email: 'lara.ferlinc@gmail.com', geslo: bcrypt.hashSync('anime', 12), admin: 0},
        {ime: 'klara', priimek: 'krepek', uporabnisko_ime: 'klarica', email: 'klarakebric@gmail.com', geslo: bcrypt.hashSync('abc123hihihi', 12), admin: 0},
        {ime: 'barbara', priimek: 'kirbiš', uporabnisko_ime: 'barbara', email: 'barbara.kirbis1@gmail.com', geslo: bcrypt.hashSync('programerka', 12), admin: 0},
        {ime: 'sašo', priimek: 'prosenjak', uporabnisko_ime: 'sasopro', email: 'saso.prosenjak@gmail.com', geslo: bcrypt.hashSync('mojegeslo', 12), admin: 0},
        {ime: 'nik', priimek: 'kosi', uporabnisko_ime: 'nikkos', email: 'nik.kosi@gmail.com', geslo: bcrypt.hashSync('jazkosim', 12), admin: 0},
        {ime: 'filip', priimek: 'lipovnik', uporabnisko_ime: 'filipe', email: 'filip.lipovnik@gmail.com', geslo: bcrypt.hashSync('filipodlipe', 12), admin: 0},
        { ime: 'josef', priimek: 'horvat', uporabnisko_ime: 'josef123', email: 'josef.horvat@gmail.com', geslo: bcrypt.hashSync('jazsemjosef', 12), admin: 0},
        {ime: 'marko', priimek: 'dončič', uporabnisko_ime: 'markec', email: 'marko.doncic@gmail.com', geslo: bcrypt.hashSync('hejci', 12), admin: 0},
        {ime: 'casandra', priimek: 'klobasa', uporabnisko_ime: 'casandra', email: 'casa.klobasa@gmail.com', geslo: bcrypt.hashSync('klobasa', 12), admin: 0},
        {ime: 'črtomir', priimek: 'simonič', uporabnisko_ime: 'anonimni', email: 'crtomir.simonic@gmail.com', geslo: bcrypt.hashSync('crt123', 12), admin: 0},
        { ime: 'lucija', priimek: 'prevc', uporabnisko_ime: 'drlucija', email: 'lucija.prevc@gmail.com', geslo: bcrypt.hashSync('lucka', 12), admin: 0}, //15
        //administratorji
        { ime: 'tina', priimek: 'kebrič', uporabnisko_ime: 'tinakeb', email: 'tina.kebric@gmail.com', geslo: bcrypt.hashSync('mocnogeslo', 12), admin: 1},
        { ime: 'prvi', priimek: 'administrator', uporabnisko_ime: 'admin', email: 'admin@gmail.com', geslo: bcrypt.hashSync('123', 12), admin: 1}
    ]

    const zdravniki = [
       //okulisti
       /*1*/ { ime: 'Ana', priimek: 'Novak', email: 'ana.novak@gmail.com', telefon: '070153456', cas: 'Ponedeljek - Petek, 7:00 - 14:00', prosto: 1, opis: 'Okulistka dr. Ana Novak je ena izmed najboljših specialistov. Hitro se prijavite k njej, saj se mesta polnijo z veliko hitrostjo.', specializacija: "okulist", izvajanje: "javno", poslovalnica: "Maistrova ulica 19", lokacija: "Maribor"},
       /*2*/ { ime: 'David', priimek: 'Gradišnik', email: 'david.grad@gmail.com', telefon: '041545673', cas: 'Ponedeljek - Sobota, 9:00 - 15:00', prosto: 4, opis: 'Specialist oftalmologije, ki se najprej pogovori o pacientovih težavah, ga pregleda in motnje hitro reši', specializacija: "okulist", izvajanje: "zasebno", poslovalnica: "Tbilisijska ulica 81", lokacija: "Ljubljana"},
       /*3*/ { ime: 'Špela', priimek: 'Šopinger', email: 'spela.sopinger1@gmail.com', telefon: '030174973', cas: 'Pondeljek - Petek, 8:00 - 15:00', prosto: 3, opis: 'Specialistka za vede o očesu in očesnih bolezni. Hitro vam pomaga ugotoviti ali imate poslabšan vid.', specializacija: "okulist", izvajanje: "zasebno", poslovalnica: "Pivkova ulica 13", lokacija: "Ptuj"},
       //dermatologi
       /*4*/ { ime: 'Vita', priimek: 'Ahac', email: 'vita.ahac@gmail.com', telefon: '030152849', cas: 'Ponedeljek - Sobota, 9:00 - 17:00', prosto: 9, opis: 'Dr. Ahac je naboljša dermatologinja na Štajerskem, znana po tem, da vam pomaga hitro odkriti sume kožnega raka.', specializacija: "dermatolog", izvajanje: "javno", poslovalnica: "Bakovska ulica 14", lokacija: "Murska Sobota"},
       /*5*/ { ime: 'Liza', priimek: 'Ferk', email: 'liza.ferk@gmail.com', telefon: '031321754', cas: 'Torek - Petek, 12:00 - 19:00', prosto: 21, opis: 'Dermatologinja ki je osredotočena na diagnostiko in zdravljenje bolezni ter stanj, povezanih s kožo, lasmi, nohti in sluznicami.', specializacija: "dermatolog", izvajanje: "javno", poslovalnica: "Koprska cesta 4", lokacija: "Portorož"},
       /*6*/ { ime: 'Sandi', priimek: 'Ornik', email: 'sandi.orni@gmail.com', telefon: '040946173', cas: 'Ponedeljek - Sobota, 10:00 - 17:00', prosto: 11, opis: 'Zdravnik specializiran za zdravljenje kože, las in nohtov, z dolgoletnimi izkušnjami v zasebni kliniki.', specializacija: "dermatolog", izvajanje: "zasebno", poslovalnica: "Koroška ulica 152", lokacija: "Ljubljana"},
       //splosni
       /*7*/ { ime: 'Maria', priimek: 'Recept', email: 'maria.rec@gmail.com', telefon: '041643521', cas: 'Torek - Sobota, 10:00 - 17:00', prosto: 9, opis: 'Splošna zdravnica, ki sprejme vašo celotno družino, saj vsi vemo, da so družinski zdravniki najboljši.', specializacija: "splošni zdravnik", izvajanje: "zasebno", poslovalnica: "Stanetova ulica 13a", lokacija:"Celje"},
       /*8*/ { ime: 'Maja', priimek: 'Frangež', email: 'maja.frangez1@gmail.com', telefon: '041597745', cas: 'Ponedeljek - Petek, 8:00 - 14:00', prosto: 16, opis: 'Dr. Maja Frangež je priznana zdravnica, ki je svoje šolanje končala na Oxfordu v Veliki Britaniji, vrsto let v Londonu izvajala storitve, pred enim letom pa se vrnila v domač kraj.', specializacija: "splošni zdravnik", izvajanje: "javno", poslovalnica: "Ulica talcev 9", lokacija:"Maribor"},
       /*9*/ { ime: 'Grega', priimek: 'Kersnik', email: 'gregec.kersnik@gmail.com', telefon: '031297625', cas: 'Ponedeljek - Četrtek, 12:00 - 19:00', prosto: 23, opis: 'Mlad zdravnik Grega je uspešen zdravnik, ki se v svojem prostem času ukvarja tudi z latinsko-ameriškimi plesi in osvaja medalje po celem svetu.', specializacija: "splošni zdravnik", izvajanje: "javno", poslovalnica: "Ulica heroja Bračiča 6", lokacija:"Maribor"},
       /*10*/ { ime: 'Tone', priimek: 'Zupanc', email: 'tone.zupanc@gmail.com', telefon: '030476321', cas: 'Ponedeljek - Petek, 7:00 - 14:00', prosto: 4, opis: 'Dr. Tone Zupanc je svoje šolanje končal na Oxfordu v Veliki Britaniji, vrsto let v Londonu izvajal storitve, pred enim letom pa se vrnil v domač kraj. Zdravnik splošne medicine odgovarja na elektronsko pošto v roku ene ure. ', specializacija: "splošni zdravnik", izvajanje: "javno", poslovalnica: "Ulica Staneta Severja 1", lokacija:"Maribor"},
       /*11*/ { ime: 'Nastja', priimek: 'Drobnič', email: 'nastja.drob@gmail.com', telefon: '070173987', cas: 'Torek - Sobota, 12:00 - 19:00', prosto: 18, opis: 'Starejša zdravnica, ki se spozna na svoje delo in sprejema paciente vseh starosti', specializacija: "splošni zdravnik", izvajanje: "zasebno", poslovalnica: "Pod skalo 8", lokacija:"Bled"},
       //zobozdravniki
       /*12*/ { ime: 'Nik', priimek: 'Žito', email: 'nik.zito@gmail.com', telefon: '070304567', cas: 'Ponedeljek - Sobota, 12:00 - 18:00', prosto: 2, opis: 'Mlad in nadobuden zobozdravnik, na voljo 6 dni na teden.', specializacija: "zobozdravnik", izvajanje: "javno", poslovalnica: "Cesta v Vintgar 4a", lokacija:"Bled"},
       /*13*/ { ime: 'Matevž', priimek: 'Vodopivec', email: 'matevz.vodopivec@gmail.com', telefon: '040168264', cas: 'Ponedeljek - Četrtek, 7:00 - 14:00', prosto: 12, opis: 'Prijazen in nežen zobozdravnik. Nič se ne bojte, on ve kaj dela.', specializacija: "zobozdravnik", izvajanje: "zasebno", poslovalnica: "Ulica Lackove čete 20", lokacija: "Ptuj"},
       /*14*/ { ime: 'Jan', priimek: 'Marolt', email: 'jan.marolt@gmail.com', telefon: '040174987', cas: 'Sreda - Sobota, 10:00 - 16:00', prosto: 4, opis: 'Dr. Jan Marolt, je mlad zobozdravnik z modernim načinom zdravstvene oskrbe, h kateremu se stranke ženskega spola rade vračajo.', specializacija: "zobozdravnik", izvajanje: "javno", poslovalnica: "Liškova ulica 21", lokacija:"Murska Sobota"},
       //ginekologi
       /*15*/ { ime: 'Mirko', priimek: 'Štopl', email: 'mirko.stopl@gmail.com', telefon: '031146752', cas: 'Torek - Petek, 9:00 - 14:00', prosto: 7, opis: 'Najpomembnejši ženski zdravnik, ki zagotovavlja strokovno zdravstveno oskrbo z uporabo sodobnih diagnostičnih metod', specializacija: "ginekolog", izvajanje: "zasebno", poslovalnica: "Alpska cesta 3", lokacija:"Bled"},
       /*16*/ { ime: 'Sara', priimek: 'Hauptman', email: 'sara.hauptman@gmail.com', telefon: '041375693', cas: 'Četrtek - Nedelja, 10:00 - 18:00', prosto: 10, opis: 'Ginekologinja, na voljo praktično celi vikend, ki pozna odgovore na vsa vprašanja v zvezi z nosečnostjo in procesom okrevanja.', specializacija: "ginekolog", izvajanje: "javno", poslovalnica: "Resslova ulica 7b", lokacija:"Novo Mesto"},
       /*17*/ { ime: 'Ahmet', priimek: 'Bageta', email: 'ahmi.bagueta@gmail.com', telefon: '040069420', cas: 'Nedelja, 10:00 - 10:30', prosto: 10, opis: 'Kljub temu, da je ginekolog Ahmet moškega spola, je vreden zaupanja.', specializacija: "ginekolog", izvajanje: "javno", poslovalnica: "Ljubljanska ulica 61", lokacija: "Maribor"},
       //ortodonti
       /*18*/ { ime: 'Saša', priimek: 'Horvat', email: 'sasa.horvat1@gmail.com', telefon: '041776557', cas: 'Ponedeljek - Četrtek, 7:00 - 17:00', prosto: 2, opis: 'Zasebna specialistka usposobljena za prepoznavanje in zdravljenje bolezenskih sprememb zob, dlesni, ustne sluznice, ustne votline in jezika.', specializacija: "ortodont", izvajanje: "zasebno", poslovalnica: "Lepa pot 5", lokacija:"Celje"},
       /*19*/ { ime: 'Rok', priimek: 'Belouš', email: 'rok.belous@gmail.com', telefon: '040741632', cas: 'Sreda - Sobota, 9:00 - 17:00', prosto: 9, opis: 'Ortodont, ki poskrbi, da so vaši zobje na svojem najvišjem potencialu, ne glede na vašo starost.', specializacija: "ortodont", izvajanje: "javno", poslovalnica: "Kampolin 50", lokacija:"Portorož"},
       /*20*/ { ime: 'Nastja', priimek: 'Vidmar', email: 'nastja.vidmar@gmail.com', telefon: '030615891', cas: 'Ponedeljek - Petek, 7:00 - 13:00', prosto: 18, opis: 'Zdravnica z vrsto let izkušenj!', specializacija: "ortodont", izvajanje: "javno", poslovalnica: "Velika Cikava 13", lokacija:"Novo Mesto"},
       /*21*/ { ime: 'Sara', priimek: 'Mencigar', email: 'sara.mencigar@gmail.com', telefon: '070328965', cas: 'Ponedeljek - Sobota, 9:00 - 12:00', prosto: 7, opis: 'Specialistka dr. Mencigar ima zelo napredne naprave, ki vas bodo z veseljem pričakale.', specializacija: "ortodont", izvajanje: "zasebno", poslovalnica: "Ulica arhitekta Novaka 13", lokacija:"Murska Sobota"},
    ]

    const ocenjevanja = [
       //okulisti
       /*1*/ { ocena: 8, vsebina_komentarja: 'ugotovil sem da rabim očala', datum_cas_ocene: '1.9.2021, 16:08:24', preverjena_ocena: 0, zdravnik_id: 1, uporabnik_id: 1},
       /*1*/ { ocena: 10, vsebina_komentarja: 'Najboljša okulistka v mariboru', datum_cas_ocene: '18.5.2022, 13:21:39', preverjena_ocena: 1, zdravnik_id: 1, uporabnik_id: 2},
       /*2*/ { ocena: 10, vsebina_komentarja: 'odkar sem obiskala davida, lahko vidim', datum_cas_ocene: '15.12.2021, 23:58:34', preverjena_ocena: 1, zdravnik_id: 2, uporabnik_id: 3},
       /*2*/ { ocena: 6, vsebina_komentarja: 'vse črke sem vidla pa mi je vseeno hoto prodat očala', datum_cas_ocene: '28.2.2022, 19:23:46', preverjena_ocena: 0, zdravnik_id: 2, uporabnik_id: 4},
       /*3*/ { ocena: 5, vsebina_komentarja: 'dioptrijo rabim :((', datum_cas_ocene: '1.3.2022, 9:36:22', preverjena_ocena: 1, zdravnik_id: 3, uporabnik_id: 5},
       /*3*/ { ocena: 7, vsebina_komentarja: 'ni mi dovolila laserske operacije ampak pa sej je dobra', datum_cas_ocene: '21.5.2022, 19:28:29', preverjena_ocena: 1, zdravnik_id: 3, uporabnik_id: 6},
       //dermatologi
       /*4*/ { ocena: 10, vsebina_komentarja: 'res se vidi da je najboljša', datum_cas_ocene: '28.3.2022, 10:11:29', preverjena_ocena: 1, zdravnik_id: 4, uporabnik_id: 7},
       /*4*/ { ocena: 9, vsebina_komentarja: 'mozolje ma', datum_cas_ocene: '5.5.2022, 7:21:39', preverjena_ocena: 0, zdravnik_id: 4, uporabnik_id: 8},
       /*5*/ { ocena: 4, vsebina_komentarja: 'predhodno se moreš naročit po telefonu !!! >:(', datum_cas_ocene: '30.3.2022, 8:19:54', preverjena_ocena: 1, zdravnik_id: 5, uporabnik_id: 9},
       /*5*/ { ocena: 6, vsebina_komentarja: 'lahko bi bila bolj prijazna', datum_cas_ocene: '28.4.2022, 10:29:19', preverjena_ocena: 1, zdravnik_id: 5, uporabnik_id: 10},
       /*6*/ { ocena: 10, vsebina_komentarja: 'priporočam ker ma lepega sina ;)', datum_cas_ocene: '6.4.2022, 9:31:29', preverjena_ocena: 0, zdravnik_id: 6, uporabnik_id: 11},
       /*6*/ { ocena: 10, vsebina_komentarja: 'dobre kremice mi je dal tak da 10/10 ', datum_cas_ocene: '15.3.2022, 12:12:12', preverjena_ocena: 1, zdravnik_id: 6, uporabnik_id: 12},
       //splosni
       /*7*/ { ocena: 9, vsebina_komentarja: 'fajn zdravnica, sprejela še mojo ženo', datum_cas_ocene: '13.1.2022, 13:48:44', preverjena_ocena: 1, zdravnik_id: 7, uporabnik_id: 13},
       /*7*/ { ocena: 10, vsebina_komentarja: 'ful dobra zdravnica, mama mi jo je predlagala in mi je všeč.', datum_cas_ocene: '25.5.2022, 20:48:34', preverjena_ocena: 1, zdravnik_id: 7, uporabnik_id: 14},
       /*8*/ { ocena: 10, vsebina_komentarja: 'super zdravnica z internacionalnim znanjem', datum_cas_ocene: '13.5.2022, 13:28:44', preverjena_ocena: 1, zdravnik_id: 8, uporabnik_id: 3},
       /*8*/ { ocena: 7, vsebina_komentarja: 'Posvetila mi je le 10 min časa potem pa šla na malco', datum_cas_ocene: '9.5.2022, 19:56:34', preverjena_ocena: 1, zdravnik_id: 8, uporabnik_id: 4},
       /*9*/ { ocena: 6, vsebina_komentarja: 'Ful dolgo me je pustu čakat v čakalnici', datum_cas_ocene: '1.6.2022, 21:56:44', preverjena_ocena: 0, zdravnik_id: 9, uporabnik_id: 8},
       /*9*/ { ocena: 8, vsebina_komentarja: 'Kazal mi je svoje pokale', datum_cas_ocene: '3.3.2022, 9:22:34', preverjena_ocena: 1, zdravnik_id: 9, uporabnik_id: 15},
       //tarča
       /*10*/ { ocena: 10, vsebina_komentarja: 'On je najlepši od zdravnikov, želela sem dotikov, preveril bitje je srca. Jaz sem bolezen zaigrala, vse se mu zlagala, samo da skupaj sva bila.', datum_cas_ocene: '1.9.2021, 9:27:09', preverjena_ocena: 1, zdravnik_id: 10, uporabnik_id: 15},
       /*10*/ { ocena: 10, vsebina_komentarja: 'ful hitro odgovarja na maile', datum_cas_ocene: '27.1.2022, 15:17:25', preverjena_ocena: 1, zdravnik_id: 10, uporabnik_id: 1},
       /*10*/ { ocena: 7, vsebina_komentarja: 'Upam in verjamem, da so kje še zdravniki, ki znajo prisluhniti človeku :/', datum_cas_ocene: '2.2.2022, 16:39:17', preverjena_ocena: 0, zdravnik_id: 10, uporabnik_id: 3},
       /*10*/ { ocena: 9, vsebina_komentarja: 'Priskoči na pomoč še ponoči :)', datum_cas_ocene: '30.5.2022, 23:56:51', preverjena_ocena: 1, zdravnik_id: 10, uporabnik_id: 7},
       //tarča
       /*11*/ { ocena: 8, vsebina_komentarja: 'malo stara za zdravnico ampak ne morem rečt da ne zna', datum_cas_ocene: '11.12.2021, 19:13:20', preverjena_ocena: 1, zdravnik_id: 11, uporabnik_id: 2},
       /*11*/ { ocena: 4, vsebina_komentarja: 'govorila mi je o svojim problemih kot da sem jaz njena zdravnica', datum_cas_ocene: '30.4.2022, 9:01:12', preverjena_ocena: 0, zdravnik_id: 11, uporabnik_id: 3},
       //zobozdravniki
       /*12*/ { ocena: 10, vsebina_komentarja: 'z veseljem se vrnem k Niku!!', datum_cas_ocene: '7.10.2021, 12:59:39', preverjena_ocena: 1, zdravnik_id: 12, uporabnik_id: 4},
       /*12*/ { ocena: 8, vsebina_komentarja: 'Zobozdravnik je ampak nima lepih zob', datum_cas_ocene: '17.3.2022, 11:14:03', preverjena_ocena: 0, zdravnik_id: 12, uporabnik_id: 5},
       /*13*/ { ocena: 10, vsebina_komentarja: 'Zelo prijazen zobozdravnik, sploh me ni blo strah :)', datum_cas_ocene: '9.1.2022, 13:18:24', preverjena_ocena: 1, zdravnik_id: 13, uporabnik_id: 6},
       /*13*/ { ocena: 9, vsebina_komentarja: 'Dr. Matevž Vodopivec je zelo dober zobozdravnik po mojem mnenju. Ima vrsto let izkušenj, kar se opazi, spoštuje bonton, saj lepo poskrbi za svoje paciente. Lp, Barbara', preverjena_ocena: 1, datum_cas_ocene: '19.2.2022, 16:34:14', zdravnik_id: 13, uporabnik_id: 7},
       /*14*/ { ocena: 9, vsebina_komentarja: 'Kar moderen zdravnik.', datum_cas_ocene: '13.4.2022, 13:09:44', preverjena_ocena: 1, zdravnik_id: 14, uporabnik_id: 8},
       /*14*/ { ocena: 10, vsebina_komentarja: 'Tale Jan je pravi mačkon', datum_cas_ocene: '29.4.2022, 6:54:53', preverjena_ocena: 1, zdravnik_id: 14, uporabnik_id: 9},
       //ginekologi
       /*15*/ { ocena: 5, vsebina_komentarja: 'moski ginekolog', datum_cas_ocene: '12.11.2021, 20:37:11', preverjena_ocena: 1, zdravnik_id: 15, uporabnik_id: 10},
       /*15*/ { ocena: 9, vsebina_komentarja: 'Profesionalen.', datum_cas_ocene: '22.5.2022, 16:38:24', preverjena_ocena: 1, zdravnik_id: 15, uporabnik_id: 11},
       /*16*/ { ocena: 9, vsebina_komentarja: 'Po mojem mnenju je njen pristop zelo zanimiv in drugačen od drugih ginekologinj.', datum_cas_ocene: '7.5.2022, 12:00:39', preverjena_ocena: 1, zdravnik_id: 16, uporabnik_id: 12},  
       /*16*/ { ocena: 10, vsebina_komentarja: 'Zagotavljala je super storitve in to celo v nedeljo popoldan!!', datum_cas_ocene: '22.1.2022, 21:48:13', preverjena_ocena: 1, zdravnik_id: 16, uporabnik_id: 13},
       /*17*/ { ocena: 10, vsebina_komentarja: 'Najboljši ginekolog v mestu in tudi tiktoker', datum_cas_ocene: '7.4.2022, 11:31:21', preverjena_ocena: 0, zdravnik_id: 17, uporabnik_id: 14},
       /*17*/ { ocena: 9, vsebina_komentarja: 'Diskreten ginekolog.', datum_cas_ocene: '17.3.2022, 14:31:15', preverjena_ocena: 1, zdravnik_id: 17, uporabnik_id: 15},
       //ortodonti
       /*18*/ { ocena: 6, vsebina_komentarja: 'Kar drage storitve. Dr. Hercog ponuja enako kvalitetne storitve za pol cene.', datum_cas_ocene: '23.3.2022, 8:36:22', preverjena_ocena: 1, zdravnik_id: 18, uporabnik_id: 1},
       /*18*/ { ocena: 10, vsebina_komentarja: 'Takoj sem dobla aparat!! Drugje bi morala kar dolgo čakati.', datum_cas_ocene: '23.4.2022, 18:38:28', preverjena_ocena: 1, zdravnik_id: 18, uporabnik_id: 2},
       /*19*/ { ocena: 10, vsebina_komentarja: 'najboljsi ortodont, obozujem ga', datum_cas_ocene: '8.1.2022 21:48:19', preverjena_ocena: 1, zdravnik_id: 19, uporabnik_id: 3},
       /*19*/ { ocena: 3, vsebina_komentarja: 'Čakalna vrsta 4 leta! Kaj vi nočete da dobim aparat??', datum_cas_ocene: '7.5.2022, 12:00:39', preverjena_ocena: 0, zdravnik_id: 19, uporabnik_id: 4},
       /*20*/ { ocena: 10, vsebina_komentarja: 'takoj pridem na vrsto', datum_cas_ocene: '1.9.2021, 9:27:01', preverjena_ocena: 1, zdravnik_id: 20, uporabnik_id: 5},
       /*20*/ { ocena: 4, vsebina_komentarja: 'Dala mi je aparat za okoli glave??', datum_cas_ocene: '11.2.2022, 19:18:53', preverjena_ocena: 0, zdravnik_id: 20, uporabnik_id: 6},
       /*21*/ { ocena: 9, vsebina_komentarja: 'Nisem še videl tak naprednih aparatov za slikanje zob', datum_cas_ocene: '19.12.2021, 18:25:17', preverjena_ocena: 1, zdravnik_id: 21, uporabnik_id: 9},
       /*21*/ { ocena: 10, vsebina_komentarja: 'Konec :) Lp, zdravnice', datum_cas_ocene: '28.4.2022, 10:48:27', preverjena_ocena: 1, zdravnik_id: 21, uporabnik_id: 11},
    ]


// VSTAVI PODATKE
    await knex('uporabnik').insert(uporabniki)
    .then(() => console.log("Uporabniki vstavljeni"))
    .catch((err) => {console.log(err); throw err});

    await knex('zdravnik').insert(zdravniki)
    .then(() => console.log("zdravniki vstavljeni"))
    .catch((err) => {console.log(err); throw err});

    await knex('ocenjevanje').insert(ocenjevanja)
    .then(() => console.log("Ocenjevanja vstavljena"))
    .catch((err) => {console.log(err); throw err});

    //prekini povezavo z bazo
    knex.destroy(); 
}

napolniBazo(); //klici funkcijo