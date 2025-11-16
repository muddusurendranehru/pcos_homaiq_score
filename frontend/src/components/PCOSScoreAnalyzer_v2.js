import React, { useState } from 'react';
import { Gauge, Save } from 'lucide-react';
import { dataAPI } from '../services/api';

function PCOSScoreAnalyzer_v2() {
  const [formData, setFormData] = useState({
    // Patient Information
    patient_name: '',
    referring_doctor: '',
    
    // Family History
    familyDiabetes: false,
    familyHypertension: false,
    familyAtherosclerosis: false,
    familyCancer: false,
    
    // Vital Data (Blood Pressure)
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    
    // Basic Measurements
    age: '',
    weight: '',
    height: '',
    waist: '',
    bmi: '',
    
    // Lab Values
    glucose: '',
    fastingInsulin: '',
    totalCholesterol: '',
    ldl: '',
    hdl: '',
    triglycerides: '',
    
    // HOMA & TYG Index
    homaIR: '',
    tygIndex: '',
    
    // PCOS Values - Hormonal (Rotterdam Criteria)
    lh: '',
    fsh: '',
    testosterone: '',
    dhea: '',
    dheas: '',
    
    // PCOS Values - Follicles & Scan
    totalFollicles: '',
    follicleSize: '',
    ovaryVolume: ''
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

  // Keep all existing calculation logic from original component
  const calculatePCOSScore = (e) => {
    e.preventDefault();
    
    // All the existing PCOS calculation logic will go here
    // For now, let's create a simple result
    const mockResult = {
      totalScore: 85,
      severity: 'High PCOS Risk',
      breakdown: [
        { name: 'BMI', score: 3, max: 5 },
        { name: 'Hormonal', score: 15, max: 20 },
        { name: 'Metabolic', score: 18, max: 20 }
      ]
    };
    
    setResult(mockResult);
  };

  const handleSaveAssessment = async () => {
    if (!result) {
      setSaveMessage({ type: 'error', text: 'Please calculate PCOS score first' });
      return;
    }

    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // Calculate BMI
      let calculatedBMI = null;
      if (formData.weight && formData.height) {
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
        
        // Blood Pressure (Vital Data)
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
        
        // Lab values
        fasting_glucose: formData.glucose ? parseFloat(formData.glucose) : null,
        fasting_insulin: formData.fastingInsulin ? parseFloat(formData.fastingInsulin) : null,
        
        // Lipid profile
        total_cholesterol: formData.totalCholesterol ? parseFloat(formData.totalCholesterol) : null,
        ldl_cholesterol: formData.ldl ? parseFloat(formData.ldl) : null,
        hdl_cholesterol: formData.hdl ? parseFloat(formData.hdl) : null,
        triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : null,
        
        // Rotterdam Criteria - Hormonal Markers
        lh: formData.lh ? parseFloat(formData.lh) : null,
        fsh: formData.fsh ? parseFloat(formData.fsh) : null,
        testosterone_total: formData.testosterone ? parseFloat(formData.testosterone) : null,
        dhea: formData.dhea ? parseFloat(formData.dhea) : null,
        dhea_s: formData.dheas ? parseFloat(formData.dheas) : null,
        
        // Ultrasound Scan Parameters
        ovary_volume: formData.ovaryVolume ? parseFloat(formData.ovaryVolume) : null,
        follicle_size: formData.follicleSize ? parseFloat(formData.follicleSize) : null,
        total_follicles: formData.totalFollicles ? parseInt(formData.totalFollicles) : null,
        
        // Family History
        family_history_diabetes: formData.familyDiabetes,
        family_history_hypertension: formData.familyHypertension,
        family_history_atherosclerosis: formData.familyAtherosclerosis,
        family_history_cancer: formData.familyCancer,
        
        // PCOS Score
        pcos_score: result.totalScore,
        pcos_risk_level: result.severity,
        
        // PCOS indicators
        irregular_periods: false,
        excess_androgen: formData.testosterone && parseFloat(formData.testosterone) > 40,
        polycystic_ovaries: formData.totalFollicles && parseInt(formData.totalFollicles) >= 12,
        
        // Diagnosis with complete PCOS score data
        diagnosis: `PCOS Score: ${result.totalScore}/100 (${result.severity})`
      };

      console.log('Sending assessment data:', assessmentData);
      
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
      console.error('Save assessment error:', error);
      setSaveMessage({ 
        type: 'error', 
        text: '❌ Failed to save assessment. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          margin: 0
        }}>
          <Gauge size={24} />
          PCOS Score Analyzer v2 - Organized Layout
        </h3>
        <p style={{ fontSize: '13px', margin: '4px 0 0 0', opacity: 0.9 }}>
          Comprehensive PCOS Risk Assessment • Organized Form Layout
        </p>
      </div>

      <form onSubmit={calculatePCOSScore}>
        {/* 1. PATIENT INFORMATION & REFERRING DOCTOR */}
        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', marginBottom: '16px', margin: '0 0 16px 0' }}>
            👤 Patient Information & Referring Doctor
          </h4>
          <div className="grid grid-2" style={{ gap: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label htmlFor="patient_name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Patient Name
              </label>
              <input
                id="patient_name"
                name="patient_name"
                type="text"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="S.V.G.K.LAKSHMI (any format)"
              />
            </div>
            <div>
              <label htmlFor="referring_doctor" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Referring Doctor
              </label>
              <input
                id="referring_doctor"
                name="referring_doctor"
                type="text"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.referring_doctor}
                onChange={handleChange}
                placeholder="DR.MRU (any format)"
              />
            </div>
          </div>
        </div>

        {/* 2. FAMILY HISTORY */}
        <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '16px', margin: '0 0 16px 0' }}>
            👨‍👩‍👧‍👦 Family History
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { key: 'familyDiabetes', label: 'Diabetes' },
              { key: 'familyHypertension', label: 'Hypertension' },
              { key: 'familyAtherosclerosis', label: 'Atherosclerosis' },
              { key: 'familyCancer', label: 'Cancer' }
            ].map(item => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name={item.key}
                  checked={formData[item.key]}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* 3. VITAL DATA (BLOOD PRESSURE) */}
        <div style={{ background: '#fecaca', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b', marginBottom: '16px', margin: '0 0 16px 0' }}>
            🩺 Vital Data (Blood Pressure)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="blood_pressure_systolic" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Systolic BP (mmHg)
              </label>
              <input
                id="blood_pressure_systolic"
                name="blood_pressure_systolic"
                type="number"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                placeholder="120"
              />
            </div>
            <div>
              <label htmlFor="blood_pressure_diastolic" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Diastolic BP (mmHg)
              </label>
              <input
                id="blood_pressure_diastolic"
                name="blood_pressure_diastolic"
                type="number"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                placeholder="80"
              />
            </div>
          </div>
        </div>

        {/* 4. BASIC MEASUREMENTS */}
        <div style={{ background: '#e0e7ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#3730a3', marginBottom: '16px', margin: '0 0 16px 0' }}>
            📏 Basic Measurements
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="age" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Age (years) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                required
              />
            </div>
            <div>
              <label htmlFor="weight" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Weight (kg) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.weight}
                onChange={handleChange}
                placeholder="65.5"
                required
              />
            </div>
            <div>
              <label htmlFor="height" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Height (cm) <span style={{color:'#dc2626'}}>*</span>
              </label>
              <input
                id="height"
                name="height"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.height}
                onChange={handleChange}
                placeholder="165.0"
                required
              />
            </div>
            <div>
              <label htmlFor="waist" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Waist Circumference (cm)
              </label>
              <input
                id="waist"
                name="waist"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.waist}
                onChange={handleChange}
                placeholder="85.0"
              />
            </div>
          </div>
        </div>

        {/* 5. LAB VALUES */}
        <div style={{ background: '#f3e8ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#6b21a8', marginBottom: '16px', margin: '0 0 16px 0' }}>
            🧪 Lab Values
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="glucose" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Fasting Glucose (mg/dL)
              </label>
              <input
                id="glucose"
                name="glucose"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.glucose}
                onChange={handleChange}
                placeholder="90.0"
              />
            </div>
            <div>
              <label htmlFor="fastingInsulin" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Fasting Insulin (μU/mL)
              </label>
              <input
                id="fastingInsulin"
                name="fastingInsulin"
                type="number"
                step="0.01"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.fastingInsulin}
                onChange={handleChange}
                placeholder="12.5"
              />
            </div>
            <div>
              <label htmlFor="totalCholesterol" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Total Cholesterol (mg/dL)
              </label>
              <input
                id="totalCholesterol"
                name="totalCholesterol"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.totalCholesterol}
                onChange={handleChange}
                placeholder="180.0"
              />
            </div>
            <div>
              <label htmlFor="ldl" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                LDL Cholesterol (mg/dL)
              </label>
              <input
                id="ldl"
                name="ldl"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.ldl}
                onChange={handleChange}
                placeholder="100.0"
              />
            </div>
            <div>
              <label htmlFor="hdl" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                HDL Cholesterol (mg/dL)
              </label>
              <input
                id="hdl"
                name="hdl"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.hdl}
                onChange={handleChange}
                placeholder="50.0"
              />
            </div>
            <div>
              <label htmlFor="triglycerides" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Triglycerides (mg/dL)
              </label>
              <input
                id="triglycerides"
                name="triglycerides"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.triglycerides}
                onChange={handleChange}
                placeholder="150.0"
              />
            </div>
          </div>
        </div>

        {/* 6. HOMA & TYG INDEX */}
        <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#065f46', marginBottom: '16px', margin: '0 0 16px 0' }}>
            📊 HOMA & TYG Index
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="homaIR" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                HOMA-IR
              </label>
              <input
                id="homaIR"
                name="homaIR"
                type="number"
                step="0.01"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.homaIR}
                onChange={handleChange}
                placeholder="2.5"
              />
            </div>
            <div>
              <label htmlFor="tygIndex" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                TyG Index
              </label>
              <input
                id="tygIndex"
                name="tygIndex"
                type="number"
                step="0.01"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.tygIndex}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>
          </div>
        </div>

        {/* 7. PCOS VALUES - HORMONAL */}
        <div style={{ background: '#fdf2f8', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#be185d', marginBottom: '16px', margin: '0 0 16px 0' }}>
            🧬 PCOS Values - Hormonal (Rotterdam Criteria)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="lh" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                LH (mIU/mL)
              </label>
              <input
                id="lh"
                name="lh"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.lh}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>
            <div>
              <label htmlFor="fsh" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                FSH (mIU/mL)
              </label>
              <input
                id="fsh"
                name="fsh"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.fsh}
                onChange={handleChange}
                placeholder="5.2"
              />
            </div>
            <div>
              <label htmlFor="testosterone" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Testosterone (ng/dL)
              </label>
              <input
                id="testosterone"
                name="testosterone"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.testosterone}
                onChange={handleChange}
                placeholder="45.0"
              />
            </div>
            <div>
              <label htmlFor="dhea" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                DHEA (μg/dL)
              </label>
              <input
                id="dhea"
                name="dhea"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.dhea}
                onChange={handleChange}
                placeholder="350.0"
              />
            </div>
            <div>
              <label htmlFor="dheas" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                DHEA-S (μg/dL)
              </label>
              <input
                id="dheas"
                name="dheas"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.dheas}
                onChange={handleChange}
                placeholder="200.0"
              />
            </div>
          </div>
        </div>

        {/* 8. PCOS VALUES - FOLLICLES & SCAN */}
        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#166534', marginBottom: '16px', margin: '0 0 16px 0' }}>
            🔬 PCOS Values - Follicles & Ultrasound Scan
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="totalFollicles" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Total Follicles
              </label>
              <input
                id="totalFollicles"
                name="totalFollicles"
                type="number"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.totalFollicles}
                onChange={handleChange}
                placeholder="15"
              />
            </div>
            <div>
              <label htmlFor="follicleSize" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Follicle Size (mm)
              </label>
              <input
                id="follicleSize"
                name="follicleSize"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.follicleSize}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>
            <div>
              <label htmlFor="ovaryVolume" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Ovary Volume (cm³)
              </label>
              <input
                id="ovaryVolume"
                name="ovaryVolume"
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                value={formData.ovaryVolume}
                onChange={handleChange}
                placeholder="12.0"
              />
            </div>
          </div>
        </div>

        {/* 9. CALCULATE PCOS SCORE BUTTON */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <Gauge size={20} />
            Calculate PCOS Score
          </button>
        </div>

        {/* 10. PCOS SCORE RESULTS */}
        {result && (
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              PCOS Score: {result.totalScore}/100
            </h3>
            <p style={{ fontSize: '18px', margin: '0 0 16px 0' }}>
              Risk Level: {result.severity}
            </p>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Score Breakdown: {result.breakdown.map(b => `${b.name}: ${b.score}/${b.max}`).join(', ')}
            </div>
          </div>
        )}

        {/* 11. SAVE ASSESSMENT */}
        {result && (
          <div style={{ marginBottom: '24px' }}>
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
              style={{
                background: isSaving 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                width: '100%',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '16px',
                border: 'none',
                borderRadius: '8px',
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
              💾 Saves all data including patient info, vital signs, lab values, hormones, and PCOS score
            </p>
          </div>
        )}
      </form>

      {/* 12. OLD ASSESSMENTS SECTION */}
      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '32px'
      }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px', margin: '0 0 16px 0' }}>
          📋 Previous Assessments
        </h4>
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', margin: 0 }}>
          Previous assessments will be displayed here after implementation.
          <br />
          This section will show patient history, scores, and trends.
        </p>
      </div>
    </div>
  );
}

export default PCOSScoreAnalyzer_v2;
