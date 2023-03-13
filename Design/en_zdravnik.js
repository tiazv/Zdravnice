function naloziZdravnika() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_zdravnik");
    console.log("blabla"+ id);

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));

    if(prijavljen != null){
        
    fetch(`http://localhost:3000/en_zdravnik/${id}`, {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((en_zdravnik) => {
        let span_ime = document.getElementById("ime")
        span_ime.innerHTML = en_zdravnik.ime;
        let span_priimek = document.getElementById("priimek")
        span_priimek.innerHTML = en_zdravnik.priimek;
        let h4_specializacija = document.getElementById("specializacijaPosamezni")
        h4_specializacija.innerHTML = en_zdravnik.specializacija;
        let h5_opis = document.getElementById("opisPosamezni")
        h5_opis.innerHTML = en_zdravnik.opis;
        let h5_izvajanje = document.getElementById("izvajanjePosamezni")
        h5_izvajanje.innerHTML = en_zdravnik.izvajanje;
        let h5_cas = document.getElementById("casPosamezni")
        h5_cas.innerHTML = en_zdravnik.cas;
        let h5_naslov = document.getElementById("poslovalnicaPosamezni")
        h5_naslov.innerHTML = en_zdravnik.poslovalnica;
        let h5_lokacija = document.getElementById("lokacijaPosamezni")
        h5_lokacija.innerHTML = en_zdravnik.lokacija;
        let h5_prosto = document.getElementById("prostoPosamezni")
        h5_prosto.innerHTML = en_zdravnik.prosto; 
        let h5_email = document.getElementById("emailPosamezni")
        h5_email.innerHTML = en_zdravnik.email;
        let h5_telefon = document.getElementById("telefonPosamezni")
        h5_telefon.innerHTML = en_zdravnik.telefon;
    });
    }
    else{
        window.location.href = "login.html";
    }
    let zdravnik = document.getElementById("zdravnik_id")
    zdravnik.value = id;
    let uporabnik = document.getElementById("uporabnik_id")
    console.log(prijavljen);
    uporabnik.value = prijavljen.id_uporabnik;
}


function naloziOcenjevanje() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_zdravnik");
    console.log(id);

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    //console.log(document.getElementsByClassName('gumb'));
    let jeAdmin = 'inline';
    if (prijavljen.admin !== 1){
        jeAdmin = 'none';
    }

//ne brisi Rebeka!!!
    document.getElementById("gumbUredi").href = `http://127.0.0.1:5500/Design/uredi_zdravnika.html?id_zdravnik=${id}`; 


    fetch(`http://localhost:3000/ocenjevanje/${id}`, {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((ocenjevanje) => {
        console.log(ocenjevanje);
        let sestevek_ocen=0;

        for(let i=0; i<ocenjevanje.length; i++){
            sestevek_ocen = sestevek_ocen + ocenjevanje[i].ocena;

            const sec = document.getElementById("oseba");
            sec.insertAdjacentHTML('beforeend', `
            <div class="media" id="komentar${i}">
            <div class="media-body">
                <div>
                <div class="cajt"><span id="cas">${ocenjevanje[i].datum_cas_ocene}</span></div>
                    <div class='chead'>
                        <div class='name'>
                        Komentiral/a:
                        <span id="stranka">${ocenjevanje[i].uporabnik_id}</span><span id="preveri${i}" style="float: right">Preverjen komentar: <span id="preveri1${i}"></span></span></div>
                    </div>
                    <div id ='vsebina_komentarja'class='text'>${ocenjevanje[i].vsebina_komentarja}</div>
                </div>
                <form action="http://localhost:3000/izbrisi/${ocenjevanje[i].id_ocena}" method="get">
                <input type="hidden" value="${ocenjevanje[i].zdravnik_id}" name="zdravnik"/>
                <input class="btn btn-danger gumb_admina" style="margin-bottom: 10px; display:${jeAdmin};" type="submit" value="Izbriši" name="id_ocena "/>
                </form>
            </div>
            </div> 
            `); 
            // sem (med praznino divov)
        const pec = document.getElementById("ocena");
        pec.innerHTML= (sestevek_ocen / ocenjevanje.length).toFixed(1)+ "/10";
        const lec = document.getElementById("stOcen");
        lec.innerHTML= ocenjevanje.length;

        if (ocenjevanje[i].preverjena_ocena == 1){
            document.getElementById("preveri1"+i).append("✔");
            document.getElementById("preveri1"+i).style.color="#00ba00";
        }
        if (ocenjevanje[i].preverjena_ocena == null || ocenjevanje[i].preverjena_ocena == 0){
            document.getElementById("preveri1"+i).append("✘");
            document.getElementById("preveri1"+i).style.color="#df0000";
        }
        }

    });
    
}

function izbrisi(i){
    /*const komentar = JSON.parse(sessionStorage.getItem('komentar'));
    console.log(komentar);
    sessionStorage*/
    document.getElementById('komentar'+i).style = "display: none;";
}



//-------------------------urejanje zdravnikov in uporabnikov----------------------------------------
function urediZdravnika() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_zdravnik");
    console.log(id);

        fetch(`http://localhost:3000/pridobizdravnika/${id}`, {method: 'GET'})
        .then((odgovor) => {return odgovor.json();})
        .then((en_zdravnik) => {
            console.log(en_zdravnik);
            let span_id = document.getElementById("idUredi") 
            span_id.value = en_zdravnik.id_zdravnik;
            let span_ime = document.getElementById("imeUredi") 
            span_ime.value = en_zdravnik.ime;
            let span_priimek = document.getElementById("priimekUredi")
            span_priimek.value = en_zdravnik.priimek;
            let span_email = document.getElementById("emailUredi")
            span_email.value = en_zdravnik.email;
            let span_telefon = document.getElementById("telefonUredi")
            span_telefon.value = en_zdravnik.telefon;
            let span_cas = document.getElementById("casUredi")
            span_cas.value = en_zdravnik.cas;
            let span_prosto = document.getElementById("prostoUredi")
            span_prosto.value = en_zdravnik.prosto;
            let span_opis = document.getElementById("opisUredi")
            span_opis.value = en_zdravnik.opis;
            let span_specializacija = document.getElementById("specializacijaUredi")
            span_specializacija.value = en_zdravnik.specializacija;
            let span_izvajanje = document.getElementById("izvajanjeUredi")
            span_izvajanje.value = en_zdravnik.izvajanje;
            let span_poslovalnica = document.getElementById("poslovalnicaUredi")
            span_poslovalnica.value = en_zdravnik.poslovalnica;
            let span_lokacija = document.getElementById("lokacijaUredi")
            span_lokacija.value = en_zdravnik.lokacija;
        });
}


function izbrisiZdravnika() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_zdravnik");    

    fetch(`http://localhost:3000/izbrisizdravnika/${id}`, {method: 'get'})
    .then(fdhf => {
        window.location.href = "/Design/uspesen_izbris.html";
    });
}


