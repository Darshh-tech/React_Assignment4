import React from 'react';
import CurrencyConverter from './Components/CurrencyConverter';
import './App.css';

function App() {
  return (
    <div className="apcontainerp-">
      <header className="app-header">
        <h1>Finance Dashboard</h1>
      </header>
      <main>
        <CurrencyConverter />
      </main>
    </div>
  );
}

export default App;