import React, { useState } from 'react';
import { Activity } from 'lucide-react';

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!w || w <= 0 || !h || h <= 0) {
      setResult({
        value: null,
        category: 'Please enter valid positive numbers.',
        className: 'badge-info',
        score: 0
      });
      return;
    }

    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    const rounded = bmi.toFixed(1);

    let category = '';
    let className = '';
    let score = 0;

    // BMI Categories and PCOS Score (out of 5 points)
    if (bmi < 18.5) {
      category = 'Underweight';
      className = 'badge-info';
      score = 1;
    } else if (bmi < 25) {
      category = 'Normal weight';
      className = 'badge-success';
      score = 0;
    } else if (bmi < 30) {
      category = 'Overweight';
      className = 'badge-warning';
      score = 2;
    } else if (bmi < 35) {
      category = 'Obesity Class I';
      className = 'badge-danger';
      score = 3;
    } else if (bmi < 40) {
      category = 'Obesity Class II';
      className = 'badge-danger';
      score = 4;
    } else {
      category = 'Obesity Class III';
      className = 'badge-danger';
      score = 5;
    }

    setResult({
      value: rounded,
      category,
      className,
      score
    });
  };

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
      border: '2px solid #60a5fa',
      marginBottom: '32px'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0
        }}>
          <Activity size={20} />
          BMI Calculator
        </h3>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 28px' }}>
          Body Mass Index • PCOS Score Impact: 0-5 points
        </p>
      </div>

      <form onSubmit={calculateBMI}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="bmi-weight" className="label">
              Weight (kg)
            </label>
            <input
              id="bmi-weight"
              type="number"
              step="0.1"
              className="input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="65.5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bmi-height" className="label">
              Height (cm)
            </label>
            <input
              id="bmi-height"
              type="number"
              step="0.1"
              className="input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="165"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            width: '100%'
          }}
        >
          Calculate BMI
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid #60a5fa'
        }}>
          {result.value ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    BMI Value
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>
                    {result.value}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    PCOS Score
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.score > 2 ? '#dc2626' : '#16a34a' }}>
                    {result.score}/5
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className={`badge ${result.className}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
                  {result.category}
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
                  <strong>Formula:</strong> Weight(kg) / [Height(m)]²
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Healthy Range:</strong> 18.5 - 24.9
                </p>
              </div>
            </>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>
              {result.category}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default BMICalculator;