function urediUporabnika() {
    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
        console.log("prijavljen je: " + prijavljen.id_uporabnik);
        var id = prijavljen.id_uporabnik;

        fetch(`http://localhost:3000/pridobiuporabnika/${id}`, {method: 'GET'})
        .then((odgovor) => {return odgovor.json();})
        .then((en_uporabnik) => {
            console.log(prijavljen);
            let span_id = document.getElementById("idUrejaj") 
            span_id.value = en_uporabnik.id_uporabnik;
            let span_ime = document.getElementById("imeUrejaj") 
            span_ime.value = en_uporabnik.ime;
            let span_priimek = document.getElementById("priimekUrejaj")
            span_priimek.value = en_uporabnik.priimek;
            let span_upime = document.getElementById("upimeUrejaj")
            span_upime.value = en_uporabnik.uporabnisko_ime;
            let span_email = document.getElementById("emailUrejaj")
            span_email.value = en_uporabnik.email;
            //let span_geslo = document.getElementById("gesloUrejaj")
            //span_geslo.value = en_uporabnik.geslo;

           sessionStorage.setItem('prijavljen', JSON.stringify(en_uporabnik));

        });
    
}

function slika(){
    document.getElementById("komentar").disabled=true;

    document.getElementById("nalozeno_dokazilo").addEventListener("click", sprememba);
    
    function sprememba(){
        var slika = document.getElementById("nalozeno_dokazilo");
    
        if(slika != null){
            document.getElementById("komentar").disabled=false;
        }
        else{
            document.getElementById("komentar").disabled=true;
        }
    }
}