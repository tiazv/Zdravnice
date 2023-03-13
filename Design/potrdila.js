function tabelaPotrdil() {
    fetch('http://localhost:3000/ocenjevanje', {method: 'GET'})
    .then((odgovor) => {return odgovor.json();})
    .then((ocenjevanje) => {
        console.log(ocenjevanje);
        
        for(let i=0; i<ocenjevanje.length; i++){
            if(ocenjevanje[i].nalozeno_dokazilo != null && ocenjevanje[i].preverjena_ocena == null){
                let tabela = document.getElementById("tabela");
                let vrstica = tabela.insertRow();
                vrstica.innerHTML = `<form method="get" id="forma${i}" action="http://localhost:3000/preveriKomentar"></form>
                                    <input type="hidden" form="forma${i}" name="ocena" id="ocena${i}" value="" />
                                    <input type="hidden" form="forma${i}" name="stOcene" id="stOcene${i}" value="" />
                                    <input type="hidden" form="forma${i}" name="komentar" id="komentar${i}" value="" />
                                    <input type="hidden" form="forma${i}" name="cas" id="cas${i}" value="" />
                                    <input type="hidden" form="forma${i}" name="zdravnik" id="zdravnik${i}" value="" />
                                    <input type="hidden" form="forma${i}" name="uporabnik" id="uporabnik${i}" value="" />
                
                                    <td>${ocenjevanje[i].uporabnik_id}</td>
                                    <td>${ocenjevanje[i].vsebina_komentarja}</td>
                                    <td><img class="slike" src="data:image/jpg;base64,${ocenjevanje[i].nalozeno_dokazilo}"></td>
                                    <td><input class="btn btn-success" type="submit" name="prvi" form="forma${i}" value="✔"/></td>
                                    <td><input class="btn btn-danger" type="submit" name="drugi" form="forma${i}" value="✘"/></td>`;

                    let ocena = document.getElementById(`ocena${i}`);
                    ocena.value = ocenjevanje[i].id_ocena;
                    let stocena = document.getElementById(`stOcene${i}`);
                    stocena.value = ocenjevanje[i].ocena;
                    let komentar = document.getElementById(`komentar${i}`);
                    komentar.value = ocenjevanje[i].vsebina_komentarja;
                    let cas = document.getElementById(`cas${i}`);
                    cas.value = ocenjevanje[i].datum_cas_ocene;
                    let zdravnik = document.getElementById(`zdravnik${i}`);
                    zdravnik.value = ocenjevanje[i].zdravnik_id;
                    

                    console.log(ocena.value);
                    console.log(ocenjevanje[i].id_ocena);
            }
            //if(ocenjevanje[i].nalozeno_dokazilo != null && ocenjevanje[i].preverjena_ocena == null)
        }
    })
}



///                                     <input type="hidden" form="forma${i}" name="dokazilo" id="dokazilo${i}/>
/*
                    let dokazilo = document.getElementById(`dokazilo${i}`);
                    dokazilo.value = ocenjevanje[i].nalozeno_dokazilo;
*/