const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all data routes
router.use(authenticateToken);

// Validation rules for assessment data
const assessmentValidation = [
    body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
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
            age,
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
            assessment_date,
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

        const userId = req.user.id;

        // Insert assessment data (HOMA-IR, TYG Index, and LH/FSH ratio calculated automatically by database trigger)
        const result = await db.query(
            `INSERT INTO pcos_assessments (
                user_id, age, weight_kg, height_cm, bmi,
                irregular_periods, excess_androgen, polycystic_ovaries,
                fasting_glucose, fasting_insulin,
                total_cholesterol, ldl_cholesterol, hdl_cholesterol, triglycerides,
                total_follicles, follicles_0_12, follicles_12_24, follicles_24_36, follicles_above_36,
                waist_circumference, blood_pressure_systolic, blood_pressure_diastolic,
                lh, fsh, testosterone_total, dhea, dhea_s,
                ovary_volume, follicle_size,
                family_history_diabetes, family_history_hypertension, family_history_atherosclerosis, family_history_cancer,
                pcos_score, pcos_risk_level,
                diagnosis, assessment_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)
            RETURNING *`,
            [
                userId,
                age || null,
                weight_kg || null,
                height_cm || null,
                bmi || null,
                irregular_periods || false,
                excess_androgen || false,
                polycystic_ovaries || false,
                fasting_glucose || null,
                fasting_insulin || null,
                total_cholesterol || null,
                ldl_cholesterol || null,
                hdl_cholesterol || null,
                triglycerides || null,
                total_follicles || null,
                follicles_0_12 || null,
                follicles_12_24 || null,
                follicles_24_36 || null,
                follicles_above_36 || null,
                waist_circumference || null,
                blood_pressure_systolic || null,
                blood_pressure_diastolic || null,
                // Rotterdam Criteria
                lh || null,
                fsh || null,
                testosterone_total || null,
                dhea || null,
                dhea_s || null,
                // Scan parameters
                ovary_volume || null,
                follicle_size || null,
                // Family history
                family_history_diabetes || false,
                family_history_hypertension || false,
                family_history_atherosclerosis || false,
                family_history_cancer || false,
                // PCOS Score
                pcos_score || null,
                pcos_risk_level || null,
                diagnosis || null,
                assessment_date || null
            ]
        );

        const assessment = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'Assessment created successfully',
            data: assessment
        });

    } catch (error) {
        console.error('❌ Create assessment error:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error detail:', error.detail);
        console.error('❌ Error code:', error.code);
        res.status(500).json({
            success: false,
            message: 'Server error while creating assessment',
            error: error.message,
            detail: error.detail
        });
    }
});

// GET /api/data - Fetch all assessments for logged-in user
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all assessments for this user, ordered by date (newest first)
        const result = await db.query(
            `SELECT * FROM pcos_assessments 
             WHERE user_id = $1 
             ORDER BY assessment_date DESC, created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error('Fetch assessments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assessments'
        });
    }
});

// GET /api/data/:id - Fetch single assessment by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assessment ID format'
            });
        }

        const result = await db.query(
            'SELECT * FROM pcos_assessments WHERE id = $1 AND user_id = $2',
            [id, userId]
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
        console.error('Fetch assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assessment'
        });
    }
});

// PUT /api/data/:id - Update assessment
router.put('/:id', assessmentValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const userId = req.user.id;

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assessment ID format'
            });
        }

        // Check if assessment exists and belongs to user
        const checkResult = await db.query(
            'SELECT id FROM pcos_assessments WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        const {
            age, weight_kg, height_cm, bmi,
            irregular_periods, excess_androgen, polycystic_ovaries,
            fasting_glucose, fasting_insulin,
            total_cholesterol, ldl_cholesterol, hdl_cholesterol, triglycerides,
            total_follicles, follicles_0_12, follicles_12_24, follicles_24_36, follicles_above_36,
            waist_circumference, blood_pressure_systolic, blood_pressure_diastolic,
            diagnosis, assessment_date
        } = req.body;

        // Update assessment (HOMA-IR and TYG Index recalculated automatically by database trigger)
        const result = await db.query(
            `UPDATE pcos_assessments SET
                age = COALESCE($1, age),
                weight_kg = COALESCE($2, weight_kg),
                height_cm = COALESCE($3, height_cm),
                bmi = COALESCE($4, bmi),
                irregular_periods = COALESCE($5, irregular_periods),
                excess_androgen = COALESCE($6, excess_androgen),
                polycystic_ovaries = COALESCE($7, polycystic_ovaries),
                fasting_glucose = COALESCE($8, fasting_glucose),
                fasting_insulin = COALESCE($9, fasting_insulin),
                total_cholesterol = COALESCE($10, total_cholesterol),
                ldl_cholesterol = COALESCE($11, ldl_cholesterol),
                hdl_cholesterol = COALESCE($12, hdl_cholesterol),
                triglycerides = COALESCE($13, triglycerides),
                total_follicles = COALESCE($14, total_follicles),
                follicles_0_12 = COALESCE($15, follicles_0_12),
                follicles_12_24 = COALESCE($16, follicles_12_24),
                follicles_24_36 = COALESCE($17, follicles_24_36),
                follicles_above_36 = COALESCE($18, follicles_above_36),
                waist_circumference = COALESCE($19, waist_circumference),
                blood_pressure_systolic = COALESCE($20, blood_pressure_systolic),
                blood_pressure_diastolic = COALESCE($21, blood_pressure_diastolic),
                diagnosis = COALESCE($22, diagnosis),
                assessment_date = COALESCE($23, assessment_date)
             WHERE id = $24 AND user_id = $25
             RETURNING *`,
            [
                age, weight_kg, height_cm, bmi,
                irregular_periods, excess_androgen, polycystic_ovaries,
                fasting_glucose, fasting_insulin,
                total_cholesterol, ldl_cholesterol, hdl_cholesterol, triglycerides,
                total_follicles, follicles_0_12, follicles_12_24, follicles_24_36, follicles_above_36,
                waist_circumference, blood_pressure_systolic, blood_pressure_diastolic,
                diagnosis, assessment_date,
                id, userId
            ]
        );

        res.json({
            success: true,
            message: 'Assessment updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating assessment'
        });
    }
});

// DELETE /api/data/:id - Delete assessment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assessment ID format'
            });
        }

        const result = await db.query(
            'DELETE FROM pcos_assessments WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        res.json({
            success: true,
            message: 'Assessment deleted successfully'
        });

    } catch (error) {
        console.error('Delete assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting assessment'
        });
    }
});

// GET /api/data/stats/summary - Get summary statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `SELECT 
                COUNT(*) as total_assessments,
                AVG(homa_ir) as avg_homa_ir,
                MIN(homa_ir) as min_homa_ir,
                MAX(homa_ir) as max_homa_ir,
                AVG(bmi) as avg_bmi
             FROM pcos_assessments 
             WHERE user_id = $1`,
            [userId]
        );

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

module.exports = router;

