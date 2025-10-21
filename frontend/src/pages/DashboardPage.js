import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, Plus, FileText, Trash2, TrendingUp } from 'lucide-react';
import { dataAPI, authAPI } from '../services/api';
import HOMAIRCalculator from '../components/HOMAIRCalculator';
import BMICalculator from '../components/BMICalculator';
import TyGCalculator from '../components/TyGCalculator';
import PCOSScoreAnalyzer from '../components/PCOSScoreAnalyzer';

function DashboardPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    weight_kg: '',
    height_cm: '',
    bmi: '',
    irregular_periods: false,
    excess_androgen: false,
    polycystic_ovaries: false,
    fasting_glucose: '',
    fasting_insulin: '',
    total_cholesterol: '',
    ldl_cholesterol: '',
    hdl_cholesterol: '',
    triglycerides: '',
    total_follicles: '',
    follicles_0_12: '',
    follicles_12_24: '',
    follicles_24_36: '',
    follicles_above_36: '',
    waist_circumference: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    diagnosis: '',
    assessment_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    setUserEmail(email || 'User');
    fetchAssessments();
    fetchStats();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await dataAPI.getAll();
      setAssessments(response.data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setError('Failed to load assessments');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await dataAPI.getStats();
      setStats(response.data || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      navigate('/login', { replace: true });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert string values to numbers where appropriate
      const assessmentData = {
        age: formData.age ? parseInt(formData.age) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        bmi: formData.bmi ? parseFloat(formData.bmi) : null,
        irregular_periods: formData.irregular_periods,
        excess_androgen: formData.excess_androgen,
        polycystic_ovaries: formData.polycystic_ovaries,
        fasting_glucose: formData.fasting_glucose ? parseFloat(formData.fasting_glucose) : null,
        fasting_insulin: formData.fasting_insulin ? parseFloat(formData.fasting_insulin) : null,
        total_cholesterol: formData.total_cholesterol ? parseFloat(formData.total_cholesterol) : null,
        ldl_cholesterol: formData.ldl_cholesterol ? parseFloat(formData.ldl_cholesterol) : null,
        hdl_cholesterol: formData.hdl_cholesterol ? parseFloat(formData.hdl_cholesterol) : null,
        triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : null,
        total_follicles: formData.total_follicles ? parseInt(formData.total_follicles) : null,
        follicles_0_12: formData.follicles_0_12 ? parseInt(formData.follicles_0_12) : null,
        follicles_12_24: formData.follicles_12_24 ? parseInt(formData.follicles_12_24) : null,
        follicles_24_36: formData.follicles_24_36 ? parseInt(formData.follicles_24_36) : null,
        follicles_above_36: formData.follicles_above_36 ? parseInt(formData.follicles_above_36) : null,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : null,
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
        diagnosis: formData.diagnosis || null,
        assessment_date: formData.assessment_date || null,
      };

      const response = await dataAPI.create(assessmentData);
      
      if (response.success) {
        setSuccess('Assessment created successfully!');
        setShowAddForm(false);
        // Reset form
        setFormData({
          age: '',
          weight_kg: '',
          height_cm: '',
          bmi: '',
          irregular_periods: false,
          excess_androgen: false,
          polycystic_ovaries: false,
          fasting_glucose: '',
          fasting_insulin: '',
          total_cholesterol: '',
          ldl_cholesterol: '',
          hdl_cholesterol: '',
          triglycerides: '',
          total_follicles: '',
          follicles_0_12: '',
          follicles_12_24: '',
          follicles_24_36: '',
          follicles_above_36: '',
          waist_circumference: '',
          blood_pressure_systolic: '',
          blood_pressure_diastolic: '',
          diagnosis: '',
          assessment_date: new Date().toISOString().split('T')[0],
        });
        // Refresh data
        fetchAssessments();
        fetchStats();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      setError(error.response?.data?.message || 'Failed to create assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await dataAPI.delete(id);
      setSuccess('Assessment deleted successfully!');
      fetchAssessments();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      setError('Failed to delete assessment');
    }
  };

  const interpretHOMAIR = (homaIR) => {
    if (!homaIR) return { text: 'N/A', className: 'badge-info' };
    const value = parseFloat(homaIR);
    if (value < 1.0) return { text: 'Optimal', className: 'badge-success' };
    if (value < 1.9) return { text: 'Normal', className: 'badge-success' };
    if (value < 2.9) return { text: 'Early IR', className: 'badge-warning' };
    return { text: 'Significant IR', className: 'badge-danger' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container" style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={32} color="#667eea" />
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                PCOS HOMA-IQ Score
              </h1>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Assessment Dashboard
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              <strong>{userEmail}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '32px 20px' }}>
        {/* Success/Error Messages */}
        {success && (
          <div style={{
            padding: '12px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}
        {error && (
          <div style={{
            padding: '12px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: '32px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                Total Assessments
              </span>
              <FileText size={20} color="#667eea" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
              {stats?.total_assessments || 0}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                Avg HOMA-IR
              </span>
              <TrendingUp size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
              {stats?.avg_homa_ir ? parseFloat(stats.avg_homa_ir).toFixed(2) : 'N/A'}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                Avg BMI
              </span>
              <Activity size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
              {stats?.avg_bmi ? parseFloat(stats.avg_bmi).toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Health Calculators */}
        <HOMAIRCalculator />
        <BMICalculator />
        <TyGCalculator />
        
        {/* PCOS Score Analyzer */}
        <PCOSScoreAnalyzer />

        {/* Assessments Section */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Your Assessments
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                View and manage your PCOS assessment history
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              <Plus size={18} />
              {showAddForm ? 'Cancel' : 'New Assessment'}
            </button>
          </div>

          {/* Add Assessment Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} style={{
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                Add New Assessment
              </h3>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="assessment_date" className="label">Assessment Date</label>
                  <input
                    type="date"
                    id="assessment_date"
                    name="assessment_date"
                    className="input"
                    value={formData.assessment_date}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age" className="label">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="input"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="28"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight_kg" className="label">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="weight_kg"
                    name="weight_kg"
                    className="input"
                    value={formData.weight_kg}
                    onChange={handleInputChange}
                    placeholder="65.5"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height_cm" className="label">Height (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="height_cm"
                    name="height_cm"
                    className="input"
                    value={formData.height_cm}
                    onChange={handleInputChange}
                    placeholder="165"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bmi" className="label">BMI</label>
                  <input
                    type="number"
                    step="0.01"
                    id="bmi"
                    name="bmi"
                    className="input"
                    value={formData.bmi}
                    onChange={handleInputChange}
                    placeholder="24.1"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="waist_circumference" className="label">Waist Circumference (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="waist_circumference"
                    name="waist_circumference"
                    className="input"
                    value={formData.waist_circumference}
                    onChange={handleInputChange}
                    placeholder="82.0"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fasting_glucose" className="label">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="fasting_glucose"
                    name="fasting_glucose"
                    className="input"
                    value={formData.fasting_glucose}
                    onChange={handleInputChange}
                    placeholder="95.0"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fasting_insulin" className="label">Fasting Insulin (μU/mL)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="fasting_insulin"
                    name="fasting_insulin"
                    className="input"
                    value={formData.fasting_insulin}
                    onChange={handleInputChange}
                    placeholder="12.5"
                    disabled={isLoading}
                  />
                </div>

                {/* Lipid Profile */}
                <div className="form-group">
                  <label htmlFor="total_cholesterol" className="label">Total Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="total_cholesterol"
                    name="total_cholesterol"
                    className="input"
                    value={formData.total_cholesterol}
                    onChange={handleInputChange}
                    placeholder="200"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ldl_cholesterol" className="label">LDL Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="ldl_cholesterol"
                    name="ldl_cholesterol"
                    className="input"
                    value={formData.ldl_cholesterol}
                    onChange={handleInputChange}
                    placeholder="100"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hdl_cholesterol" className="label">HDL Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="hdl_cholesterol"
                    name="hdl_cholesterol"
                    className="input"
                    value={formData.hdl_cholesterol}
                    onChange={handleInputChange}
                    placeholder="50"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="triglycerides" className="label">Triglycerides (mg/dL)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="triglycerides"
                    name="triglycerides"
                    className="input"
                    value={formData.triglycerides}
                    onChange={handleInputChange}
                    placeholder="150"
                    disabled={isLoading}
                  />
                </div>

                {/* Follicle Data */}
                <div className="form-group">
                  <label htmlFor="total_follicles" className="label">Total Follicles</label>
                  <input
                    type="number"
                    id="total_follicles"
                    name="total_follicles"
                    className="input"
                    value={formData.total_follicles}
                    onChange={handleInputChange}
                    placeholder="12"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="follicles_0_12" className="label">Follicles 0-12mm</label>
                  <input
                    type="number"
                    id="follicles_0_12"
                    name="follicles_0_12"
                    className="input"
                    value={formData.follicles_0_12}
                    onChange={handleInputChange}
                    placeholder="8"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="follicles_12_24" className="label">Follicles 12-24mm</label>
                  <input
                    type="number"
                    id="follicles_12_24"
                    name="follicles_12_24"
                    className="input"
                    value={formData.follicles_12_24}
                    onChange={handleInputChange}
                    placeholder="3"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="follicles_24_36" className="label">Follicles 24-36mm</label>
                  <input
                    type="number"
                    id="follicles_24_36"
                    name="follicles_24_36"
                    className="input"
                    value={formData.follicles_24_36}
                    onChange={handleInputChange}
                    placeholder="1"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="follicles_above_36" className="label">Follicles Above 36mm</label>
                  <input
                    type="number"
                    id="follicles_above_36"
                    name="follicles_above_36"
                    className="input"
                    value={formData.follicles_above_36}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="blood_pressure_systolic" className="label">BP Systolic (mmHg)</label>
                  <input
                    type="number"
                    id="blood_pressure_systolic"
                    name="blood_pressure_systolic"
                    className="input"
                    value={formData.blood_pressure_systolic}
                    onChange={handleInputChange}
                    placeholder="120"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="blood_pressure_diastolic" className="label">BP Diastolic (mmHg)</label>
                  <input
                    type="number"
                    id="blood_pressure_diastolic"
                    name="blood_pressure_diastolic"
                    className="input"
                    value={formData.blood_pressure_diastolic}
                    onChange={handleInputChange}
                    placeholder="80"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* PCOS Indicators */}
              <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label className="label">PCOS Indicators</label>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="irregular_periods"
                      checked={formData.irregular_periods}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    Irregular Periods
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="excess_androgen"
                      checked={formData.excess_androgen}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    Excess Androgen
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="polycystic_ovaries"
                      checked={formData.polycystic_ovaries}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    Polycystic Ovaries
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis" className="label">Diagnosis/Notes</label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  className="input"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Medical diagnosis or notes..."
                  rows="3"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Assessment'}
              </button>
            </form>
          )}

          {/* Assessments Table */}
          {assessments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <FileText size={48} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600' }}>No assessments yet</p>
              <p style={{ fontSize: '14px' }}>Click "New Assessment" to add your first assessment</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Age</th>
                    <th>BMI</th>
                    <th>Glucose</th>
                    <th>Insulin</th>
                    <th>HOMA-IR</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => {
                    const interpretation = interpretHOMAIR(assessment.homa_ir);
                    return (
                      <tr key={assessment.id}>
                        <td>{new Date(assessment.assessment_date).toLocaleDateString()}</td>
                        <td>{assessment.age || '-'}</td>
                        <td>{assessment.bmi || '-'}</td>
                        <td>{assessment.fasting_glucose || '-'}</td>
                        <td>{assessment.fasting_insulin || '-'}</td>
                        <td><strong>{assessment.homa_ir ? parseFloat(assessment.homa_ir).toFixed(2) : '-'}</strong></td>
                        <td>
                          <span className={`badge ${interpretation.className}`}>
                            {interpretation.text}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(assessment.id)}
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '14px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

