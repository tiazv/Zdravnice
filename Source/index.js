var express = require('express');
var app = require('express')();

app.use(express.urlencoded({extended:false}));

const cors = require("cors");
app.use(cors());

//------paket za hisiranje gesel
const bcrypt = require('bcryptjs');

//------PODATKOVNA BAZA------
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'geslo123',
        database: 'zdravnikisi'
    }
});


const bookshelf = require('bookshelf')(knex);
const fileUpload = require('express-fileUpload');
const { DATETIME } = require('mysql/lib/protocol/constants/types');
app.use(fileUpload());

var Uporabnik = bookshelf.Model.extend({
    tableName: 'uporabnik',
    idAttribute: 'id_uporabnik'
})
/*
var Specialzacija = bookshelf.Model.extend({
    tableName: 'specializacija',
    idAttribute: 'id'
})
var izvajanje = bookshelf.Model.extend({
    tableName: 'izvajanje',
    idAttribute: 'id'
})
var Poslovalnica = bookshelf.Model.extend({
    tableName: 'poslovalnica',
    idAttribute: 'id'
})
*/
var Zdravnik = bookshelf.Model.extend({
    tableName: 'zdravnik',
    idAttribute: 'id_zdravnik'
})
var Ocenjevanje = bookshelf.Model.extend({
    tableName: 'ocenjevanje',
    idAttribute: 'id_ocena'
})

