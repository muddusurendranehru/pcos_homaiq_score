const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all data routes
router.use(authenticateToken);

// Validation rules for assessment data
const assessmentValidation = [
    // Patient info
    body('patient_name').optional().isLength({ min: 1 }).withMessage('Patient name cannot be empty if provided'),
    body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('referring_doctor').optional().isLength({ min: 1 }).withMessage('Referring doctor name cannot be empty if provided'),
    
    // Physical measurements
    body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('height_cm').optional().isFloat({ min: 0 }).withMessage('Height must be a positive number'),
    body('fasting_glucose').optional().isFloat({ min: 0 }).withMessage('Fasting glucose must be a positive number'),
    body('fasting_insulin').optional().isFloat({ min: 0 }).withMessage('Fasting insulin must be a positive number'),
    body('total_cholesterol').optional().isFloat({ min: 0 }).withMessage('Total cholesterol must be a positive number'),
    body('triglycerides').optional().isFloat({ min: 0 }).withMessage('Triglycerides must be a positive number'),
    body('total_follicles').optional().isInt({ min: 0 }).withMessage('Total follicles must be a positive integer')
];

// POST /api/data - Insert new assessment
router.post('/', assessmentValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            console.log('Request body:', req.body);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            // Patient info (NEW)
            patient_name,
            age,
            referring_doctor,
            
            // Physical measurements
            weight_kg,
            height_cm,
            bmi,
            irregular_periods,
            excess_androgen,
            polycystic_ovaries,
            fasting_glucose,
            fasting_insulin,
            total_cholesterol,
            ldl_cholesterol,
            hdl_cholesterol,
            triglycerides,
            total_follicles,
            follicles_0_12,
            follicles_12_24,
            follicles_24_36,
            follicles_above_36,
            waist_circumference,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            diagnosis,
            
            // Rotterdam Criteria
            lh,
            fsh,
            testosterone_total,
            dhea,
            dhea_s,
            
            // Scan parameters
            ovary_volume,
            follicle_size,
            
            // Family history
            family_history_diabetes,
            family_history_hypertension,
            family_history_atherosclerosis,
            family_history_cancer,
            
            // PCOS Score
            pcos_score,
            pcos_risk_level
        } = req.body;

        const userId = req.user.id; // This is integer from users table

        // Generate UUID for pcos_assessments id
        const assessmentId = require('crypto').randomUUID();
        
        // Convert integer user_id to string for UUID compatibility
        const userIdAsUUID = userId.toString().padStart(8, '0') + '-0000-0000-0000-000000000000';

        console.log('Creating assessment with:');
        console.log('- Assessment ID (UUID):', assessmentId);
        console.log('- User ID (integer):', userId);
        console.log('- User ID as UUID:', userIdAsUUID);
        console.log('- Patient name:', patient_name);
        console.log('- Referring doctor:', referring_doctor);

        // Insert assessment data with UUID handling
        const result = await db.query(
            `INSERT INTO pcos_assessments (
                id, user_id, age, patient_name, referring_doctor,
                weight_kg, height_cm, bmi,
                irregular_periods, excess_androgen, polycystic_ovaries,
                fasting_glucose, fasting_insulin,
                total_cholesterol, ldl_cholesterol, hdl_cholesterol, triglycerides,
                total_follicles, follicles_0_12, follicles_12_24, follicles_24_36, follicles_above_36,
                waist_circumference, blood_pressure_systolic, blood_pressure_diastolic,
                lh, fsh, testosterone_total, dhea, dhea_s,
                ovary_volume, follicle_size,
                family_history_diabetes, family_history_hypertension, family_history_atherosclerosis, family_history_cancer,
                pcos_score, pcos_risk_level,
                diagnosis
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39)
            RETURNING *`,
            [
                assessmentId,           // $1 - UUID for assessment
                userIdAsUUID,          // $2 - User ID as UUID
                age,                   // $3
                patient_name,          // $4 - NEW
                referring_doctor,      // $5 - NEW
                weight_kg,             // $6
                height_cm,             // $7
                bmi,                   // $8
                irregular_periods,     // $9
                excess_androgen,       // $10
                polycystic_ovaries,    // $11
                fasting_glucose,       // $12
                fasting_insulin,       // $13
                total_cholesterol,     // $14
                ldl_cholesterol,       // $15
                hdl_cholesterol,       // $16
                triglycerides,         // $17
                total_follicles,       // $18
                follicles_0_12,        // $19
                follicles_12_24,       // $20
                follicles_24_36,       // $21
                follicles_above_36,    // $22
                waist_circumference,   // $23
                blood_pressure_systolic, // $24
                blood_pressure_diastolic, // $25
                lh,                    // $26
                fsh,                   // $27
                testosterone_total,    // $28
                dhea,                  // $29
                dhea_s,                // $30
                ovary_volume,          // $31
                follicle_size,         // $32
                family_history_diabetes, // $33
                family_history_hypertension, // $34
                family_history_atherosclerosis, // $35
                family_history_cancer, // $36
                pcos_score,            // $37
                pcos_risk_level,       // $38
                diagnosis              // $39
            ]
        );

        console.log('✅ Assessment created successfully');

        res.status(201).json({
            success: true,
            message: 'Assessment created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Assessment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating assessment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/data - Fetch all assessments for logged-in user
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const userIdAsUUID = userId.toString().padStart(8, '0') + '-0000-0000-0000-000000000000';

        const result = await db.query(
            `SELECT * FROM pcos_assessments 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userIdAsUUID]
        );

        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('Fetch assessments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assessments'
        });
    }
});

// GET /api/data/:id - Fetch single assessment
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userIdAsUUID = userId.toString().padStart(8, '0') + '-0000-0000-0000-000000000000';

        const result = await db.query(
            `SELECT * FROM pcos_assessments 
             WHERE id = $1 AND user_id = $2`,
            [id, userIdAsUUID]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Fetch single assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assessment'
        });
    }
});

// GET /api/data/stats/summary - Get summary statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const userId = req.user.id;
        const userIdAsUUID = userId.toString().padStart(8, '0') + '-0000-0000-0000-000000000000';

        const result = await db.query(
            `SELECT 
                COUNT(*) as total_assessments,
                AVG(age) as avg_age,
                AVG(bmi) as avg_bmi,
                AVG(homa_ir) as avg_homa_ir,
                AVG(pcos_score) as avg_pcos_score
             FROM pcos_assessments 
             WHERE user_id = $1`,
            [userIdAsUUID]
        );

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Stats summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

module.exports = router;
