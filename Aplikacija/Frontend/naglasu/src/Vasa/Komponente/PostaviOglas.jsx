import React, { useState, useEffect, useContext } from "react";
import "./PostaviOglas.css";
import NavBarContext from "../../Uros/Contexts/NavBarContext";
import PopUpModal from '../../Veljko/LoginPage/PopUpModal';
import { useNavigate } from "react-router-dom";
const PostaviOglas = () => {
  let data=localStorage.getItem('userState');
  let id = null;
  let rola = null;
  if(data)
  {
    let parsedData = JSON.parse(data);
    id = parsedData.id;
    rola = parsedData.role;
  }
  
  let token = localStorage.getItem('token');
  const navigate =useNavigate();
  const[errorPop,setErrorPop]=useState();
  //state za cuvanje vrednosti inputa naziv oglasa
  //cuva string vrednost
  const [nazivOglasa, setNazivOglasa] = useState("");

  //state za cuvanje vrednosti inputa cena
  //cuva string vrednost potrebno parsovati za dobijanje numbera
  const [cena, setCena] = useState("");
//state za cuvanje vrednosti inputa kredita
  //cuva string vrednost potrebno parsovati za dobijanje numbera
  const [kredit, setKredit] = useState("0");
  //state za cuvanje vrednosti inputa kolicina
  //cuva string vrednost potrebno parsovati za dobijanje numbera
  const [kolicina, setKolicina] = useState("");
 
  //state za cuvanje vrednosti inputa lokacija
  //cuva string vrednost
  const [lokacija, setLokacija] = useState("");

  //state za cuvanje vrednosti selectovanog stanja iz select elementa
  //cuva string vrednost potrebno parsovati u number
  const [stanje, setStanje] = useState("nijeIzabrano");

  const [tipOglasa, setTipOglasa] = useState("nijeIzabrano");
  
    const [smerOglasa, setSmerOglasa] = useState("nijeIzabrano");
  
    const [prikazStanja, setPrikazStanja] = useState(true);
  //state za cuvanje vrednosti textarea opis
  //cuva string vrednost
  const [opis, setOpis] = useState("");

  //state za cuvanje vrednosti selectovane kategorije iz select elementa
  //cuva id kategorije u vidu string vrednosti koju je potrebno parsovati u number
  const [odabranaKategorija, setOdabranaKategorija] = useState("nijeIzabrana");
  
  //state za cuvanje svih kategorija koje povlacimo sa servera 
  const [kategorije, setKategorije] = useState([]);

  //state za cuvanje slika koje ubacujemo
  //cuva vrednost tipe FileList koji je niz objekata File koji imaju informacije o nazivu slike
  //datumu dodavanja, size, type
  const [files, setFiles] = useState(null);
  
  //state za conditional rendering
  const [slikeIzabrane, setSlikeIzabrane] = useState(false);

  //state za prikaz broja izabranih slika
  const [brIzabranihSlika, setBrIzabranihSlika] = useState(0);

  //fetch-om vracamo sve kategorije sa servera
  useEffect(() => {
  
    fetch("http://localhost:5105/Kategorija/VratiKategorije")
      .then((response) => response.json())
      .then(data => {
        setKategorije(data);
      })
      .catch((error) => {
        console.error("Greška prilikom dobijanja kategorija:", error);
      });
  }, []);
  const { navbarSetCollapsable } = useContext(NavBarContext)
    React.useEffect(() => {
        
        navbarSetCollapsable(false)
        return ()=>navbarSetCollapsable(true)
    }, [])

  //state za uzimanje odgovarajucih polja selectovane kategorije
  const [poljaKategorije, setPoljaKategorije] = useState(null);

  //funkcija koja na osnovu izabrane kategorije (njenog id-a) setuje gornji state
  function handlePoljaKategorije(id) {
    const kategorijaZaPolja = kategorije.filter(kategorija => kategorija.id === parseInt(id));
    //console.log(kategorijaZaPolja);
    setPoljaKategorije(id === 'nijeIzabrana' ? null : kategorijaZaPolja[0].polja);
  }

  //funkcija koja sva polja odredjene kategorije pretvara u niz objekata zbog renderovanja na stranicu
  function skupiPoljaKategorije() {
    let retValue = [];
    for(const polje in poljaKategorije) {
      if(poljaKategorije.hasOwnProperty(polje))
        retValue.push({naziv: polje, tip: poljaKategorije[polje]});
    }
    return retValue;
  }

  //state koji cuva vrednosti koje se unose za odgovarajuca polja
  //cuva objekat koji sadrzi kljuceve NazivPolja i vrednosti koju korisnik zada u inputu za ta polja
  //odredjene kategorije
  const [vrednostiPolja, setVrednostiPolja] = useState({});

  //funkcija koja prati promene vrednosti samih polja od strane korisnika i setuje gornji state 
  const handlePoljeChange = (e, nazivPolja) => {
    const novaVrednost = e.target.type === 'checkbox' ?
                                              e.target.checked ? 
                                                'Da' : 'Ne' 
                                                : e.target.value;
    //console.log('Nova vrednost je: ' + novaVrednost);
    setVrednostiPolja(prevVrednostiPolja => ({
      ...prevVrednostiPolja,
      [nazivPolja]: novaVrednost
    }));
  };


  //state za cuvanje podkategorije koja je izabrana
  //cuva id podkategorije u vidu stringa potrebno parsovati
  const [odabranaPodkategorija, setOdabranaPodkategorija] = useState("nijeIzabrana");

  //state za cuvanje svih podkategorija jedne kategorije koje se listaju u select elementu
  const [podkategorije, setPodkategorije] = useState([]);

  //hendlujemo koje podkategorije da se nadju u select elementu za izbor podkategorije
  function handleOptionsPodkategorije(id) {
    const kategorijaZaPodkategoriju = kategorije.filter(kategorija => kategorija.id === parseInt(id));
    setPodkategorije(id === 'nijeIzabrana' ? [] : kategorijaZaPodkategoriju[0].podkategorije);
  }

  //hendlujemo ubacivanje slika
  function handleChange(e) {

    if(e.target.files.length > 5) {
      setErrorPop({
        title:"Možete izabrati najviše pet slika"
      });
      e.target.value = null;
      return;
    }

    setBrIzabranihSlika(e.target.files.length);
    setFiles(e.target.files);
    setSlikeIzabrane(true);
  }

  function handleButtonClick() {
    const fileInput = document.querySelector('.slike');
    fileInput.click();
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(tipOglasa === 'nijeIzabrano') {

      setErrorPop({
        title:"Morate da izaberete tip oglasa"
      });

      return;

    }

    if(smerOglasa === 'nijeIzabrano') {

      setErrorPop({
        title:"Morate da izaberete smer oglasa"
      });
      return;

    }

    if(tipOglasa === '0' && stanje === 'nijeIzabrano'){

      setErrorPop({
        title:"Morate da izaberete stanje oglasa"
      });

      return;

    }
    const formData = new FormData();

    let poljeImena = [];
    let poljeVrednosti = [];

    for(const polje in vrednostiPolja)
    {
      poljeImena.push(polje);
      poljeVrednosti.push(vrednostiPolja[polje]);
    }

    formData.append('Ime', nazivOglasa);
    if(odabranaKategorija === '1'){

      formData.append('PodkategorijaId', 1);

      formData.append('KategorijaId', odabranaKategorija);

    }

    else{

      if(odabranaKategorija ==='nijeIzabrana'){

        setErrorPop({
          title:"Morate da izaberete kategoriju"
        });

        return;

      }

      if(odabranaPodkategorija === 'nijeIzabrana'){

        setErrorPop({
          title:"Morate da izaberete podkategoriju"
        });

        return;

      }

      formData.append('PodkategorijaId', odabranaPodkategorija);

      formData.append('KategorijaId', odabranaKategorija);

    }
   

    for (let i = 0; i < poljeImena.length; i++) 
    {  
      formData.append('StavkePoljaImena', poljeImena[i]);
      formData.append('StavkePoljaVrednosti', poljeVrednosti[i]);
    }

    formData.append('Kredit', kredit);
    formData.append('Smer', smerOglasa);
    formData.append('Tip', tipOglasa);
    formData.append('Cena', cena);
    formData.append('Kolicina', kolicina);

    formData.append('KorisnikId', id);
    if(files!=null && files!=undefined)
    for (let i = 0; i < files.length; i++) 
    {  
      formData.append('PrimljeneSlike', files[i]);
    }

    formData.append('Lokacija', lokacija);
    

    if(tipOglasa == '1'){

      formData.append('Stanje', 0);

    } else {

      formData.append('Stanje', stanje);

    }
    formData.append('Opis', opis);
    
    const url = `http://localhost:5105/Authentication/UplatiOglas/${kredit}`;

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
      if(rola =="User")
      {
        fetch('http://localhost:5105/Oglas/PostaviOglas', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': 'Bearer ' + token 
            }
          })
          .then(s => {
            if (s.ok) {
              s.text().then(result =>
                {
/*                   setErrorPop({
                    title:'Oglas je postavljen.'
                  }) */
                  navigate('/oglas/'+result)
                  })
            } else {
              setErrorPop({
                title: "Maksimalan broj postavljenih oglasa (5) je dostignut.",
                message:" Da biste nastavili da postavljate oglase postanite naš premium član."
              });
            }
          });
      }
      else
      {
    try {
      const response = await fetch(url, requestOptions);
      //console.log(response);
      if (response.ok) {
        // Odradi drugi fetch samo ako je status 200
        if (response.status === 200) {
          fetch('http://localhost:5105/Oglas/PostaviOglas', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': 'Bearer ' + token 
            }
          })
          .then(s => {
            if (s.ok) {
              s.text().then(result =>
              {
/*                 setErrorPop({
                  title:'Oglas je postavljen.'
                }) */
                navigate('/oglas/'+result)
                })
              //navigate("/");
            } else {
              setErrorPop({
                title: "Došlo je do greške prilikom postavljanja oglasa"
              });
            }
          });
        }
      } else {
        const errorResponse = await response.text();
        setErrorPop({
          title: errorResponse
        });
      }
    } catch (error) {
      console.error(error); // Ispisuje grešku u konzoli ako dođe do greške
    }
  }
  };
  //kraj funkcije za prikupljanje podataka iz forme