//-------uporabniki
app.get('/uporabnik', async(req, res, next) => {
    try {
        let uporabniki = await new Uporabnik().fetchAll();
        res.json(uporabniki.toJSON()) //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
})


//-------zdravnik
app.get('/zdravnik', async(req, res, next) => {
    try {
        let zdravnik = await new Zdravnik().fetchAll();
        res.json(zdravnik.toJSON()) //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
})

//---------vse ocene oz. komentarji - potrebujemo za preverjanje istovetnosti
app.get('/ocenjevanje', async(req, res, next) =>{
    try {
        let ocene = await new Ocenjevanje().fetchAll();
        ocene = ocene.toJSON();
        for(let o in ocene){
            //console.log(ocene[o]);
            if (ocene[o].nalozeno_dokazilo != null && ocene[o].preverjena_ocena == null){
                ocene[o].nalozeno_dokazilo = Buffer.from(ocene[o].nalozeno_dokazilo, 'base64').toString('base64');
            }
        }
        
        for(let i=0; i<ocene.length; i=i+1){
            let uporabnik_id = ocene[i].uporabnik_id;
            let u = await new Uporabnik().where('id_uporabnik', uporabnik_id).fetch();
            ocene[i].uporabnik_id = u.toJSON().uporabnisko_ime;
        }
        
        res.json(ocene/*.toJSON()*/);
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
});

app.get('/preveriKomentar', async(req, res, next) => {
    console.log('potrdi: '+ req.query.prvi+ " ne: "+ req.query.drugi);
    console.log(req.query.uporabnik); //???
    if (req.query.prvi != null){
        console.log("potrjen");
        try {
            let preverjenKomentar = {
                id_ocena: req.query.ocena,
                preverjena_ocena: 1 //da 1 v bazo, če je potrjen komentar
                //teh zakomentiranih stvarih ne rabiš updateat
                //ocena: req.query.stOcene,
                //vsebina_komentarja: req.query.komentar,
                //datum_cas_ocene: req.query.cas,
                //zdravnik_id: req.query.zdravnik,
                //uporabnik_id: req.query.uporabnik
            };
            let komentar = await new Ocenjevanje().save(preverjenKomentar, {method: 'update'});
            console.log("ocene: " + komentar.toJSON());
            console.log(preverjenKomentar);
            res.redirect("http://127.0.0.1:5500/Design/preverjanjeIstovetnosti.html");
        } catch(error){
            console.log(error);
        }
    }
    else{
        console.log("ni potrjen");
        try {
            let preverjenKomentar = {
                id_ocena: req.query.ocena,
                preverjena_ocena: 0 //da 0 v bazo, če komentar ni potrjen
            };
            let komentar = await new Ocenjevanje().save(preverjenKomentar, {method: 'update'});
            console.log("ocene: " + komentar.toJSON());
            console.log(preverjenKomentar);
            res.redirect("http://127.0.0.1:5500/Design/preverjanjeIstovetnosti.html");
        } catch(error){
            console.log(error);
        }
    }
    
    //res.redirect("http://127.0.0.1:5500/Design/preverjanjeIstovetnosti.html");
})

//------- en zdravnik
app.get('/en_zdravnik/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        let en_zdravnik = await new Zdravnik().where('id_zdravnik', id).fetch();
        res.json(en_zdravnik.toJSON()) //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
})


//-------- ocenjevanje
app.get('/ocenjevanje/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        console.log("ID je", id);
        let ocenjevanje = await new Ocenjevanje().where('zdravnik_id', id).fetchAll();
        ocenjevanje = ocenjevanje.toJSON();
        for(let i=0; i<ocenjevanje.length; i=i+1){
            let uporabnik_id = ocenjevanje[i].uporabnik_id;
            let u = await new Uporabnik().where('id_uporabnik', uporabnik_id).fetch();
            ocenjevanje[i].uporabnik_id = u.toJSON().uporabnisko_ime;
        }

        res.json(ocenjevanje); //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
})


//--------dodaj zdravnika
app.get('/dodajzdravnika', async(req, res, next) => {
    try{
    let nov_zdravnik = {
        ime: req.query.ime,
        priimek: req.query.priimek,
        email: req.query.email,
        telefon: req.query.telefon,
        cas: req.query.cas,
        prosto: req.query.prosto,
        opis: req.query.opis,
        specializacija: req.query.specializacija,
        izvajanje: req.query.izvajanje,
        poslovalnica: req.query.poslovalnica,
        lokacija: req.query.lokacija
    };
        let zdravnik = await new Zdravnik().save(nov_zdravnik);
        console.log("zdravnik: " + zdravnik.toJSON());
        console.log(nov_zdravnik);
        //res.status(200).json(zdravnik.toJSON());
        res.redirect('http://127.0.0.1:5500/Design/uspesenVnos.html');
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})

//---------urejanje zdravnika
app.get('/uredizdravnika', async(req, res, next) => {
    try{
    let nov_zdravnik = {
        id_zdravnik: req.query.id_zdravnik,
        ime: req.query.ime,
        priimek: req.query.priimek,
        email: req.query.email,
        telefon: req.query.telefon,
        cas: req.query.cas,
        prosto: req.query.prosto,
        opis: req.query.opis,
        specializacija: req.query.specializacija,
        izvajanje: req.query.izvajanje,
        poslovalnica: req.query.poslovalnica,
        lokacija: req.query.lokacija
    };
        let zdravnik = await new Zdravnik().save(nov_zdravnik, {method: 'update'}); //to je vbistvu vse kaj uredi in update-a
        console.log("zdravnik: " + zdravnik.toJSON());
        console.log(nov_zdravnik);
        //res.status(200).json(zdravnik.toJSON());
        res.redirect('http://127.0.0.1:5500/Design/uspesno_urejanje.html');
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})


app.get('/pridobizdravnika/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        console.log("pridobim zdravnika id " + id);
        let en_zdravnik = await new Zdravnik().where('id_zdravnik', id).fetch();
        res.json(en_zdravnik.toJSON()) //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
})


//--------brisanje zdravnika
app.get('/izbrisizdravnika/:id_zdravnik', async(req, res) => {
    try{
        console.log(":(");
        const id = req.params.id_zdravnik;
        console.log(id);

        await new Zdravnik({id_zdravnik: id}).destroy();
        console.log("Zdravnik je izbrisan :)");
        res.status(200).json({ok:"ok"});
        //res.redirect('http://127.0.0.1:5500/Design/uspesen_izbris.html');
    } catch(error){
        res.status(500).json(error);
    }
})

app.get('/pridobiuporabnika/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        let en_uporabnik = await new Uporabnik().where('id_uporabnik', id).fetch();
        res.json(en_uporabnik.toJSON()) //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
})


app.get('/urediuporabnika/', async(req, res, next) => {
    try{
        const id = req.query.id_uporabnik;
        console.log(id);

        if(req.query.geslo == ""){
            let uporabnik = await new Uporabnik({id_uporabnik: id}).save({
                //id_uporabnik: req.query.id_uporabnik,
                ime: req.query.ime,
                priimek: req.query.priimek,
                uporabnisko_ime: req.query.upime,
                email: req.query.email,
            }, {patch: true});
            console.log("uporabnik: " + uporabnik.toJSON());
                        //res.status(200).json(uporabnik.toJSON());
            res.redirect('http://127.0.0.1:5500/Design/uspesno_urejanje.html');
            console.log(uporabnik);
        } else if (req.query.geslo != ""){

            let uporabnik = await new Uporabnik({id_uporabnik: id}).save({
                //id_uporabnik: req.query.id_uporabnik,
                ime: req.query.ime,
                priimek: req.query.priimek,
                uporabnisko_ime: req.query.upime,
                email: req.query.email,
                geslo:bcrypt.hashSync(req.query.geslo, 12) 
            }, {patch: true});
            console.log("uporabnik: " + uporabnik.toJSON());
            //res.status(200).json(uporabnik.toJSON());
            res.redirect('http://127.0.0.1:5500/Design/uspesen_moj_profil.html');
            console.log(uporabnik);
        }
            //uporabnik.geslo = bcrypt.hashSync(uporabnik.geslo, 12);
            //let uporabnik = await new Uporabnik().where('id_uporabnik', nov_uporabnik.id_uporabnik).save(nov_uporabnik, {method: 'update'});
        } catch(error){
            console.log(error);
            res.status(500).json(error);
        }
})


//------------- filtriranje
app.get('/filtriraj', async (req, res, next) =>{

    let specializacija1=req.query.specializacija;
    let lokacija1 = req.query.lokacija;
    let ime1 = req.query.ime;
    let izvajanje1 = req.query.izvajanje;
    console.log(specializacija1, lokacija1, ime1, izvajanje1); //to izpiše vredu
    console.log(ime1);

    let imeInPriimek; 
/*
    console.log(imeInPriimek);
    console.log(imeInPriimek[0]);*/
    
    try {
        //let zdravnik = await new Zdravnik().where('specializacija',specializacija).where('poslovalnica',lokacija).where('ime',ime).where('izvajanje',izvajanje).fetchAll();
        let zdravnik = await new Zdravnik().where((builder) => {
            if (specializacija1 != "nic")
                builder.where('specializacija', specializacija1);
            if (lokacija1 != "nic")
                builder.where('lokacija', lokacija1);
            if (izvajanje1 != "vseeno")
                builder.where('izvajanje', izvajanje1);
            if (ime1 != ""){
                for (let i = 0; i <ime1.length; i++){
                    if (ime1[i] == " "){
                        imeInPriimek = ime1.split(" ");
                        console.log(imeInPriimek);
                        console.log(imeInPriimek[0]);
                        builder.where('ime', imeInPriimek[0]).orWhere('priimek', imeInPriimek[1]).orWhere('ime', imeInPriimek[1]).orWhere('priimek', imeInPriimek[0]);
                        break;
                    }
                    else{
                        builder.where('ime', ime1).orWhere('priimek', ime1);
                    }
                }
            
                //builder.where('ime', imeInPriimek[0]).orWhere('priimek', imeInPriimek[1]).orWhere('ime', imeInPriimek[1]).orWhere('priimek', imeInPriimek[0]).orWhere('ime', ime1).orWhere('priimek', ime1);
            }
            }).fetchAll();

            res.json(zdravnik.toJSON());
        } catch(error){
            res.status(500).json(error);
        }
        
    //2. način - deluje samo če imaš vse parametre točno napisane
    // try {
    //     let result = await knex('zdravnik').where({
    //         specializacija: specializacija1,
    //         izvajanje:  izvajanje1,
    //         lokacija: lokacija1,
    //         ime: ime1
    //       });
    // console.log("dela");
    // console.log(result);
    // res.json(result);
    // } catch(error){
    //     res.status(500).json(error);
    // }
    
});

//--------- registracija
app.post('/registriraj', async (req, res, next) => {
    try { 
        if (req.body.geslo != req.body.geslo2){
            res.json({ status: "Gesli se ne ujemata!"});
            //res.status(400).send('Gesli se ne ujemata');
            //res.json({ status: "Napačno geslo!"});
        }
        else{
            res.json({ status:"OK"})
        }

        console.log("zaenkrat ok");
        let nov = {
            uporabnisko_ime: req.body.upime,
            email: req.body.email,    
            geslo: req.body.geslo,
            ime: req.body.ime,
            priimek: req.body.priimek,
        };
        
        //-----MODIFIKACIJA KODE - SIHRIRANJE GESEL------
        //console.log(nov.geslo);
        nov.geslo = bcrypt.hashSync(nov.geslo, 12);

        let uporabnik = await new Uporabnik().save(nov);
        
        //res.json(uporabnik.toJSON());
        //res.redirect('http://127.0.0.1:5500/Design/uspesenVnos.html');
        //res.redirect('http://127.0.0.1:5500/Design/uspesnaReg.html');
    } catch(error){
        res.status(500).json(error);
    }
});

//---------prijava
app.post('/prijava', async (req, res, next) => {
    try {
        let obstojec = {
            uporabnisko_ime: req.body.upime,
            geslo: req.body.geslo,
        };
        
        let uporabnik = await new Uporabnik().where('uporabnisko_ime', obstojec.uporabnisko_ime).fetch();
        pravilnoGeslo = bcrypt.compareSync(obstojec.geslo, uporabnik.toJSON().geslo);

        if(pravilnoGeslo){
            res.json({ status:"OK", uporabnik: uporabnik.toJSON() })
        }
        else{
            res.json({ status: "Napačno geslo!"});
        }
    } catch(error){
        res.json({status: "Uporabnik s tem uporabniškim imenom ne obstaja!"});
    }
});


app.post('/dodajOcenjevanje', async(req, res, next) => {
    try{
        datoteka= Buffer.from(req.files.nalozeno_dokazilo.data);

        var today = new Date().toLocaleString();

    let nov = {
        vsebina_komentarja: req.body.vsebina_komentarja,
        ocena: req.body.ocena,
        datum_cas_ocene: today,
        zdravnik_id: req.body.zdravnik_id,
        uporabnik_id: req.body.uporabnik_id,
        nalozeno_dokazilo: datoteka
    }

    let ocenjevanje = await new Ocenjevanje().save(nov);
    console.log("ocenjevanje: " + ocenjevanje.toJSON());
    //res.json(ocenjevanje.toJSON());
    console.log(ocenjevanje);
    res.redirect(`http://127.0.0.1:5500/Design/ocena_posameznika.html?id_zdravnik=${nov.zdravnik_id}`);
} catch(error){
    res.status(500).json(error);
}
});



//--------brisanje komentarja
app.get('/izbrisi/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        let nov_komentar = {
            id_ocena: id,
            vsebina_komentarja: "To je nezaželjena vsebina",
        };

        //let izbrisani_komentar = await new Ocenjevanje().where('id_ocena', id).fetch();
        //res.json(izbrisani_komentar.toJSON()) //to bo vrnilo


            let komentar = await new Ocenjevanje().where({'id_ocena': id }).save(nov_komentar, {method: 'update'}); //to je vbistvu vse kaj uredi in update-a
            console.log("komentar: " + komentar.toJSON());
            console.log(nov_komentar);
            //res.status(200).json(zdravnik.toJSON());

            res.redirect(`http://127.0.0.1:5500/Design/ocena_posameznika.html?id_zdravnik=${req.query.zdravnik}`);
    } catch(error){
        res.status(500).json(error);
    }
});

/*app.get('/izbrisi/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        let izbrisani_komentar = await new Ocenjevanje().where('id_ocena', id).fetch();
        res.json(izbrisani_komentar.toJSON()) //to bo vrnilo
    } catch(error){
        res.status(500).json(error);
    }
});

app.get('/izbrisikomentar', async(req, res, next) => {
    try{
    let nov_komentar = {
        vsebina_komentarja: req.query.vsebina_komentarja,
    };
        let komentar = await new Ocenjevanje().save(nov_komentar, {method: 'update'}); //to je vbistvu vse kaj uredi in update-a
        console.log("komentar: " + komentar.toJSON());
        console.log(nov_komentar);
        //res.status(200).json(zdravnik.toJSON());
        //res.redirect('http://127.0.0.1:5500/Design/uspesenVnos.html');
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})*/




//pusti na koncu
//----preizkusi ce dela streznik------
app.get('/', function(req, res){
    res.send("Hej zdravnice smo");
});

app.listen(3000);
