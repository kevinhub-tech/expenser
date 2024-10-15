import { useState } from 'react';
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';

// Return result table to parent
function Result({ totalAmount, savingPercent, estiBill }) {
  const totalAmountAfterBill = totalAmount - estiBill;
  const savingAmount = totalAmountAfterBill * savingPercent / 100;
  const remainingAmount = totalAmountAfterBill - savingAmount;

  let error;
  if (totalAmount < estiBill) {
    error = "Estimated Bill cannot exceed over total amount.";
  }

  if (savingPercent > 40) {
    error = "We recommend you to save only 40 percent of your total amount for better management.";
  }

  if (totalAmount === 0 || estiBill === 0) {
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
                <td key={index}>{weekAmount}</td>
              ))}
              <td>{savingAmount}</td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }
}

export default function Expenser() {
  const [calculate, setCalculate] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [savingPercent, setSavingPercent] = useState(0);
  const [estiBill, setEstiBill] = useState(0);

  function setInputValue(element, value) {
    if (element === "amount") {
      setTotalAmount(value);
      setCalculate(false);
    } else if (element === "saving") {
      setSavingPercent(value);
      setCalculate(false);
    } else if (element === 'estibill') {
      setEstiBill(value);
      setCalculate(false);
    }
  }

  return (
    <>
      <h2 className='text-center mb-4'>Welcome to Expenser</h2>
      <Container>
        <Row>
          <Col md="3" className='text-center'>
            <label>Enter your total amount:</label><br></br>
            <input class="" type="number" onChange={(e) => setInputValue("amount", e.target.value)} value={totalAmount}></input>
          </Col>
          <Col md="5" className='text-center'>
            <label>Enter your saving amount: (40% maximum)</label><br></br>
            <input class="" type="number" onChange={(e) => setInputValue('saving', e.target.value)} value={savingPercent}></input>
          </Col>
          <Col md="4" className='text-center'>
            <label>Enter your estimated  bill amount:</label><br></br>
            <input class="" type="number" onChange={(e) => setInputValue('estibill', e.target.value)} value={estiBill}></input>
          </Col>
        </Row>
        <div className='text-center mt-4'>
          <button onClick={() => setCalculate(true)}>Calculate</button>
        </div>


        {
          calculate ?
            <Result totalAmount={totalAmount} savingPercent={savingPercent} estiBill={estiBill} ></Result> : null
        }


      </Container >
    </>
  );
}
