import React from 'react'
import { BsSend } from 'react-icons/bs'
import { FaFileContract } from 'react-icons/fa' 
import Button from '@mui/material/Button';
import AddUgovorDialog from './AddUgovorDialog';
export default function MessageInputBox({ className, inputState, setInputState, onSubmit, dialogState, setDialogState, oglasId, isVlasnik
,setErrorPop})
{

    const buttonRef = React.useRef(null)
    function handleOnKeyUp(e)
    {
        e.preventDefault()
        if (e.keyCode === 13)
        {
            buttonRef.current.click()
        }
    }

    return (
        <div className={'p-2 d-flex flex-row justify-content-center align-items-center w-100' + className !== undefined ?
    className:''}>{/*container */}
            <div className='p-1 w-100 d-flex flex-row justify-content-center border bg-white align-items-center'
                style={{ height: '46px', borderRadius: '15px' }}>{/**wrapper */}
                <input onKeyUp={handleOnKeyUp} className='w-100 border-0 px-2' style={{ fontSize: 'large', height: '30px', outline: 'none' }}
                value={inputState} onChange={(ev)=>setInputState(ev.target.value)}>
                
                </input>
                {!isVlasnik &&
                    <AddUgovorDialog
                        onSubmit={onSubmit}
                        dialogState={dialogState}
                        setDialogState={setDialogState}
                        oglasId={oglasId}
                    setErrorPop={setErrorPop}/>}
                <Button className='border-0 bg-white' ref={buttonRef} style={{ outline: 'none !important', boxShadow: 'none !important' }}
                    onClick={ev => onSubmit()}
                 >
                    <BsSend size ={30}/>
                </Button>
            </div>
        </div>)
}