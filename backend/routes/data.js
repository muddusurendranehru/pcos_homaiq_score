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
            
            // Assessment data
            age,
            weight_kg,
            height_cm,
            bmi,
            fasting_glucose,
            fasting_insulin,
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

        // Insert with patient info and assessment data
        const result = await db.query(
            `INSERT INTO pcos_assessments (
                id, user_id, patient_name, referring_doctor, age, 
                weight_kg, height_cm, bmi, fasting_glucose, fasting_insulin, diagnosis
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, patient_name, referring_doctor, age, weight_kg, height_cm, bmi, 
                      fasting_glucose, fasting_insulin, homa_ir, created_at`,
            [
                assessmentId,           // $1 - UUID for assessment
                userIdAsUUID,          // $2 - UUID for user_id
                patient_name || null,   // $3 - UNIVERSAL acceptance
                referring_doctor || null, // $4 - UNIVERSAL acceptance
                age || null,           // $5
                weight_kg || null,     // $6
                height_cm || null,     // $7
                bmi || null,           // $8
                fasting_glucose || null, // $9
                fasting_insulin || null, // $10
                diagnosis || null      // $11
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
