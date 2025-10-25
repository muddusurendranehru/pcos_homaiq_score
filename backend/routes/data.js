const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all data routes
router.use(authenticateToken);

// Validation rules for assessment data (with universal text acceptance)
const assessmentValidation = [
    // Patient info - UNIVERSAL acceptance (any format)
    body('patient_name').optional().isLength({ min: 1 }).withMessage('Patient name cannot be empty if provided'),
    body('referring_doctor').optional().isLength({ min: 1 }).withMessage('Referring doctor name cannot be empty if provided'),
    
    // Numeric validations
    body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('height_cm').optional().isFloat({ min: 0 }).withMessage('Height must be a positive number'),
    body('fasting_glucose').optional().isFloat({ min: 0 }).withMessage('Fasting glucose must be a positive number'),
    body('fasting_insulin').optional().isFloat({ min: 0 }).withMessage('Fasting insulin must be a positive number')
];

// POST /api/data - Insert new assessment (SIMPLIFIED)
router.post('/', assessmentValidation, async (req, res) => {
    try {
        console.log('📝 Creating new assessment...');
        console.log('Request body:', req.body);
        console.log('User ID from token:', req.user.id);

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            // Patient info (NEW - universal acceptance)
            patient_name,
            referring_doctor,
            
            // Basic assessment data
            age,
            weight_kg,
            height_cm,
            bmi,
            waist_circumference,
            
            // Lab values
            fasting_glucose,
            fasting_insulin,
            
            // Lipid profile
            total_cholesterol,
            ldl_cholesterol,
            hdl_cholesterol,
            triglycerides,
            
            // Rotterdam Criteria - Hormonal
            lh,
            fsh,
            testosterone_total,
            dhea,
            dhea_s,
            
            // Ultrasound Scan
            ovary_volume,
            follicle_size,
            total_follicles,
            follicles_0_12,
            follicles_12_24,
            follicles_24_36,
            follicles_above_36,
            
            // Family History
            family_history_diabetes,
            family_history_hypertension,
            family_history_atherosclerosis,
            family_history_cancer,
            
            // PCOS indicators
            irregular_periods,
            excess_androgen,
            polycystic_ovaries,
            
            // PCOS Score
            pcos_score,
            pcos_risk_level,
            
            // Blood pressure
            blood_pressure_systolic,
            blood_pressure_diastolic,
            
            diagnosis
        } = req.body;

        const userId = req.user.id; // This is integer from users table

        // Generate UUID for assessment
        const assessmentId = require('crypto').randomUUID();
        
        // Convert integer user_id to UUID format for compatibility
        const userIdAsUUID = require('crypto').randomUUID(); // Generate new UUID for this user

        console.log('Creating assessment with patient data:');
        console.log('- Assessment ID:', assessmentId);
        console.log('- User ID (original):', userId);
        console.log('- User ID (as UUID):', userIdAsUUID);
        console.log('- Patient name:', patient_name);
        console.log('- Referring doctor:', referring_doctor);

        // Insert with ALL assessment data (complete PCOS assessment)
        const result = await db.query(
            `INSERT INTO pcos_assessments (
                id, user_id, patient_name, referring_doctor, age, 
                weight_kg, height_cm, bmi, waist_circumference,
                fasting_glucose, fasting_insulin,
                total_cholesterol, ldl_cholesterol, hdl_cholesterol, triglycerides,
                lh, fsh, testosterone_total, dhea, dhea_s,
                ovary_volume, follicle_size, total_follicles, 
                follicles_0_12, follicles_12_24, follicles_24_36, follicles_above_36,
                family_history_diabetes, family_history_hypertension, 
                family_history_atherosclerosis, family_history_cancer,
                irregular_periods, excess_androgen, polycystic_ovaries,
                pcos_score, pcos_risk_level,
                blood_pressure_systolic, blood_pressure_diastolic,
                diagnosis
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39)
            RETURNING id, patient_name, referring_doctor, age, weight_kg, height_cm, bmi, 
                      fasting_glucose, fasting_insulin, homa_ir, hdl_cholesterol, 
                      total_follicles, follicle_size, lh, fsh, testosterone_total, created_at`,
            [
                assessmentId,                    // $1 - UUID for assessment
                userIdAsUUID,                   // $2 - UUID for user_id
                patient_name || null,            // $3 - Patient name
                referring_doctor || null,        // $4 - Referring doctor
                age || null,                    // $5 - Age
                weight_kg || null,              // $6 - Weight
                height_cm || null,              // $7 - Height
                bmi || null,                    // $8 - BMI
                waist_circumference || null,    // $9 - Waist
                fasting_glucose || null,        // $10 - Glucose
                fasting_insulin || null,        // $11 - Insulin
                total_cholesterol || null,      // $12 - Total cholesterol
                ldl_cholesterol || null,        // $13 - LDL
                hdl_cholesterol || null,        // $14 - HDL ✅
                triglycerides || null,          // $15 - Triglycerides
                lh || null,                     // $16 - LH ✅
                fsh || null,                    // $17 - FSH ✅
                testosterone_total || null,     // $18 - Testosterone ✅
                dhea || null,                   // $19 - DHEA
                dhea_s || null,                 // $20 - DHEA-S
                ovary_volume || null,           // $21 - Ovary volume
                follicle_size || null,          // $22 - Follicle size ✅
                total_follicles || null,        // $23 - Total follicles ✅
                follicles_0_12 || null,         // $24 - Follicles 0-12
                follicles_12_24 || null,        // $25 - Follicles 12-24
                follicles_24_36 || null,        // $26 - Follicles 24-36
                follicles_above_36 || null,     // $27 - Follicles >36
                family_history_diabetes || false,        // $28 - Family diabetes
                family_history_hypertension || false,    // $29 - Family hypertension
                family_history_atherosclerosis || false, // $30 - Family atherosclerosis
                family_history_cancer || false,          // $31 - Family cancer
                irregular_periods || false,     // $32 - Irregular periods
                excess_androgen || false,       // $33 - Excess androgen
                polycystic_ovaries || false,    // $34 - Polycystic ovaries
                pcos_score || null,             // $35 - PCOS score
                pcos_risk_level || null,        // $36 - PCOS risk level
                blood_pressure_systolic || null, // $37 - BP systolic
                blood_pressure_diastolic || null, // $38 - BP diastolic
                diagnosis || null               // $39 - Diagnosis
            ]
        );

        console.log('✅ Assessment created successfully');
        console.log('Result:', result.rows[0]);

        res.status(201).json({
            success: true,
            message: 'Assessment created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Assessment creation error:', error);
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        
        res.status(500).json({
            success: false,
            message: 'Server error while creating assessment',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// GET /api/data - Fetch all assessments (simplified)
router.get('/', async (req, res) => {
    try {
        console.log('📋 Fetching assessments for user:', req.user.id);

        // Fetch all assessments with patient info
        const result = await db.query(
            `SELECT id, patient_name, referring_doctor, age, weight_kg, height_cm, bmi, 
                    fasting_glucose, fasting_insulin, homa_ir, 
                    created_at, diagnosis
             FROM pcos_assessments 
             ORDER BY created_at DESC 
             LIMIT 10`
        );

        console.log(`✅ Found ${result.rows.length} assessments`);

        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('❌ Fetch assessments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assessments'
        });
    }
});

// GET /api/data/stats/summary - Get summary statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                COUNT(*) as total_assessments,
                AVG(age) as avg_age,
                AVG(bmi) as avg_bmi,
                AVG(homa_ir) as avg_homa_ir
             FROM pcos_assessments`
        );

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Stats summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

module.exports = router;
