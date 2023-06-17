import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pricingConfigs, setPricingConfigs] = useState([]);
  const [config, setConfig] = useState();
  const [distanceBasePrice, setDistanceBasePrice] = useState("")
  const [distanceAdditionalPrice, setDistanceAdditionalPrice] = useState("")
  const [timeMultiplierFactor, setTimeMultiplierFactor] = useState("")

  const [distance, setDistance] = useState('')
  const [time, setTime] = useState("")

  const [price, setPrice] = useState('')

  const dataLoad = async () => {
    const response = await fetch(`http://localhost:8000/api`);
    const data = await response.json();

    if (response.ok) {
      setPricingConfigs(data.Configs)
      // console.log(data)
    }
  };

  useEffect(() => {
    dataLoad();
  }, []);


  const handleConfigSelect = e => {
    const target = e.target;
    if (target.checked) {
      setConfig(target.value);
    }
  };


  const submitPricingConfig = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distanceBasePrice,
        distanceAdditionalPrice,
        timeMultiplierFactor,
      }),
    })

    const data = await response.json()
    console.log(data)
    dataLoad()
  }

  const submitDistanceTime = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distance,
        time,
        config: config
      }),
    })

    const data = await response.json();
    console.log(data)
    setPrice(data.price)

  }


  return (
    <>


      <div className="container">
      

      <h3 className="title">Available Pricing Configs</h3>
      <div className="configs-container">
        <form className="form-group">
          {/* Pricing Configs */}
          {pricingConfigs.map((item) => (
            <div key={item._id} className="config-item">
              <label className="label">{`${item.distanceBasePrice}DBP - ${item.distanceAdditionalPrice}DAP - ${item.timeMultiplierFactor}TMF`}</label>
              <input
                type="radio"
                name="myGroupName"
                value={item._id}
                onChange={handleConfigSelect}
                className="radio-input"
              />
              <br />
            </div>
          ))}
          <br />
        </form>
      </div>

      {/* Create new Pricing Config */}
      <p className="title">Create new Pricing Config</p>
      <div className="form-group">
        <form onSubmit={submitPricingConfig}>
          <label className="label">distanceBasePrice</label>
          <input
            type="text"
            value={distanceBasePrice}
            onChange={(e) => setDistanceBasePrice(e.target.value)}
            className="input-text"
          />
          <br />
          <label className="label">distanceAdditionalPrice</label>
          <input
            type="text"
            value={distanceAdditionalPrice}
            onChange={(e) => setDistanceAdditionalPrice(e.target.value)}
            className="input-text"
          />
          <br />
          <label className="label">timeMultiplierFactor</label>
          <input
            type="text"
            value={timeMultiplierFactor}
            onChange={(e) => setTimeMultiplierFactor(e.target.value)}
            className="input-text"
          />
          <br />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>

      {/* Send distance and time */}
      <p className="title">Send distance and time</p>
      <div className="distance-time-form">
        <form onSubmit={submitDistanceTime}>
          <label className="label">Distance</label>
          <input
            type="text"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="input-text"
          />
          <br />
          <label className="label">Time</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-text"
          />
          <br />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>

      {
        price && <h2>Price is:   {price}</h2>
      }
    </div>
    </>
  )
}

export default App
