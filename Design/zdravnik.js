//const { divide } = require("lodash");

function load() {

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    console.log(prijavljen);

    if(prijavljen == null){
        document.getElementById('je_prijavljen').style = "display: none;"
    } else {
        document.getElementById('ni_prijavljen').style = "display: none;";
        document.getElementById('login').style = "display: none;";
        document.getElementById('registracija').style = "display: none;";
        document.getElementById('login2').style = "display: none;";
        document.getElementById('registracija2').style = "display: none;";
        document.getElementById('profil').style = "display: show;";
        //document.getElementById('gesloUrejaj').style = "display: none;";
        //document.getElementById('imeGesla').style = "display: none;";
        /*document.getElementById('ime_uporabnika').innerHTML = prijavljen.ime;*/
    }

}

function loadAdmin() {

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    console.log(prijavljen);
    
    if(prijavljen == null){
        document.getElementById('je_prijavljen').style = "display: none;";
        document.getElementById('preveri').style = "display: none;";
        document.getElementById('preveri2').style = "display: none;";

    } else if(prijavljen.admin === 1) {
        
        document.getElementById('gumbVnesi').style = "display: show;";
        document.getElementById('gumbUredi').style = "display: show;";
        document.getElementById('gumbIzbrisi').style = "display: show;";

        document.getElementById('gumb_admina').style = "display: block;";

    } else if(prijavljen.admin === 0) {
        document.getElementById('preveri').style = "display: none;";
        document.getElementById('preveri2').style = "display: none;";
    }
}


function poisciZdravnika() {
    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    console.log(prijavljen);

    if(prijavljen == null){
        document.getElementById('je_prijavljen').style = "display: none;";
    } else {
        document.getElementById('ni_prijavljen').style = "display: none;";
        document.getElementById('login').style = "display: none;";
        document.getElementById('registracija').style = "display: none;";
        /*document.getElementById('ime_uporabnika').innerHTML = prijavljen.ime;*/
    }


    fetch('http://localhost:3000/zdravnik', {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((zdravnik) => {
        for(let i=0; i<zdravnik.length; i++){
            const sec = document.getElementById("rezultat");
            sec.insertAdjacentHTML('beforeend', `<div class="bg-white py-2 px-2 text-dark box mb-3">
            <a style="font-size: 20px;" href="ocena_posameznika.html?id_zdravnik=${zdravnik[i].id_zdravnik}">
                ${zdravnik[i].ime} ${zdravnik[i].priimek}</a>
            <ul>
                <li><b>SPECIALIZACIJA: </b>${zdravnik[i].specializacija}</li>
                <li><b>IZVAJANJE: </b>${zdravnik[i].izvajanje}</li>
                <li><b>NASLOV: </b>${zdravnik[i].poslovalnica}</li>
                <li><b>LOKACIJA: </b>${zdravnik[i].lokacija}</li>
                <li><b>OBRATOVALNI ČAS: </b>${zdravnik[i].cas}</br></li>
                <li><b>ŠT. PROSTIH MEST: </b>${zdravnik[i].prosto}</li>
                <li><b>OCENA: </b><span id="ocenaZ${i+1}"> </span></li>
            </ul>
                                </div>`);
    }
    });
};


function ocene() {
    fetch('http://localhost:3000/zdravnik', {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((zdravnik) => {
        for (let j=1; j<zdravnik.length+1; j++){
            fetch(`http://localhost:3000/ocenjevanje/${j}`, {method: 'GET'})
            .then((odgovor) => {return odgovor.json();})
            .then((ocenjevanje => {
                let sestevek_ocen = 0;
                for(let i=0; i<ocenjevanje.length; i++){
                    sestevek_ocen = sestevek_ocen + ocenjevanje[i].ocena;
                    document.getElementById(`ocenaZ${j}`).innerHTML = (sestevek_ocen/ocenjevanje.length).toFixed(1) + "/10";
            }}))
    }
    })
}



function odjavi(){
    sessionStorage.clear();
    window.location.href = "login.html";
};

function naloziZdravnike() {
    fetch('http://localhost:3000/zdravnik', {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((zdravnik) => {
        let tabela = document.getElementById("tabelaZdravnikov");
        tabela.innerHTML = `
        <tr>
            <th></th>
        </tr>
        `;

        for (let i=0; i<zdravnik.length; i++){
            let vrstica = tabela.insertRow();
            for (const lastnost in zdravnik[i]){
                if (lastnost === 'ime' && 'priimek'){
                    let polje = vrstica.insertCell();
                    polje.innerHTML = `<a href = "ocena_posameznika.html?id_zdravnik=${zdravnik[i].id_zdravnik}">
                        ${zdravnik[i].ime} ${zdravnik[i].priimek}</a><hr>`;
                }
            }
        }
    });
}




