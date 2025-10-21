import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

function HOMAIRCalculator({ glucose = '', insulin = '' }) {
  const [glucoseValue, setGlucoseValue] = useState(glucose.toString());
  const [insulinValue, setInsulinValue] = useState(insulin.toString());
  const [result, setResult] = useState(null);

  // EXACT FORMULA from database schema: (fasting_glucose * fasting_insulin) / 405
  const calculateHOMAIR = (e) => {
    e.preventDefault();
    const g = parseFloat(glucoseValue);
    const i = parseFloat(insulinValue);

    if (!g || g <= 0 || !i || i <= 0) {
      setResult({
        value: null,
        interpretation: 'Please enter valid positive numbers for both fields.',
        className: 'badge-info'
      });
      return;
    }

    // Database field calculation: homa_ir = (fasting_glucose * fasting_insulin) / 405
    const homaIR = (g * i) / 405;
    const rounded = homaIR.toFixed(2);

    let interpretation = '';
    let className = '';
    
    if (homaIR < 1.0) {
      interpretation = 'Optimal insulin sensitivity';
      className = 'badge-success';
    } else if (homaIR < 1.9) {
      interpretation = 'Normal insulin sensitivity';
      className = 'badge-success';
    } else if (homaIR < 2.9) {
      interpretation = 'Early insulin resistance';
      className = 'badge-warning';
    } else {
      interpretation = 'Significant insulin resistance';
      className = 'badge-danger';
    }

    setResult({
      value: rounded,
      interpretation,
      className
    });
  };

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      border: '2px solid #f9a8d4',
      marginBottom: '32px'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#831843',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0
        }}>
          <Calculator size={20} />
          HOMA-IR Calculator
        </h3>
      </div>

      <form onSubmit={calculateHOMAIR}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="calc-glucose" className="label">
              Fasting Glucose (mg/dL)
            </label>
            <input
              id="calc-glucose"
              type="number"
              step="0.01"
              className="input"
              value={glucoseValue}
              onChange={(e) => setGlucoseValue(e.target.value)}
              placeholder="90"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="calc-insulin" className="label">
              Fasting Insulin (μU/mL)
            </label>
            <input
              id="calc-insulin"
              type="number"
              step="0.01"
              className="input"
              value={insulinValue}
              onChange={(e) => setInsulinValue(e.target.value)}
              placeholder="10"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #be185d 0%, #9f1239 100%)',
            color: 'white',
            width: '100%'
          }}
        >
          Calculate HOMA-IR
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid #f9a8d4'
        }}>
          {result.value ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  HOMA-IR Score
                </div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#831843' }}>
                  {result.value}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className={`badge ${result.className}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
                  {result.interpretation}
                </span>
              </div>
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>Formula:</strong> (Glucose × Insulin) / 405
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Reference:</strong> Normal &lt; 1.9 | Insulin Resistance ≥ 2.9
                </p>
              </div>
            </>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>
              {result.interpretation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default HOMAIRCalculator;

