import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from our Spring Boot backend
    // fetch('/api/vehicles').then(res => res.json()).then(data => setVehicles(data));
    
    // For demo purposes, we'll mock the data
    setVehicles([
      { id: 1, modelName: '911 Carrera', category: '911', basePrice: 114400, horsepower: 379, zeroToSixty: 4.0, imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800' },
      { id: 2, modelName: 'Taycan 4S', category: 'Taycan', basePrice: 111100, horsepower: 522, zeroToSixty: 3.8, imageUrl: 'https://images.unsplash.com/photo-1503376760356-5eb6900f13a5?w=800' },
      { id: 3, modelName: 'Macan S', category: 'Macan', basePrice: 72300, horsepower: 375, zeroToSixty: 4.6, imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800' }
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
