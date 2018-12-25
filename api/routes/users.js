const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users')

router.post('/signup',UsersController.signup);

router.post('/login',UsersController.login);

router.delete('/:userId',UsersController.delete);

module.exports = router;