import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import React from 'react'
import DropDown from '../DropDown/DropDown'
import './FilterWindow.css'
import { FormControl,Dialog} from '@mui/material'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BsFilter} from 'react-icons/bs'

export function FilterDialog({stanja,seterStanja}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    };
    
    const emptykat = {id:'',ime:'Prazno', podkategorije: [
           
    ]}

    React.useEffect( () =>
    {
        async function fun() {
        const kategorijaRes = await fetch('http://localhost:5105/Kategorija/VratiKategorije')
            if (kategorijaRes.ok) {
                const kategorijaJson = await kategorijaRes.json()

                seterStanja((oldValue) => {
                    return {
                        ...oldValue,
                        kategorije:[oldValue.kategorije[0], ...kategorijaJson]
                        }
                })
            }   

        }
        fun()
    },[])
    
    function onChangeStanjeHandler(ev)
    {
        seterStanja((oldValue) =>
        {
            let newValue = { ...oldValue }
            if (ev.target.name === 'selectedKat')
            {
                newValue.selectedKat = oldValue.kategorije.filter(k => k.id == ev.target.value)[0]
                newValue.selectedPodkat = []
            }
            else if (ev.target.name === 'selectedPodkat')
            {
                newValue.selectedPodkat=oldValue.selectedKat.podkategorije.filter(pk => ev.target.value.includes(pk.id))
            }
            else 
            {
                if (ev.target.name === 'selectedTip')
                {
                    newValue.selectedStanja=[]    
                }
                newValue = {
                    ...newValue,
                    [ev.target.name]:ev.target.value
                }
            }
            return newValue
        })
    }
    const menuItemsKategorije = stanja.kategorije.map(k =>
        {
            return <MenuItem value={k.id} key={k.id}>{k.ime}</MenuItem>    
        })
    const menuItemsPodkategorije = stanja.selectedKat.podkategorije.map(pk =>
    {
        return <MenuItem value={pk.id} key={pk.id}>{pk.ime }</MenuItem>
    })
    

  return (
    <div>
      <Button onClick={handleClickOpen}>
      <BsFilter size={30}/>
      </Button>
          <Dialog open={open} onClose={handleClose} sx={{
              '& .MuiDialog-paper':
              {
                  maxWidth:"1000px"
              }
          }} >
        <DialogTitle className='text-center'>Filteri</DialogTitle>
        <DialogContent>
        <div className='d-flex flex-row justify-content-center mt-2'>
            <FormControl >
                <InputLabel id="kategorija-label">Kategorija</InputLabel>
                <Select
                        labelId='kategorija-label'
                        className='filterWindow--select mr-2'
                        onChange={onChangeStanjeHandler}
                        value={stanja.selectedKat.id}
                        label='Kategorija'
                        inputProps={
                            { name:'selectedKat'}}    
                >
                  {menuItemsKategorije}
                </Select>
            </FormControl>
            <FormControl >
                <InputLabel id="podkategorija-label">Podkategorija</InputLabel>
                <Select
                        labelId='podkategorija-label'
                        className='filterWindow--select'
                        onChange={onChangeStanjeHandler}
                        value={stanja.selectedKat.podkategorije.length > 0 ? stanja.selectedPodkat.map(spk => spk.id) : []}
                        label='Podkategorija'
                        multiple={true}
                        inputProps=
                        {
                            { name: 'selectedPodkat' }
                        }
                        
                >
                  {menuItemsPodkategorije}
                </Select>
            </FormControl>
            </div>
            <div className='d-flex flex-row justify-content-center mt-2'>
            <FormControl >
                <InputLabel id="tip-label">Tip</InputLabel>
                <Select
                    labelId='tip-label'
                    className='filterWindow--select mr-2'
                    onChange={onChangeStanjeHandler}
                    value={stanja.selectedTip}
                        label='Tip'
                        inputProps=
                        {
                            { name: 'selectedTip' }
                        }
                    >       
                        <MenuItem value={''} key={''}></MenuItem>
                        <MenuItem value={0} key={0}>Proizvod</MenuItem>
                        <MenuItem value={1} key={1}>Usluga</MenuItem>
                </Select>
            </FormControl>
            <FormControl >
                <InputLabel id="smer-label">Smer</InputLabel>
                <Select
                    labelId='smer-label'
                    className='filterWindow--select filterWindow--selectRight'
                    onChange={onChangeStanjeHandler}
                    value={stanja.selectedSmer}
                        label='Smer'
                        inputProps=
                        {
                            { name: 'selectedSmer' }
                        }>
                    <MenuItem value={''} key={''}></MenuItem>
                    <MenuItem value={0} key={0}>Nudim</MenuItem>
                    <MenuItem value={1} key={1}>Tražim</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div className='d-flex flex-row justify-content-center mt-2'>
            <FormControl >
                <InputLabel id="stanje-label">Stanje</InputLabel>
                    <Select
                    disabled={stanja.selectedTip!==0}
                    labelId='stanje-label'
                    className='filterWindow--select filterWindow--selectStanje'
                    onChange={onChangeStanjeHandler}
                    value={stanja.selectedStanja}
                        label='Stanje'
                        multiple={true}
                        inputProps=
                        {
                            { name: 'selectedStanja' }
                        }
                >
                        <MenuItem value={0} key={0}>Novo Neotpakovano</MenuItem>
                        <MenuItem value={1} key={1}>Novo Nekorišćeno</MenuItem>
                        <MenuItem value={2} key={2}>Polovno Očuvano</MenuItem>
                        <MenuItem value={3} key={3}>Polovno</MenuItem>
                        <MenuItem value={4} key={4}>Polovno Neupotrebivo</MenuItem>
                </Select>
                </FormControl>
            </div>
            <div className='d-flex flex-row justify-content-center mt-2'>
                <TextField
                    label='Cena od'
                    inputProps={{ type: 'number', inputMode: 'numeric',name:'cenaOd' }}
                    className='filterWindow--cena_input mr-2'
                    style={{ marginRight: '10px' }}
                    value={stanja.cenaOd}
                    onChange={onChangeStanjeHandler}>
                    
                    </TextField>
                <TextField
                    label='Cena do'
                    inputProps={{ type: 'number', inputMode: 'numeric',name:'cenaDo' }}
                    className='filterWindow--cena_input'
                    value={stanja.cenaDo}
                    onChange={onChangeStanjeHandler}>
                    
                    </TextField>
            </div>
            <div className='d-flex flex-row justify-content-start mt-2'>
                <TextField
                    label='Lokacija'
                    inputProps={{name:'lokacija' }}
                    className='filterWindow--lokacija_input'
                    value={stanja.lokacija}
                    onChange={onChangeStanjeHandler}
                ></TextField>
           </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function FilterWindow({active,setActive,stanja,seterStanja})
{
    
    const emptykat = {id:'',ime:'Prazno', podkategorije: [
           
    ]}

    React.useEffect( () =>
    {
        async function fun() {
        const kategorijaRes = await fetch('http://localhost:5105/Kategorija/VratiKategorije')
            if (kategorijaRes.ok) {
                const kategorijaJson = await kategorijaRes.json()

                seterStanja((oldValue) => {
                    return {
                        ...oldValue,
                        kategorije:[oldValue.kategorije[0], ...kategorijaJson]
                        }
                })
            }   

        }
        fun()
    },[])
    
    function onChangeStanjeHandler(ev)
    {
        seterStanja((oldValue) =>
        {
            let newValue = { ...oldValue }
            if (ev.target.name === 'selectedKat')
            {
                newValue.selectedKat = oldValue.kategorije.filter(k => k.id == ev.target.value)[0]
                newValue.selectedPodkat = []
            }
            else if (ev.target.name === 'selectedPodkat')
            {
                newValue.selectedPodkat=oldValue.selectedKat.podkategorije.filter(pk => ev.target.value.includes(pk.id))
            }
            else 
            {
                if (ev.target.name === 'selectedTip')
                {
                    newValue.selectedStanja=[]    
                }
                newValue = {
                    ...newValue,
                    [ev.target.name]:ev.target.value
                }
            }
            return newValue
        })
    }
    const menuItemsKategorije = stanja.kategorije.map(k =>
        {
            return <MenuItem value={k.id} key={k.id}>{k.ime}</MenuItem>    
        })
    const menuItemsPodkategorije = stanja.selectedKat.podkategorije.map(pk =>
    {
        return <MenuItem value={pk.id} key={pk.id}>{pk.ime }</MenuItem>
    })
    
    return (
        <DropDown active={active} setActive={setActive} id='filterWindow' containerId='filterWindow--inner'>
            <div className='filterWindow--select_container filterWindow--kategorija_container'>
            <FormControl >
                <InputLabel id="kategorija-label">Kategorija</InputLabel>
                <Select
                        labelId='kategorija-label'
                        className='filterWindow--select filterWindow--selectLeft'
                        onChange={onChangeStanjeHandler}
                        value={stanja.selectedKat.id}
                        label='Kategorija'
                        inputProps={
                            { name:'selectedKat'}}    
                >
                  {menuItemsKategorije}
                </Select>
            </FormControl>
            <FormControl >
                <InputLabel id="podkategorija-label">Podkategorija</InputLabel>
                <Select
                        labelId='podkategorija-label'
                        className='filterWindow--select filterWindow--selectRight'
                        onChange={onChangeStanjeHandler}
                        value={stanja.selectedKat.podkategorije.length > 0 ? stanja.selectedPodkat.map(spk => spk.id) : []}
                        label='Podkategorija'
                        multiple={true}
                        inputProps=
                        {
                            { name: 'selectedPodkat' }
                        }
                        
                >
                  {menuItemsPodkategorije}
                </Select>
            </FormControl>
            </div>
            <div className='filterWindow--select_container filterWindow--smer_tip_container'>
            <FormControl >
                <InputLabel id="tip-label">Tip</InputLabel>
                <Select
                    labelId='tip-label'
                    className='filterWindow--select filterWindow--selectLeft'
                    onChange={onChangeStanjeHandler}
                    value={stanja.selectedTip}
                        label='Tip'
                        inputProps=
                        {
                            { name: 'selectedTip' }
                        }
                    >       
                        <MenuItem value={''} key={''}></MenuItem>
                        <MenuItem value={0} key={0}>Proizvod</MenuItem>
                        <MenuItem value={1} key={1}>Usluga</MenuItem>
                </Select>
            </FormControl>
            <FormControl >
                <InputLabel id="smer-label">Smer</InputLabel>
                <Select
                    labelId='smer-label'
                    className='filterWindow--select filterWindow--selectRight'
                    onChange={onChangeStanjeHandler}
                    value={stanja.selectedSmer}
                        label='Smer'
                        inputProps=
                        {
                            { name: 'selectedSmer' }
                        }>
                    <MenuItem value={''} key={''}></MenuItem>
                    <MenuItem value={0} key={0}>Tražim</MenuItem>
                    <MenuItem value={1} key={1}>Nudim</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div className='filterWindow--select_container filterWindow--stanje_container'>
            <FormControl >
                <InputLabel id="stanje-label">Stanje</InputLabel>
                    <Select
                    disabled={stanja.selectedTip!==0}
                    labelId='stanje-label'
                    className='filterWindow--select filterWindow--selectStanje'
                    onChange={onChangeStanjeHandler}
                    value={stanja.selectedStanja}
                        label='Stanje'
                        multiple={true}
                        inputProps=
                        {
                            { name: 'selectedStanja' }
                        }
                >
                        <MenuItem value={0} key={0}>Novo Neotpakovano</MenuItem>
                        <MenuItem value={1} key={1}>Novo Nekorišćeno</MenuItem>
                        <MenuItem value={2} key={2}>Polovno Očuvano</MenuItem>
                        <MenuItem value={3} key={3}>Polovno</MenuItem>
                        <MenuItem value={4} key={4}>Polovno Neupotrebivo</MenuItem>
                </Select>
                </FormControl>
            </div>
            <div className='filterWindow--select_container filterWindow--cena_control'>
                <TextField
                    label='Cena od'
                    inputProps={{ type: 'number', inputMode: 'numeric',name:'cenaOd' }}
                    className='filterWindow--cena_input'
                    style={{ marginRight: '10px' }}
                    value={stanja.cenaOd}
                    onChange={onChangeStanjeHandler}>
                    
                    </TextField>
                <TextField
                    label='Cena do'
                    inputProps={{ type: 'number', inputMode: 'numeric',name:'cenaDo' }}
                    className='filterWindow--cena_input'
                    value={stanja.cenaDo}
                    onChange={onChangeStanjeHandler}>
                    
                    </TextField>
            </div>
            <div className='filterWindow--select_container filterWindow--lokacija_control'>
                <TextField
                    label='Lokacija'
                    inputProps={{name:'lokacija' }}
                    className='filterWindow--lokacija_input'
                    value={stanja.lokacija}
                    onChange={onChangeStanjeHandler}
                ></TextField>
                <Button variant='text' className='ok_btn' onClick={(ev)=>setActive(false)}>Ok</Button>
           </div>
        </DropDown>
    )
}