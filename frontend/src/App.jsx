import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from our Spring Boot backend
    // fetch('/api/vehicles').then(res => res.json()).then(data => setVehicles(data));
    
    // For demo purposes, we'll mock the data
    setVehicles([
      { id: 1, modelName: '911 Carrera', category: '911', basePrice: 114400, horsepower: 379, zeroToSixty: 4.0, imageUrl: 'https://files.porsche.com/filestore/image/multimedia/none/992-carrera-modelimage-sideshot/model/cfbb8ed3-1a15-11ea-80c6-005056bbdc38/porsche-model.png' },
      { id: 2, modelName: 'Taycan 4S', category: 'Taycan', basePrice: 111100, horsepower: 522, zeroToSixty: 3.8, imageUrl: 'https://files.porsche.com/filestore/image/multimedia/none/j1-taycan-4s-modelimage-sideshot/model/1d3827d0-c3d5-11eb-80d6-005056bbdc38/porsche-model.png' },
      { id: 3, modelName: 'Macan S', category: 'Macan', basePrice: 72300, horsepower: 375, zeroToSixty: 4.6, imageUrl: 'https://files.porsche.com/filestore/image/multimedia/none/macan-s-iii-modelimage-sideshot/model/2c48d281-2292-11ec-80df-005056bbdc38/porsche-model.png' }
    ]);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">PORSCHE</div>
        <nav className="nav">
          <a href="#">Models</a>
          <a href="#">Services</a>
          <a href="#">Experience</a>
          <a href="#">Dealer</a>
        </nav>
      </header>
      
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>The new fully electric Macan.</h1>
            <p>Electrify your senses.</p>
            <button className="cta-button">Discover now</button>
          </div>
        </section>

        <section className="models-section">
          <h2>Models</h2>
          <div className="models-grid">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="model-card">
                <div className="model-image-container">
                  <img src={vehicle.imageUrl} alt={vehicle.modelName} className="model-image" />
                </div>
                <div className="model-info">
                  <h3>{vehicle.modelName}</h3>
                  <div className="model-specs">
                    <span>From ${vehicle.basePrice.toLocaleString()}</span>
                    <span>{vehicle.horsepower} hp</span>
                    <span>{vehicle.zeroToSixty}s 0-60 mph</span>
                  </div>
                  <button className="configure-button">Build & Price</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Porsche Cars North America, Inc.</p>
      </footer>
    </div>
  );
}

export default App;
