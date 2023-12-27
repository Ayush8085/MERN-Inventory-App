const { contactUs } = require('../controllers/contactController');
const protect = require('../middleWare/authMiddleware');

const router = require('express').Router();

router.post('/', protect, contactUs);

module.exports = router;