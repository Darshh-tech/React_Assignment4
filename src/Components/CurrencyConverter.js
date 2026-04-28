import React, { useState, useEffect, useMemo } from 'react';

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currencyNames = useMemo(() => ({
    USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', INR: 'Indian Rupee',
    AUD: 'Australian Dollar', CAD: 'Canadian Dollar', JPY: 'Japanese Yen',
    CHF: 'Swiss Franc', CNY: 'Chinese Yuan', NZD: 'New Zealand Dollar',
    SGD: 'Singapore Dollar', MYR: 'Malaysian Ringgit', THB: 'Thai Baht',
    PHP: 'Philippine Peso', IDR: 'Indonesian Rupiah', VND: 'Vietnamese Dong',
    KRW: 'South Korean Won', BDT: 'Bangladeshi Taka', PKR: 'Pakistani Rupee',
  }), []);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setRates({ [toCurrency]: 1 });
      setLoading(false);
      setError(null);
      return;
    }

    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        if (data.result === "success") {
          setRates(data.rates);
          setError(null);
        } else {
          throw new Error("Failed to fetch rates");
        }
      } catch (err) {
        setError("Connection Error: Check your internet or try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency]);

  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount) || 0;
    if (fromCurrency === toCurrency) return numericAmount.toFixed(2);
    return rates[toCurrency] ? (numericAmount * rates[toCurrency]).toFixed(2) : '0.00';
  }, [amount, toCurrency, rates, fromCurrency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setAmount('');
      return;
    }

    const numericValue = Number(value);
    if (numericValue < 0) return;
    setAmount(numericValue);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="converter-card">
      <h1>Currency Converter</h1>

      {error && <p className="error-msg">{error}</p>}

      <div className="input-group">
        <input
          type="number"
          min="0"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
        />

        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {Object.keys(currencyNames).map(code => (
            <option key={code} value={code}>{code} - {currencyNames[code]}</option>
          ))}
        </select>

        <p style={{ fontWeight: 'bold' }}>TO</p>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          disabled={loading}
        >
          {Object.keys(currencyNames).map(code => (
            <option key={code} value={code}>
              {code} - {currencyNames[code]}
            </option>
          ))}
        </select>

        <button type="button" className="swap-button" onClick={handleSwapCurrencies}>
          Swap
        </button>
      </div>

      {loading ? (
        <p>Updating rates...</p>
      ) : (
        <div className="result-display">
          <p>{amount} {fromCurrency} =</p>
          <h2>{convertedAmount} {toCurrency}</h2>
          <p className="exchange-rate">
            Rate: 1 {fromCurrency} = {fromCurrency === toCurrency ? 1 : rates[toCurrency]} {toCurrency}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;