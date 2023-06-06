import "./styles.css";
import Card from "./Card";

import { useState } from "react";
import { CgEditFlipH } from "react-icons/cg";
import { useDispatch,useSelector } from "react-redux";
import { userActions } from "../store/user";
export default function App() {
  const dispatch=useDispatch();
  const user = useSelector(state =>({
    name:state.user.uname,
    surname:state.user.usurname,
    username:state.user.uusername,
    address:state.user.uaddress,
    email:state.user.uemail,
    phone:state.user.uphone,
    uplata:state.user.uuplata,
    role:state.user.urole,
    slika:state.user.uslika
    //<span className="text-black-50">veljkoveljovic13@gmail.com</span>
  }));
  console.log(user.slika);
  const savedUserState=localStorage.getItem('userState');
  if(savedUserState)
  {
    dispatch(userActions.setValues(JSON.parse(savedUserState)));
  }

  console.log(user.name+" "+user.surname+""+user.role);
  const months = [];
  const year = [];
  var [focus, setFocus] = useState("none");
  for (let i = 1; i < 13; i++) {
    months.push(i);
  }
  for (let i = new Date().getFullYear(); i < 2030; i++) {
    year.push(i);
  }
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [flip, setFlip] = useState(false);
  const [cvv, setCvv] = useState();
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expDate, setExpDate] = useState({ month: "10", year: 23 });
  const type = "visa"; /* or Discover,MasterCard HBK's Custom feature */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      /^[0-9]{16}$/.test(cardNumber) &&
      /^[a-zA-Z ]{5,15}$/.test(cardHolder.trim()) &&
      /^[0-9]{3}$/.test(cvv)
    ) {
      let email = user.email;
      let name = user.name+" " +user.surname;
      let cardName = cardHolder;
      let cardNumberr=cardNumber;
      let cvvv=cvv;
      let expYear="20"+expDate.year;
      let expMonth=expDate.month;
      console.log(email+" "+name+" "+cardName+" "+cardNumberr+" "+" "+cvvv+" "+expYear+" "+expMonth );
      const customerData ={
        email:email,
        name:name,
        creditCard:{
          name:cardName,
          cardNumber:cardNumberr,
          expirationYear:expYear,
          expirationMonth:expMonth,
          cvc:cvvv
        }
      }
      console.log(customerData);
      fetch("http://localhost:5105/Authentication/AddCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData),
      })
      .then(response1 => {
        if (response1.status === 200) {
          return response1.json();
        } else {
          throw new Error('Status code is not 200');
        }
      })
      .then(data => {
        const paymentData2={
          customerId:data.customerId,
          receiptEmail:data.email,
          description:"Premium Clan",
          currency:"eur",
          amount:"1000",
        }
        console.log(paymentData2);
        fetch("http://localhost:5105/Authentication/AddPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData2),
      })
      .then(response12 => {
        if (response12.status === 200) {
          return response12.json();
        } else {
          return response12.text();
        }
      }).then(data2=>{
        console.log(data2);
      })
      })
      .catch(error => {
        console.error(error);
      });
      setSuccess(true);
      setError("Your information have been captured successfully!");
      setTimeout(() => {
        setError("");
        setSuccess(false);
      }, 5000);
    } else {
      setError("some of your information are invalid! please restart");
      setTimeout(() => {
        setError("");
        setSuccess(false);
      }, 4000);
    }
  };
  const handleInputChange = (e) => {
    var value = e.target.value;
    var type = e.target.name;
    if (type === "number") {
      if (
        !isNaN(value) &&
        !isNaN(value.charAt(value.length - 1)) &&
        value.length <= 16 &&
        value.charAt(value.length - 1) !== " "
      ) {
        setCardNumber(value);
      }
    } else if (type === "name") {
      console.log(value);
      if (/^[a-zA-Z ]{1,15}$/.test(value.trim())) {
        setCardHolder(value);
      } else {
        setError(
          "Names must contain letters from A-Z only and less than 15 characters"
        );
        setTimeout(() => {
          setError("");
        }, 4000);
      }
    } else if (type === "cvv") {
      console.log(value);
      if (/^[0-9]{3}$/.test(value)) {
        setCvv(value);
      } else {
        if (!isNaN(value)) setCvv(value.substring(0, 3));
        setError(
          "CVV must contain numbers only and should be 3 characters only"
        );
        setTimeout(() => {
          setError("");
        }, 4000);
      }
    }
  };
  const handleInputFocus = (e) => {
    console.log(e.target.name);
    setFocus(e.target.name);
    if (e.target.name === "cvv") {
      setFlip(true);
    } else {
      setFlip(false);
    }
  };
  const checkExpDate = () => {
    var gap = expDate.year - new Date().getFullYear().toString().substring(2);
    if (gap < 1 && expDate.month <= new Date().getMonth() + 1) {
      return "Expired";
    } else if (gap <= 1) {
      return "expires soon";
    } else {
      return null;
    }
  };
  return (
    <div className="App">
      <form className="forma" action="#" onSubmit={(e) => handleSubmit(e)}>
        <div
          onClick={() => {
            setFlip(!flip);
          }}
          id="flip"
          style={{ background: flip ? "#a4d2f8" : "#001a2f" }}
        >
          {flip ? (
            <CgEditFlipH size="2em" />
          ) : (
            <CgEditFlipH size="2em" color="white" />
          )}
        </div>
        <Card
          cvv={cvv}
          cardNumber={cardNumber}
          cardHolder={cardHolder}
          expDate={expDate}
          type={type}
          flip={flip}
          focus={focus}
        />
        <div className="inputs">
          <div
            id={success ? "success" : ""}
            className={error ? "error" : "d-none"}
          >
            {error}
          </div>
          <div className="cardInfo">
            <label className ="labela" htmlFor="cardNumber">Card Number</label>
            <input 
                
              type="tel"
              name="number"
              placeholder="Card Number"
              pattern="[\d]{16}"
              title="Numbers only (16 digits)"
              required
              value={cardNumber}
              onChange={(e) => handleInputChange(e)}
              onFocus={(e) => handleInputFocus(e)}
              onBlur={() => setFocus("none")}
            />
          </div>
          <div className="cardInfo">
            <label htmlFor="cardHolder">Card Holder</label>
            <input
              type="text"
              name="name"
              placeholder="Card Name"
              pattern="^[a-zA-Z ]{5,15}$"
              title="Names must contain letters from A-Z only and less than 15 characters"
              required
              onChange={(e) => handleInputChange(e)}
              onFocus={(e) => handleInputFocus(e)}
              onBlur={() => setFocus("none")}
            />
          </div>
          <div className="beforeLast">
            <div className="date">
              <label htmlFor="ExpDate">Expiration Date</label>
              <span id="dateSelection">
                <select
                className="selectt"
                  value={expDate.month}
                  onFocus={(e) => handleInputFocus(e)}
                  onBlur={() => setFocus("none")}
                  onChange={(e) =>
                    setExpDate({ ...expDate, month: e.target.value })
                  }
                  name="month"
                  id="month"
                >
                  <option value="Month" disabled>
                    Month
                  </option>
                  {months.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
                <select
                className="selectt"
                  onFocus={(e) => handleInputFocus(e)}
                  onBlur={() => setFocus("none")}
                  onChange={(e) =>
                    setExpDate({
                      ...expDate,
                      year: e.target.value.substring(2)
                    })
                  }
                  name="year"
                  id="year"
                >
                  <option value="Year" disabled>
                    Year
                  </option>
                  {year.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
                <span className={checkExpDate() ? "expired" : "none-expired"}>
                  {checkExpDate()}
                </span>
              </span>
            </div>
            <div className="groupCvv">
              <label htmlFor="cvv">CVV</label>
              <input
              className="inputt"
                type="tel"
                name="cvv"
                pattern="\d{3}"
                title="Numbers only (3 digits)"
                required
                onChange={(e) => handleInputChange(e)}
                onFocus={(e) => handleInputFocus(e)}
                onBlur={() => setFlip(false) & setFocus("none")}
              />
            </div>
          </div>

          <button className="buttonn"type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
