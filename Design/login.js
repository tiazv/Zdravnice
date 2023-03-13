function prijaviUporabnika(){
    event.preventDefault();

    obrazec = document.getElementById('prijavniObrazec');
    const data = new URLSearchParams(new FormData(obrazec));

    fetch('http://localhost:3000/prijava', {method: 'POST', body:data })
    .then((odgovor) => {return odgovor.json();})
    .then((odgovor) => {
        console.log(odgovor);

        if (odgovor.status !== "OK"){
            informacije = document.getElementById("informacije");
            informacije.innerHTML = odgovor.status;
            informacije.style = "display: block;";
        } else {
            sessionStorage.setItem('prijavljen', JSON.stringify(odgovor.uporabnik));
            window.location.href = 'zdravnik.html'; 
        }
        
    });
};

function registracija(){
    event.preventDefault();

    obrazec = document.getElementById('reg');
    const data = new URLSearchParams(new FormData(obrazec));

    fetch('http://localhost:3000/registriraj', {method: 'POST', body:data })
    .then((odgovor) => {return odgovor.json();})
    .then((odgovor) => {
        console.log(odgovor);

        if (odgovor.status !== "OK"){
            informacija = document.getElementById("informacija");
            informacija.innerHTML = odgovor.status;
            informacija.style = "display: block;";
        } else {
            sessionStorage.setItem('prijavljen', JSON.stringify(odgovor.uporabnik));
            window.location.href = 'uspesnaReg.html';
        }
        
    });

}