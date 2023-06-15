import React, { useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import classes from './Email.module.css';
import PopUpModal from './PopUpModal';
import NavBarContext from "../../Uros/Contexts/NavBarContext";

const ForgotPassword = (props) => {
  const { navbarSetCollapsable } = React.useContext(NavBarContext)
  React.useEffect(() => {
      
      navbarSetCollapsable(false)
      return ()=>navbarSetCollapsable(false)
  }, [])
  
 let token2 = localStorage.getItem('token');
  const [errorPop,setErrorPop]=useState();
    const emailRef=useRef();
    const email = localStorage.getItem("email");
    const passwordInputRef = useRef();
    const confirmPasswordInputRef=useRef();
    const tokenInputRef=useRef();
    const validatePassword = (password) => {
      // Provera da li lozinka sadrži cifru, veliko slovo i broj
      const hasDigit = password.includes("0") || password.includes("1") || password.includes("2") || password.includes("3") || password.includes("4") || password.includes("5") || password.includes("6") || password.includes("7") || password.includes("8") || password.includes("9");
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasLength =password.length>7;
            // Vraćanje rezultata validacije
      return hasDigit && hasUppercase && hasNumber && hasLength;
    };
    const validateToken = (token) => {
      // Provera dužine tokena
      return token.length > 5;
    };
    const handler = (event) =>{
        event.preventDefault(); 
        const token = tokenInputRef.current.value;
        const isTokenValid = validateToken(token);
        const newPassword = passwordInputRef.current.value;
        const isPasswordValid = validatePassword(newPassword);
        const newPassword2 = confirmPasswordInputRef.current.value;
        const isPasswordValid2 = validatePassword(newPassword2);
        if(isPasswordValid && isPasswordValid2 && newPassword===newPassword2 && isTokenValid)
        {
        fetch("http://localhost:5105/Authentication/Reset Password", {
        method: "POST", // HTTP metoda koja se koristi za zahtev
        headers: {
          "Content-Type": "application/json", // Tip sadržaja koji se šalje
        },
        body: JSON.stringify({
          email:email,
        password:passwordInputRef.current.value,
        confrimPassword:confirmPasswordInputRef.current.value,
        token:tokenInputRef.current.value
        }),
      })
      .then((odgovor) => {
        if (odgovor.ok) {
          console.log("Status je 200 OK");
        } else {
          setErrorPop({
            title:"Greška",
            message:"Nažalost došlo je do greške, proverite da li ste lepo kopirali token koji ste dobili na email. Proverite da li Vaša nova lozinka sadrži veliko slovo, cifru i da ima više od 7 karaktera, takođe proverite da li se lozinke poklapaju."
           });
        }
        return odgovor.text();
      })
      .then((odgovorTekst) => {
        setErrorPop({
          title:"Lozinka je promenjena.",
          message:""
         });
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else
    {
      setErrorPop({
        title:"Greška",
        message:"Nažalost došlo je do greške, proverite da li ste lepo kopirali token koji ste dobili na email. Proverite da li Vaša nova lozinka sadrži veliko slovo, cifru i da ima više od 7 karaktera, takođe proverite da li se lozinke poklapaju."
       
       });
    }
    };
    const errorHandler = () =>{
      setErrorPop(null);
    }
    return(
      <>
      {!token2?(
      <div className={classes.klasa} >
      {errorPop?<PopUpModal title= {errorPop.title} message={errorPop.message} onConfirm={errorHandler}></PopUpModal>:null}
        <div className={classes.box} style={{width:"390px", height:"515px"} }>
        <form>
          <h2>Forgot Password</h2>
          <div className = {classes.inputBox}>
            <input type="text" required="required" ref={tokenInputRef}></input>
            <span>Verifikacioni token</span>
            <i></i>
          </div>
          <div className = {classes.inputBox}>
            <input type="password" required="required" ref={passwordInputRef}></input>
            <span>Password</span>
            <i></i>
          </div>
          <div className = {classes.inputBox}>
            <input type="password" required="required" ref={confirmPasswordInputRef}></input>
            <span>Confirm password </span>
            <i></i>
          </div>
          <div className = {classes.links}>
          <Link to="/signup" >SignUp</Link>
            <Link to="/login" >Login</Link>
          </div>
          <input type = "submit" value="Sign Up" onClick={handler} ></input>
        </form>
        </div>
        </div>):<></>}
        </>
        )
}
export default ForgotPassword;