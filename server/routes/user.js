
const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController')


router.get('/', userControllers.view);
router.post('/', userControllers.find);
router.get('/adduser', userControllers.newUser);
router.post('/adduser', userControllers.postNewUser);
router.get('/edituser/:id', userControllers.edit);
router.post('/edituser/:id', userControllers.update);
router.get('/viewuser/:id', userControllers.viewUser);
router.get('/:id', userControllers.delete);


module.exports = router;