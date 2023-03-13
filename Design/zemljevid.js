var map = L.map('map').setView([46.10, 15], 8);

L.tileLayer('http://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=iHuopAhfaaX4rBWjfejb', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

function dolociLokacijo(){
    fetch(`http://localhost:3000/zdravnik`, {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((zdravnik) => {
        for (let i = 0; i < zdravnik.length; i++){
            console.log(zdravnik[i].poslovalnica, zdravnik[i].lokacija);
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${zdravnik[i].poslovalnica, zdravnik[i].lokacija}`, {method: 'GET', headers:{Accept: 'application/json','Content-Type': 'application/json'}})
            .then((odgovor) => {return odgovor.json();
            })
            .then((nekaLokacija) => {
                let izbrana = nekaLokacija[0];
                console.log(izbrana);
                L.marker([izbrana.lat, izbrana.lon]).addTo(map);
                map.setView([izbrana.lat, izbrana.lon], 13);

                //popup
                L.marker([izbrana.lat, izbrana.lon]).addTo(map)
                .bindPopup(zdravnik[i].poslovalnica, zdravnik[i].lokacija)//??
                .openPopup();
                //ne vem če dela popup
            });
            }
    });
    ///
    /*
    try{
        let nekaLokacija = "Slovenska ulica 5 maribor";
        console.log(nekaLokacija);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${nekaLokacija}`, {method: 'GET', headers:{Accept: 'application/json','Content-Type': 'application/json'}})
        .then((odgovor) => {return odgovor.json();
        })
        .then((nekaLokacija) => {
            let izbrana = nekaLokacija[0];
            console.log(izbrana);
            L.marker([izbrana.lat, izbrana.lon]).addTo(map);
            map.setView([izbrana.lat, izbrana.lon], 13);

        });
    } catch (e) {
        console.log(e);
    }*/

/*
    fetch(`http://nominatim.openstreetmap.org/search?format=json&q=${lokacije}`)
    .then(odgovor => { return odgovor.json(); })
    .then((lokacije) => {
         console.log(lokacije[0]);
    });

    //     for (let i = 0; i < zdravniki.length; i++){
    //         let lokacije = 1;
    //     }
    */
}

function dolociLokacijo1(){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_zdravnik");

    fetch(`http://localhost:3000/en_zdravnik/${id}`, {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((en_zdravnik) => {
        console.log(en_zdravnik);
        console.log(en_zdravnik.poslovalnica);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${en_zdravnik.poslovalnica}`, {method: 'GET', headers:{Accept: 'application/json','Content-Type': 'application/json'}})
        .then((odgovor) => {return odgovor.json();
        })
        .then((nekaLokacija) => {
            let izbrana = nekaLokacija[0];
            console.log(izbrana);
            L.marker([izbrana.lat, izbrana.lon]).addTo(map);
            map.setView([izbrana.lat, izbrana.lon], 13);

            //popup
            L.marker([izbrana.lat, izbrana.lon]).addTo(map)
            .bindPopup(en_zdravnik.poslovalnica)
            .openPopup();
            //ne vem če dela popup

        });
           
    });
}