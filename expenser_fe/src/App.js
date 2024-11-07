import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import ThemeSelector from './ThemeChanger';
// Return result table to parent

const webServiceRoute = "https://expenser-sdvt.onrender.com/expense/"
function Result({ calculationData, cookieExist, userDataExist, dataSaved, setDataSaved, initialLoad, setInitialLoad }) {

  const totalAmountAfterBill = calculationData.totalAmount - calculationData.estiBill;
  const savingAmount = totalAmountAfterBill * calculationData.savingPercent / 100;
  const remainingAmount = totalAmountAfterBill - savingAmount;
  const formatWeekLabelforMob = (weekNumber) => {
    switch (weekNumber) {
      case 1: return '1st week :';
      case 2: return '2nd week :';
      case 3: return '3rd week :';
      case 4: return '4th week :';
      default: return `${weekNumber}th week`;
    }
  };
  async function updateUserExpense() {
    // Call put method and disabled button
    try {
      const userId = Cookies.get('userId');
      const updateRoute = webServiceRoute + "updateexpense/" + userId;
      const response = await axios.put(updateRoute, calculationData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      if (response.status === 200) {
        setDataSaved(true);
      }
    } catch (err) {
      console.log(err);
    }

  }
  async function saveUserExpense() {
    // Call post method and set userDataExist to true
    try {
      const saveRoute = webServiceRoute + "createexpense";
      const response = await axios.post(saveRoute, calculationData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
      if (response.status === 200) {
        setDataSaved(true);
      }
    } catch (err) {
      console.log(err);
    }
  }
  let error;
  if (calculationData.estiBill > calculationData.totalAmount) {
    error = "Estimated Bill cannot exceed over total amount.";
  }

  if (calculationData.savingPercent > 40) {
    error = "We recommend you to save only 40 percent of your total amount for better management.";
  }

  if (calculationData.totalAmount === 0 || calculationData.estiBill === 0) {
    error = "For most accurate calculation, please insert both total amount and estimated bill.";
  }

  if (error) {
    return (
      <section className="result">
        <h4>{error}</h4>
      </section>
    );
  } else {
    return (
      <>
        <section className="result">
          <table>
            <thead>
              <tr>
                <th>1st Week</th>
                <th>2nd Week</th>
                <th>3rd Week</th>
                <th>4rd Week</th>
                <th>Saving Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {Array(4).fill(remainingAmount / 4).map((weekAmount, index) => (
                  <td key={index} week={formatWeekLabelforMob(index + 1)}>{weekAmount}</td>
                ))}
                <td week="Saving Amount : ">{savingAmount}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {userDataExist && cookieExist && !initialLoad &&
          <div className='text-center'>
            <button className="expense-button" onClick={updateUserExpense} disabled={dataSaved}>{dataSaved ? "Updated!" : "Update"}</button>
          </div >
        }
        {!userDataExist && cookieExist && !initialLoad &&
          <div className='text-center'>
            <button className="expense-button" onClick={saveUserExpense} disabled={dataSaved}>{dataSaved ? "Saved!" : "Save"}</button>
          </div >
        }

      </>
    )
  }
}

export default function Expenser() {
  const [inputValues, setInputValues] = useState({ totalAmount: 0, savingPercent: 0, estiBill: 0 });
  const [calculate, setCalculate] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isCookieExist, setIsCookieExist] = useState(!!(Cookies.get('userId')));
  const [userDataExist, setUserDataExist] = useState(false);

  function setInputValue(element) {
    const newValue = {
      [element.target.name]: Number(element.target.value)
    }
    setInputValues(previous => {
      return { ...previous, ...newValue }
    });

    setCalculate(false);
    setInitialLoad(false);
    setDataSaved(false);
  };


  function setCookie(credential) {
    Cookies.set('userId', credential.sub, { expires: 2 });
    Cookies.set('userName', credential.name, { expires: 2 });
    setIsCookieExist(true);
  }
  /**
  *  check Cookie and get userData
  *  if data exist, setInputValues
  */

  useEffect(() => {
    if (isCookieExist) {
      async function getData() {
        try {
          const userId = Cookies.get('userId');
          const getRoute = webServiceRoute + "getexpense/" + userId;
          const response = await axios.get(getRoute);
          if (response.status === 200) {
            if (response.data.length !== 0) {
              setUserDataExist(true);
              setInputValues(previous => {
                return { ...previous, ...response.data[0] }
              });
              setCalculate(true);
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
      getData();
    }
  }, [isCookieExist]);



  return (
    <>
      <ThemeSelector></ThemeSelector>
      <h2 className='text-center mb-4'>Welcome to Expenser {Cookies.get('userName') && ", " + Cookies.get('userName')}</h2>
      <Container>
        <Row>
          <Col md="3" className='text-center'>
            <label>Enter your total amount:</label><br></br>
            <input type="number" name="totalAmount" onChange={(e) => setInputValue(e)} value={inputValues.totalAmount}></input>
          </Col>
          <Col md="5" className='text-center'>
            <label>Enter your saving amount: (40% maximum)</label><br></br>
            <input type="number" name="savingPercent" onChange={(e) => setInputValue(e)} value={inputValues.savingPercent}></input>
          </Col>
          <Col md="4" className='text-center'>
            <label>Enter your estimated  bill amount:</label><br></br>
            <input type="number" name="estiBill" onChange={(e) => setInputValue(e)} value={inputValues.estiBill}></input>
          </Col>
        </Row>
        <div className='text-center mt-4'>
          <button className="expense-button" onClick={() => setCalculate(true)}>Calculate</button>
        </div>
        {!isCookieExist && <div className='text-center'>
          <h2 className="mt-5 mb-3">Sign in with Google to Gain Access to Your Expense</h2>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);
              setCookie(decoded);
            }}
            onError={(err) => {
              console.log('Login Failed' + err);
            }}
            shape="pill"
            width="100px"
            text='continue_with'
          />;
        </div >}
        {
          calculate &&
          <Result
            calculationData={inputValues}
            cookieExist={isCookieExist}
            userDataExist={userDataExist}
            dataSaved={dataSaved}
            setDataSaved={setDataSaved}
            initialLoad={initialLoad}
            setInitialLoad={setInitialLoad}
          >
          </Result>
        }

      </Container >
    </>
  );
}