const errorHandler =()=>{
  setErrorPop(null);
}

function handlePremium() {
  navigate('/neka');
}

  return (
    <>
     { token ? ( <div className="postavi-oglas-container">
       {errorPop?<PopUpModal title= {errorPop.title} message={errorPop.message} onConfirm={errorHandler}></PopUpModal>:null}
      <form id="id-postavi-oglas-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="labell" htmlFor="nazivOglasa">Naziv oglasa:</label>
          <input
            type="text"
            id="nazivOglasa"
            className="svi-isti input-textarea"
            value={nazivOglasa}
            onChange={(e) => setNazivOglasa(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="labell" htmlFor="cena">Cena:</label>
          <input
            type="number"
            id="cena"
            className="svi-isti input-textarea"
            value={cena}
            onChange={(e) => setCena(e.target.value)}
            required
          />
        </div>
        {rola!='User'&&<div className="form-group">
          <label className="labell" htmlFor="kredit">Kredit:</label>
          <input
            type="number"
            id="kredit"
            className="svi-isti input-textarea"
            value={kredit}
            onChange={(e) => setKredit(e.target.value)}
            required
          />
        </div>}

        <div className="form-group">
          <label className="labell" htmlFor="kolicina">Količina:</label>
          <input
            type="number"
            id="kolicina"
            className="svi-isti input-textarea"
            value={kolicina}
            onChange={(e) => setKolicina(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="labell" htmlFor="lokacija">Lokacija:</label>
          <input
            type="text"
            id="lokacija"
            className="svi-isti input-textarea"
            value={lokacija}
            onChange={(e) => setLokacija(e.target.value)}
            required
          />
        </div>

        
        <div className="form-group">

<label className="labell" htmlFor="tipOglasa">Tip oglasa:</label>

<select

  id="tipOglasa"

  className="svi-isti"

  value={tipOglasa}

  onChange={(e) => {

    if(e.target.value === '1') {

      setPrikazStanja(false);

    } else {

      setPrikazStanja(true);

    }

    setTipOglasa(e.target.value);

  }}

  required

>

  <option value="nijeIzabrano">Izaberite tip oglasa</option>

  <option value="0">Proizvod</option>

  <option value="1">Usluga</option>

</select>

</div>




<div className="form-group">

<label className="labell" htmlFor="smerOglasa">Smer oglasa:</label>

<select

  id="smerOglasa"

  className="svi-isti"

  value={smerOglasa}

  onChange={(e) => setSmerOglasa(e.target.value)}

  required

>

  <option value="nijeIzabrano">Izaberite smer oglasa</option>

  <option value="0">Nudim</option>

  <option value="1">Trazim</option>

</select>

</div>



{prikazStanja && <div className="form-group">

<label className="labell" htmlFor="stanje">Stanje:</label>

<select

  id="stanje"

  className="svi-isti"

  value={stanje}

  onChange={(e) => setStanje(e.target.value)}

  required

>

  <option value="nijeIzabrano">Izaberite stanje</option>

  <option value="0">Novo - neotpakovano</option>

  <option value="1">Kao novo - nekorišćeno</option>

  <option value="2">Polovno - očuvano</option>

  <option value="3">Polovno</option>

  <option value="4">Polovno - neupotrebivo</option>

</select>

</div>}

        <div className="form-group">
          <label className="labell" htmlFor="opis">Opis:</label>
          <textarea
            id="opis"
            className="svi-isti input-textarea samo-textarea"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="labell" htmlFor="slike">Dodaj slike (do 5 slika):</label>

          <div className="dodavanje-slika">
            <button type="button" className="file-input-button" onClick={handleButtonClick}>
              +
              <input type="file" id="slike" className="slike" accept="image/*" multiple onChange={handleChange} />
            </button>

            {slikeIzabrane && <label>Broj izabranih slika: {brIzabranihSlika}</label>}
          </div>
        </div>

        <div className="form-group">
          <label className="labell" htmlFor="kategorija">Kategorija:</label>
          <select
              id="kategorija"
              className="svi-isti"
              value={odabranaKategorija}
              onChange={e => setOdabranaKategorija(() => {
                handlePoljaKategorije(e.target.value);
                handleOptionsPodkategorije(e.target.value);
                setVrednostiPolja({});
                return e.target.value;
              })}
              required
            >
              <option value="nijeIzabrana">Izaberite kategoriju</option>
              {kategorije.map(kategorija => (
                <option key={kategorija.id} value={kategorija.id}>
                  {kategorija.ime}
                </option>
              ))}
            </select>
        </div>
        
        {

      (odabranaKategorija !== 'nijeIzabrana' && odabranaKategorija !== '1') && (
           <div className="form-group">
             <h3>Popunite polja kategorije!</h3>
             {skupiPoljaKategorije().map(polje => {
              return (
                <div className="form-group" key={polje.naziv}>
                  <label className="labell" htmlFor={polje.naziv}>{polje.naziv}:</label>
                  <input
                    type={polje.tip}
                    id={polje.naziv}
                    className="svi-isti input-textarea"
                    value={polje.vrednost}
                    onChange={(e) => handlePoljeChange(e, polje.naziv)}
                    
                  />
                </div>
              )
             })}
           </div>
         )}
        
        
        {

      (odabranaKategorija !== 'nijeIzabrana' && odabranaKategorija !== '1') && (
          <div className="form-group">
            <label className="labell" htmlFor="podkategorija">Podkategorija:</label>
            <select
                id="podkategorija"
                className="svi-isti"
                value={odabranaPodkategorija}
                onChange={e => setOdabranaPodkategorija(e.target.value)}
                required
              >
                <option value="nijeIzabrana">Izaberite podkategoriju</option>
                {podkategorije.map(podkategorija => (
                  <option key={podkategorija.id} value={podkategorija.id}>
                    {podkategorija.ime}
                  </option>
                ))}
              </select>
          </div>
        )}
        <div className='d-flex flex-row justify-content-between'>
          <div className="dugme-div">
            <button type="button" className="btn btn-primary" onClick={handlePremium}>Postani premium</button>
          </div>
          <div className="dugme-div">
            <button type="submit" className="btn btn-primary">Postavi oglas</button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  )}
    </>
  )
    
  
};

export default PostaviOglas;