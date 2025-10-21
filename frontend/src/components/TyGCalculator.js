import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

function TyGCalculator() {
  const [glucose, setGlucose] = useState('');
  const [triglycerides, setTriglycerides] = useState('');
  const [result, setResult] = useState(null);

  const calculateTyG = (e) => {
    e.preventDefault();
    const gluc = parseFloat(glucose);
    const trig = parseFloat(triglycerides);

    if (!gluc || gluc <= 0 || !trig || trig <= 0) {
      setResult({
        value: null,
        interpretation: 'Please enter valid positive numbers.',
        className: 'badge-info',
        score: 0
      });
      return;
    }

    // TyG Index = Ln[Triglycerides (mg/dL) × Fasting Glucose (mg/dL) / 2]
    const tyg = Math.log(trig * gluc / 2);
    const rounded = tyg.toFixed(2);

    let interpretation = '';
    let className = '';
    let score = 0;

    // TyG Index Categories and PCOS Score (out of 20 points)
    if (tyg < 8.5) {
      interpretation = 'Normal - Low cardiovascular risk';
      className = 'badge-success';
      score = 0;
    } else if (tyg < 8.8) {
      interpretation = 'Borderline - Moderate risk';
      className = 'badge-warning';
      score = 10;
    } else if (tyg < 9.0) {
      interpretation = 'Elevated - High risk';
      className = 'badge-warning';
      score = 15;
    } else {
      interpretation = 'Very High - Very high cardiovascular risk';
      className = 'badge-danger';
      score = 20;
    }

    setResult({
      value: rounded,
      interpretation,
      className,
      score
    });
  };

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      border: '2px solid #fbbf24',
      marginBottom: '32px'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0
        }}>
          <TrendingUp size={20} />
          TyG Index Calculator
        </h3>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 28px' }}>
          Triglyceride-Glucose Index • PCOS Score Impact: 0-20 points
        </p>
      </div>

      <form onSubmit={calculateTyG}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="tyg-glucose" className="label">
              Fasting Glucose (mg/dL)
            </label>
            <input
              id="tyg-glucose"
              type="number"
              step="0.01"
              className="input"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              placeholder="95"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tyg-triglycerides" className="label">
              Triglycerides (mg/dL)
            </label>
            <input
              id="tyg-triglycerides"
              type="number"
              step="0.01"
              className="input"
              value={triglycerides}
              onChange={(e) => setTriglycerides(e.target.value)}
              placeholder="150"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            width: '100%'
          }}
        >
          Calculate TyG Index
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid #fbbf24'
        }}>
          {result.value ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    TyG Index
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#92400e' }}>
                    {result.value}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    PCOS Score
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.score > 10 ? '#dc2626' : '#16a34a' }}>
                    {result.score}/20
                  </div>
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
                  <strong>Formula:</strong> Ln[(Triglycerides × Glucose) / 2]
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Reference:</strong> Normal &lt; 8.5 | High Risk ≥ 9.0
                </p>
                <p style={{ margin: '4px 0', fontSize: '11px', fontStyle: 'italic' }}>
                  TyG Index predicts insulin resistance and cardiovascular risk
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

export default TyGCalculator;

