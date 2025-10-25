import React, { useState } from 'react';
import { Gauge, Save } from 'lucide-react';
import { dataAPI } from '../services/api';

function PCOSScoreAnalyzer() {
  const [formData, setFormData] = useState({
    // Patient Information
    patient_name: '',
    referring_doctor: '',
    
    // REQUIRED FIELDS FOR BACKEND
    age: '',
    weight: '',
    height: '',
    fastingInsulin: '',
    // Metabolic
    waist: '',
    homaIR: '',
    tygIndex: '',
    bmi: '',
    totalCholesterol: '',
    ldl: '',
    hdl: '',
    triglycerides: '',
    glucose: '',
    totalFollicles: '',
    // Rotterdam Criteria - Hormonal
    lh: '',
    fsh: '',
    testosterone: '',
    dhea: '',
    dheas: '',
    // Scan Parameters
    ovaryVolume: '',
    follicleSize: '',
    // Family History
    familyDiabetes: false,
    familyHypertension: false,
    familyAtherosclerosis: false,
    familyCancer: false
  });
  const [result, setResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculatePCOSScore = (e) => {
    e.preventDefault();
    
    let totalScore = 0;
    const breakdown = [];

    // 1. Waist Circumference (20 points)
    const waist = parseFloat(formData.waist);
    let waistScore = 0;
    if (waist) {
      if (waist < 80) {
        waistScore = 0;
      } else if (waist < 88) {
        waistScore = 10;
      } else {
        waistScore = 20;
      }
      breakdown.push({ name: 'Waist Circumference', score: waistScore, max: 20 });
      totalScore += waistScore;
    }

    // 2. Insulin Resistance - HOMA-IR (20 points)
    const homaIR = parseFloat(formData.homaIR);
    let homaScore = 0;
    if (homaIR) {
      if (homaIR < 1.0) {
        homaScore = 0;
      } else if (homaIR < 1.9) {
        homaScore = 5;
      } else if (homaIR < 2.9) {
        homaScore = 15;
      } else {
        homaScore = 20;
      }
      breakdown.push({ name: 'HOMA-IR (Insulin Resistance)', score: homaScore, max: 20 });
      totalScore += homaScore;
    }

    // 3. TyG Index (20 points)
    const tygIndex = parseFloat(formData.tygIndex);
    let tygScore = 0;
    if (tygIndex) {
      if (tygIndex < 8.5) {
        tygScore = 0;
      } else if (tygIndex < 8.8) {
        tygScore = 10;
      } else if (tygIndex < 9.0) {
        tygScore = 15;
      } else {
        tygScore = 20;
      }
      breakdown.push({ name: 'TyG Index', score: tygScore, max: 20 });
      totalScore += tygScore;
    }

    // 4. BMI (5 points)
    const bmi = parseFloat(formData.bmi);
    let bmiScore = 0;
    if (bmi) {
      if (bmi < 18.5) {
        bmiScore = 1;
      } else if (bmi < 25) {
        bmiScore = 0;
      } else if (bmi < 30) {
        bmiScore = 2;
      } else if (bmi < 35) {
        bmiScore = 3;
      } else if (bmi < 40) {
        bmiScore = 4;
      } else {
        bmiScore = 5;
      }
      breakdown.push({ name: 'BMI', score: bmiScore, max: 5 });
      totalScore += bmiScore;
    }

    // 5. Blood Tests (5 points each)
    // Total Cholesterol
    const totalChol = parseFloat(formData.totalCholesterol);
    if (totalChol) {
      const cholScore = totalChol >= 200 ? 5 : totalChol >= 180 ? 3 : 0;
      breakdown.push({ name: 'Total Cholesterol', score: cholScore, max: 5 });
      totalScore += cholScore;
    }

    // LDL
    const ldl = parseFloat(formData.ldl);
    if (ldl) {
      const ldlScore = ldl >= 130 ? 5 : ldl >= 100 ? 3 : 0;
      breakdown.push({ name: 'LDL Cholesterol', score: ldlScore, max: 5 });
      totalScore += ldlScore;
    }

    // HDL
    const hdl = parseFloat(formData.hdl);
    if (hdl) {
      const hdlScore = hdl < 40 ? 5 : hdl < 50 ? 3 : 0;
      breakdown.push({ name: 'HDL Cholesterol', score: hdlScore, max: 5 });
      totalScore += hdlScore;
    }

    // Triglycerides
    const trig = parseFloat(formData.triglycerides);
    if (trig) {
      const trigScore = trig >= 150 ? 5 : trig >= 100 ? 3 : 0;
      breakdown.push({ name: 'Triglycerides', score: trigScore, max: 5 });
      totalScore += trigScore;
    }

    // Glucose
    const glucose = parseFloat(formData.glucose);
    if (glucose) {
      const glucScore = glucose >= 100 ? 5 : glucose >= 90 ? 3 : 0;
      breakdown.push({ name: 'Fasting Glucose', score: glucScore, max: 5 });
      totalScore += glucScore;
    }

    // 6. Follicle Scan (5 points)
    const follicles = parseInt(formData.totalFollicles);
    if (follicles) {
      const follicleScore = follicles >= 12 ? 5 : follicles >= 8 ? 3 : 0;
      breakdown.push({ name: 'Ovarian Follicles', score: follicleScore, max: 5 });
      totalScore += follicleScore;
    }

    // 7. Rotterdam Criteria - Hormonal Markers (5 points each)
    // LH (Luteinizing Hormone)
    const lh = parseFloat(formData.lh);
    if (lh) {
      const lhScore = lh > 10 ? 5 : lh > 7 ? 3 : 0;
      breakdown.push({ name: 'LH Level', score: lhScore, max: 5 });
      totalScore += lhScore;
    }

    // FSH (Follicle Stimulating Hormone)
    const fsh = parseFloat(formData.fsh);
    if (fsh) {
      const fshScore = fsh < 5 ? 3 : 0; // Low FSH concerning in PCOS
      breakdown.push({ name: 'FSH Level', score: fshScore, max: 5 });
      totalScore += fshScore;
    }

    // LH/FSH Ratio
    if (lh && fsh && fsh > 0) {
      const lhFshRatio = lh / fsh;
      const ratioScore = lhFshRatio >= 3 ? 5 : lhFshRatio >= 2 ? 3 : 0;
      breakdown.push({ name: 'LH/FSH Ratio', score: ratioScore, max: 5 });
      totalScore += ratioScore;
    }

    // Serum Total Testosterone
    const testosterone = parseFloat(formData.testosterone);
    if (testosterone) {
      const testScore = testosterone > 50 ? 5 : testosterone > 40 ? 3 : 0; // ng/dL
      breakdown.push({ name: 'Total Testosterone', score: testScore, max: 5 });
      totalScore += testScore;
    }

    // DHEA
    const dhea = parseFloat(formData.dhea);
    if (dhea) {
      const dheaScore = dhea > 800 ? 5 : dhea > 600 ? 3 : 0; // μg/dL
      breakdown.push({ name: 'DHEA', score: dheaScore, max: 5 });
      totalScore += dheaScore;
    }

    // DHEA-S
    const dheas = parseFloat(formData.dheas);
    if (dheas) {
      const dheasScore = dheas > 250 ? 5 : dheas > 200 ? 3 : 0; // μg/dL
      breakdown.push({ name: 'DHEA-S', score: dheasScore, max: 5 });
      totalScore += dheasScore;
    }

    // 8. Scan Parameters (5 points each)
    // Ovary Volume
    const ovaryVolume = parseFloat(formData.ovaryVolume);
    if (ovaryVolume) {
      const volumeScore = ovaryVolume > 10 ? 5 : ovaryVolume > 7 ? 3 : 0; // cm³
      breakdown.push({ name: 'Ovary Volume', score: volumeScore, max: 5 });
      totalScore += volumeScore;
    }

    // Follicle Size
    const follicleSize = parseFloat(formData.follicleSize);
    if (follicleSize) {
      const sizeScore = follicleSize >= 8 && follicleSize <= 10 ? 5 : 0; // mm (2-9mm is PCOS criteria)
      breakdown.push({ name: 'Follicle Size', score: sizeScore, max: 5 });
      totalScore += sizeScore;
    }

    // 9. Family History (2 points each)
    if (formData.familyDiabetes) {
      breakdown.push({ name: 'Family History: Diabetes', score: 2, max: 2 });
      totalScore += 2;
    }
    if (formData.familyHypertension) {
      breakdown.push({ name: 'Family History: Hypertension', score: 2, max: 2 });
      totalScore += 2;
    }
    if (formData.familyAtherosclerosis) {
      breakdown.push({ name: 'Family History: Atherosclerosis', score: 2, max: 2 });
      totalScore += 2;
    }
    if (formData.familyCancer) {
      breakdown.push({ name: 'Family History: Cancer', score: 2, max: 2 });
      totalScore += 2;
    }

    // Determine severity
    let severity = '';
    let severityClass = '';
    if (totalScore < 20) {
      severity = 'Low Risk';
      severityClass = 'badge-success';
    } else if (totalScore < 40) {
      severity = 'Mild PCOS Indicators';
      severityClass = 'badge-info';
    } else if (totalScore < 60) {
      severity = 'Moderate PCOS Risk';
      severityClass = 'badge-warning';
    } else if (totalScore < 80) {
      severity = 'High PCOS Risk';
      severityClass = 'badge-danger';
    } else {
      severity = 'Very High PCOS Risk';
      severityClass = 'badge-danger';
    }

    setResult({
      totalScore,
      breakdown,
      severity,
      severityClass
    });
  };

  const handleSaveAssessment = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // Auto-calculate BMI if weight and height are provided but BMI isn't
      let calculatedBMI = formData.bmi ? parseFloat(formData.bmi) : null;
      if (!calculatedBMI && formData.weight && formData.height) {
        const weightKg = parseFloat(formData.weight);
        const heightM = parseFloat(formData.height) / 100;
        calculatedBMI = weightKg / (heightM * heightM);
        calculatedBMI = parseFloat(calculatedBMI.toFixed(2));
      }

      // Prepare assessment data for database
      const assessmentData = {
        // Patient Information
        patient_name: formData.patient_name || null,
        referring_doctor: formData.referring_doctor || null,
        
        assessment_date: new Date().toISOString().split('T')[0],
        age: formData.age ? parseInt(formData.age) : null,
        weight_kg: formData.weight ? parseFloat(formData.weight) : null,
        height_cm: formData.height ? parseFloat(formData.height) : null,
        bmi: calculatedBMI,
        waist_circumference: formData.waist ? parseFloat(formData.waist) : null,
        
        // Lab values
        fasting_glucose: formData.glucose ? parseFloat(formData.glucose) : null,
        fasting_insulin: formData.fastingInsulin ? parseFloat(formData.fastingInsulin) : null,
        
        // Lipid profile
        total_cholesterol: formData.totalCholesterol ? parseFloat(formData.totalCholesterol) : null,
        ldl_cholesterol: formData.ldl ? parseFloat(formData.ldl) : null,
        hdl_cholesterol: formData.hdl ? parseFloat(formData.hdl) : null,
        triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : null,
        
        // Rotterdam Criteria - Hormonal Markers (NEW!)
        lh: formData.lh ? parseFloat(formData.lh) : null,
        fsh: formData.fsh ? parseFloat(formData.fsh) : null,
        // lh_fsh_ratio will be auto-calculated by database trigger
        testosterone_total: formData.testosterone ? parseFloat(formData.testosterone) : null,
        dhea: formData.dhea ? parseFloat(formData.dhea) : null,
        dhea_s: formData.dheas ? parseFloat(formData.dheas) : null,
        
        // Ultrasound Scan Parameters (NEW!)
        ovary_volume: formData.ovaryVolume ? parseFloat(formData.ovaryVolume) : null,
        follicle_size: formData.follicleSize ? parseFloat(formData.follicleSize) : null,
        total_follicles: formData.totalFollicles ? parseInt(formData.totalFollicles) : null,
        
        // Family History (NEW!)
        family_history_diabetes: formData.familyDiabetes,
        family_history_hypertension: formData.familyHypertension,
        family_history_atherosclerosis: formData.familyAtherosclerosis,
        family_history_cancer: formData.familyCancer,
        
        // PCOS Score (NEW!)
        pcos_score: result.totalScore,
        pcos_risk_level: result.severity,
        
        // PCOS indicators
        irregular_periods: false,
        excess_androgen: formData.testosterone && parseFloat(formData.testosterone) > 40,
        polycystic_ovaries: formData.totalFollicles && parseInt(formData.totalFollicles) >= 12,
        
        // Diagnosis with complete PCOS score data
        diagnosis: `PCOS Score: ${result.totalScore}/100 (${result.severity})
        
Rotterdam Criteria:
- LH: ${formData.lh || 'N/A'} mIU/mL
- FSH: ${formData.fsh || 'N/A'} mIU/mL
- LH/FSH Ratio: ${formData.lh && formData.fsh ? (parseFloat(formData.lh) / parseFloat(formData.fsh)).toFixed(2) : 'N/A'}
- Testosterone: ${formData.testosterone || 'N/A'} ng/dL
- DHEA: ${formData.dhea || 'N/A'} μg/dL
- DHEA-S: ${formData.dheas || 'N/A'} μg/dL

Metabolic Markers:
- HOMA-IR: ${formData.homaIR || 'N/A'}
- TyG Index: ${formData.tygIndex || 'N/A'}
- Waist: ${formData.waist || 'N/A'} cm

Scan Parameters:
- Ovary Volume: ${formData.ovaryVolume || 'N/A'} cm³
- Follicle Size: ${formData.follicleSize || 'N/A'} mm
- Follicle Count: ${formData.totalFollicles || 'N/A'}

Family History:
- Diabetes: ${formData.familyDiabetes ? 'Yes' : 'No'}
- Hypertension: ${formData.familyHypertension ? 'Yes' : 'No'}
- Atherosclerosis: ${formData.familyAtherosclerosis ? 'Yes' : 'No'}
- Cancer: ${formData.familyCancer ? 'Yes' : 'No'}

Score Breakdown: ${result.breakdown.map(b => `${b.name}: ${b.score}/${b.max}`).join(', ')}`
      };

      console.log('Sending assessment data:', assessmentData);
      console.log('Assessment data field count:', Object.keys(assessmentData).length);
      console.log('BMI calculated:', calculatedBMI);
      
      const response = await dataAPI.create(assessmentData);
      
      if (response.success) {
        setSaveMessage({ 
          type: 'success', 
          text: '✅ Assessment saved successfully to database!' 
        });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setSaveMessage({ type: '', text: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('❌ Error saving assessment:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Full error:', JSON.stringify(error.response?.data, null, 2));
      
      let errorMessage = 'Failed to save assessment';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error - Check backend terminal for details: ' + (error.response?.data?.message || 'Database error');
      } else if (error.response?.data?.errors) {
        // Validation errors
        errorMessage = error.response.data.errors.map(e => `${e.path || e.param}: ${e.msg}`).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSaveMessage({ 
        type: 'error', 
        text: '❌ ' + errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSpeedometerColor = (score) => {
    if (score < 20) return '#10b981'; // Green (0-20)
    if (score < 40) return '#fbbf24'; // Yellow/Light Orange (20-40)
    if (score < 60) return '#f97316'; // Orange-Red (40-60)
    if (score < 80) return '#ef4444'; // Red (60-80)
    return '#7f1d1d'; // Dark Red (80-100)
  };

  const renderSpeedometer = (score) => {
    const color = getSpeedometerColor(score);
    const percentage = score;
    const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

    return (
      <div style={{ position: 'relative', width: '200px', height: '120px', margin: '0 auto' }}>
        {/* Speedometer arc */}
        <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          {/* Colored arc segments */}
          <path
            d="M 20 100 A 80 80 0 0 1 56 42"
            fill="none"
            stroke="#10b981"
            strokeWidth="20"
          />
          <path
            d="M 56 42 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="20"
          />
          <path
            d="M 100 20 A 80 80 0 0 1 144 42"
            fill="none"
            stroke="#f97316"
            strokeWidth="20"
          />
          <path
            d="M 144 42 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="20"
          />
          <path
            d="M 164 69 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#7f1d1d"
            strokeWidth="20"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={color}
            strokeWidth="3"
            transform={`rotate(${rotation}, 100, 100)`}
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="5" fill={color} />
        </svg>
        {/* Score text */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          fontWeight: 'bold',
          color: color
        }}>
          {score}/100
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      border: '2px solid #ec4899',
      marginBottom: '32px'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#831843',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0
        }}>
          <Gauge size={24} />
          PCOS Score Analyzer
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 32px' }}>
          Comprehensive PCOS Risk Assessment (100-Point Scale) • Female Health Metric
        </p>
      </div>

      <form onSubmit={calculatePCOSScore}>
        {/* PATIENT INFORMATION */}
        <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '12px', margin: 0 }}>
            👤 Patient Information
          </h4>
          <div className="grid grid-2" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label htmlFor="patient_name" className="label">
                Patient Name
              </label>
              <input
                id="patient_name"
                name="patient_name"
                type="text"
                className="input"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="S.V.G.K.LAKSHMI (any format)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="referring_doctor" className="label">
                Referring Doctor
              </label>
              <input
                id="referring_doctor"
                name="referring_doctor"
                type="text"
                className="input"
                value={formData.referring_doctor}
                onChange={handleChange}
                placeholder="DR.MRU (any format)"
              />
            </div>
          </div>
        </div>

        {/* REQUIRED BASIC INFORMATION */}
        <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '12px', margin: 0 }}>
            📋 Required Basic Information
          </h4>
          <div className="grid grid-2" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label htmlFor="age" className="label">
                Age (years) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                className="input"
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight" className="label">
                Weight (kg) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                className="input"
                value={formData.weight}
                onChange={handleChange}
                placeholder="65.5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height" className="label">
                Height (cm) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="height"
                name="height"
                type="number"
                step="0.1"
                className="input"
                value={formData.height}
                onChange={handleChange}
                placeholder="165.0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fastingInsulin" className="label">
                Fasting Insulin (μU/mL) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="fastingInsulin"
                name="fastingInsulin"
                type="number"
                step="0.01"
                className="input"
                value={formData.fastingInsulin}
                onChange={handleChange}
                placeholder="12.5"
                required
              />
            </div>
          </div>
        </div>

        {/* PCOS ASSESSMENT METRICS */}
        <div className="grid grid-2" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label htmlFor="waist" className="label">
              Waist Circumference (cm) <span style={{color:'#ef4444',fontSize:'10px'}}>20pts</span>
            </label>
            <input
              id="waist"
              name="waist"
              type="number"
              step="0.1"
              className="input"
              value={formData.waist}
              onChange={handleChange}
              placeholder="82.0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="homaIR" className="label">
              HOMA-IR <span style={{color:'#ef4444',fontSize:'10px'}}>20pts</span>
            </label>
            <input
              id="homaIR"
              name="homaIR"
              type="number"
              step="0.01"
              className="input"
              value={formData.homaIR}
              onChange={handleChange}
              placeholder="2.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tygIndex" className="label">
              TyG Index <span style={{color:'#ef4444',fontSize:'10px'}}>20pts</span>
            </label>
            <input
              id="tygIndex"
              name="tygIndex"
              type="number"
              step="0.01"
              className="input"
              value={formData.tygIndex}
              onChange={handleChange}
              placeholder="8.7"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bmi" className="label">
              BMI <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="bmi"
              name="bmi"
              type="number"
              step="0.1"
              className="input"
              value={formData.bmi}
              onChange={handleChange}
              placeholder="24.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalCholesterol" className="label">
              Total Cholesterol (mg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="totalCholesterol"
              name="totalCholesterol"
              type="number"
              step="0.1"
              className="input"
              value={formData.totalCholesterol}
              onChange={handleChange}
              placeholder="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ldl" className="label">
              LDL Cholesterol (mg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="ldl"
              name="ldl"
              type="number"
              step="0.1"
              className="input"
              value={formData.ldl}
              onChange={handleChange}
              placeholder="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hdl" className="label">
              HDL Cholesterol (mg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="hdl"
              name="hdl"
              type="number"
              step="0.1"
              className="input"
              value={formData.hdl}
              onChange={handleChange}
              placeholder="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="triglycerides" className="label">
              Triglycerides (mg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="triglycerides"
              name="triglycerides"
              type="number"
              step="0.1"
              className="input"
              value={formData.triglycerides}
              onChange={handleChange}
              placeholder="150"
            />
          </div>

          <div className="form-group">
            <label htmlFor="glucose" className="label">
              Fasting Glucose (mg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="glucose"
              name="glucose"
              type="number"
              step="0.1"
              className="input"
              value={formData.glucose}
              onChange={handleChange}
              placeholder="95"
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalFollicles" className="label">
              Total Ovarian Follicles <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
            </label>
            <input
              id="totalFollicles"
              name="totalFollicles"
              type="number"
              className="input"
              value={formData.totalFollicles}
              onChange={handleChange}
              placeholder="12"
            />
          </div>
        </div>

        {/* Rotterdam Criteria - Hormonal Markers */}
        <div style={{ 
          marginTop: '24px', 
          marginBottom: '16px', 
          padding: '12px', 
          background: '#fef3c7', 
          borderRadius: '6px',
          border: '2px solid #f59e0b'
        }}>
          <h4 style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            color: '#92400e', 
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔬 Rotterdam Criteria - Hormonal Markers
          </h4>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="lh" className="label">
                LH (mIU/mL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="lh"
                name="lh"
                type="number"
                step="0.01"
                className="input"
                value={formData.lh}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fsh" className="label">
                FSH (mIU/mL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="fsh"
                name="fsh"
                type="number"
                step="0.01"
                className="input"
                value={formData.fsh}
                onChange={handleChange}
                placeholder="4.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="testosterone" className="label">
                Total Testosterone (ng/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="testosterone"
                name="testosterone"
                type="number"
                step="0.01"
                className="input"
                value={formData.testosterone}
                onChange={handleChange}
                placeholder="45"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dhea" className="label">
                DHEA (μg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="dhea"
                name="dhea"
                type="number"
                step="0.01"
                className="input"
                value={formData.dhea}
                onChange={handleChange}
                placeholder="700"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dheas" className="label">
                DHEA-S (μg/dL) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="dheas"
                name="dheas"
                type="number"
                step="0.01"
                className="input"
                value={formData.dheas}
                onChange={handleChange}
                placeholder="225"
              />
            </div>

            {formData.lh && formData.fsh && formData.fsh > 0 && (
              <div style={{
                padding: '12px',
                background: '#fff',
                borderRadius: '6px',
                border: '2px solid #10b981',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  LH/FSH Ratio <span style={{color:'#ef4444',fontSize:'10px'}}>5pts auto</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                  {(parseFloat(formData.lh) / parseFloat(formData.fsh)).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scan Parameters */}
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          background: '#e0f2fe', 
          borderRadius: '6px',
          border: '2px solid #0284c7'
        }}>
          <h4 style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            color: '#075985', 
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Ultrasound Scan Parameters
          </h4>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="ovaryVolume" className="label">
                Ovary Volume (cm³) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="ovaryVolume"
                name="ovaryVolume"
                type="number"
                step="0.1"
                className="input"
                value={formData.ovaryVolume}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="follicleSize" className="label">
                Follicle Size (mm) <span style={{color:'#ef4444',fontSize:'10px'}}>5pts</span>
              </label>
              <input
                id="follicleSize"
                name="follicleSize"
                type="number"
                step="0.1"
                className="input"
                value={formData.follicleSize}
                onChange={handleChange}
                placeholder="8.5"
              />
              <small style={{ fontSize: '10px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
                PCOS criteria: 2-9mm follicles
              </small>
            </div>
          </div>
        </div>

        {/* Family History */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          background: '#fee2e2', 
          borderRadius: '6px',
          border: '2px solid #dc2626'
        }}>
          <h4 style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            color: '#991b1b', 
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👨‍👩‍👧 Family History Risk Factors
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              padding: '8px',
              background: 'white',
              borderRadius: '4px',
              border: formData.familyDiabetes ? '2px solid #dc2626' : '2px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                name="familyDiabetes"
                checked={formData.familyDiabetes}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                Diabetes <span style={{color:'#ef4444',fontSize:'10px'}}>2pts</span>
              </span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              padding: '8px',
              background: 'white',
              borderRadius: '4px',
              border: formData.familyHypertension ? '2px solid #dc2626' : '2px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                name="familyHypertension"
                checked={formData.familyHypertension}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                Hypertension <span style={{color:'#ef4444',fontSize:'10px'}}>2pts</span>
              </span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              padding: '8px',
              background: 'white',
              borderRadius: '4px',
              border: formData.familyAtherosclerosis ? '2px solid #dc2626' : '2px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                name="familyAtherosclerosis"
                checked={formData.familyAtherosclerosis}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                Atherosclerosis <span style={{color:'#ef4444',fontSize:'10px'}}>2pts</span>
              </span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              padding: '8px',
              background: 'white',
              borderRadius: '4px',
              border: formData.familyCancer ? '2px solid #dc2626' : '2px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                name="familyCancer"
                checked={formData.familyCancer}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                Cancer <span style={{color:'#ef4444',fontSize:'10px'}}>2pts</span>
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            color: 'white',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Calculate PCOS Score
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          border: '3px solid #ec4899'
        }}>
          {/* Speedometer */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ textAlign: 'center', fontSize: '16px', color: '#831843', marginBottom: '16px' }}>
              PCOS Risk Score
            </h4>
            {renderSpeedometer(result.totalScore)}
          </div>

          {/* Severity Badge */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span className={`badge ${result.severityClass}`} style={{ fontSize: '16px', padding: '10px 20px' }}>
              {result.severity}
            </span>
          </div>

          {/* Score Breakdown */}
          <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#831843' }}>
              Score Breakdown:
            </h4>
            {result.breakdown.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{ fontSize: '13px', color: '#374151' }}>{item.name}</span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 'bold',
                  color: item.score > item.max / 2 ? '#dc2626' : '#16a34a'
                }}>
                  {item.score}/{item.max}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#374151'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Speedometer Color Guide:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px' }}>
              <span style={{ padding: '4px 8px', background: '#10b981', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                0-20: Green (Low Risk)
              </span>
              <span style={{ padding: '4px 8px', background: '#fbbf24', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                20-40: Yellow (Mild)
              </span>
              <span style={{ padding: '4px 8px', background: '#f97316', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                40-60: Orange-Red (Moderate)
              </span>
              <span style={{ padding: '4px 8px', background: '#ef4444', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                60-80: Red (High)
              </span>
              <span style={{ padding: '4px 8px', background: '#7f1d1d', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                80-100: Dark Red (Very High)
              </span>
            </div>
          </div>

          {/* Save Assessment Button */}
          <div style={{ marginTop: '24px', borderTop: '2px solid #ec4899', paddingTop: '20px' }}>
            {saveMessage.text && (
              <div style={{
                padding: '12px',
                background: saveMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: saveMessage.type === 'success' ? '#065f46' : '#991b1b',
                borderRadius: '6px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {saveMessage.text}
              </div>
            )}

            <button
              onClick={handleSaveAssessment}
              disabled={isSaving}
              className="btn"
              style={{
                background: isSaving 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                width: '100%',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={24} />
              {isSaving ? 'Saving to Database...' : 'Save Complete Assessment to Database'}
            </button>

            <p style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              💾 Saves all Rotterdam criteria, scan data, metabolic markers, and family history to your records
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PCOSScoreAnalyzer;

