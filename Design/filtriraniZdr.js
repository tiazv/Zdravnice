//const { divide } = require("lodash");

function filtriraj() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var specializacija=url.searchParams.get("specializacija");
    var lokacija = url.searchParams.get("lokacija");
    var ime = url.searchParams.get("ime");
    var izvajanje = url.searchParams.get("izvajanje");

    console.log(url);
    
    fetch(`http://localhost:3000/filtriraj?specializacija=${specializacija}&lokacija=${lokacija}&ime=${ime}&izvajanje=${izvajanje}`, {method: 'GET'})
    .then((odgovor) => { return odgovor.json();})
    .then((zdravnik) => {
        console.log(zdravnik);
        //if (specializacija=='nic' && ime == '' && lokacija=='nic' && izvajanje=='vseeno'){
            for(let i=0; i<zdravnik.length; i++){
                console.log(zdravnik[i]);
                const sec = document.getElementById("rezultat");
                
                sec.insertAdjacentHTML('beforeend', `<div class="bg-white py-2 px-2 text-dark box mb-3">
                <a style="font-size: 20px;" href="ocena_posameznika.html?id_zdravnik=${zdravnik[i].id_zdravnik}">
                ${zdravnik[i].ime} ${zdravnik[i].priimek}</a>
                <ul>
                    <li><b>SPECIALIZACIJA: </b>${zdravnik[i].specializacija}</li>
                    <li><b>IZVAJANJE: </b>${zdravnik[i].izvajanje}</li>
                    <li><b>LOKACIJA: </b>${zdravnik[i].lokacija}</li>
                    <li><b>OBRATOVALNI ČAS: </b>${zdravnik[i].cas}</br></li>
                    <li><b>ŠT. PROSTIH MEST: </b>${zdravnik[i].prosto}</li>
                    <li><b>OCENA: </b><span id="ocenaZ${i+1}"> </span></li>
                </ul>
                                    </div>`); 
    }
    } 
    );
}

function oceneF(){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var specializacija=url.searchParams.get("specializacija");
    var lokacija = url.searchParams.get("lokacija");
    var ime = url.searchParams.get("ime");
    var izvajanje = url.searchParams.get("izvajanje");

    console.log(url);
    
    fetch(`http://localhost:3000/filtriraj?specializacija=${specializacija}&lokacija=${lokacija}&ime=${ime}&izvajanje=${izvajanje}`, {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((zdravnik) => {
        for (let j=1; j<zdravnik.length+1; j++){
            console.log(zdravnik[j-1].id_zdravnik);
            fetch(`http://localhost:3000/ocenjevanje/${zdravnik[j-1].id_zdravnik}`, {method: 'GET'})
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