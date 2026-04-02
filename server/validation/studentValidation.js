const { body, validationResult } = require('express-validator');

exports.validateStudentSubmission = [
  body('name').notEmpty().withMessage('Full name is required.'),
  body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits.'),
  body('email').isEmail().withMessage('Valid email ID is required.'),
  body('branch').notEmpty().withMessage('Branch is required.'),
  body('rollNumber').notEmpty().withMessage('Roll Number is required.'),
  body('collegeName').notEmpty().withMessage('College Name is required.'),
  body('location').notEmpty().withMessage('Location is required.'),
  body('course').notEmpty().withMessage('Select Course is required.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  }
];
