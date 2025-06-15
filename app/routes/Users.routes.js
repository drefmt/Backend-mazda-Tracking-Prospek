const express = require('express');
const router = express.Router();
const usersController = require('../controller/users.controllers');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');


router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.get('/', verifyToken, authorizeRoles('admin'), usersController.getAllUsers);


router.get('/:id', verifyToken, (req, res, next) => {
    if (req.user.level === 'admin' || req.user.id.toString() === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied' });
}, usersController.getUserById);

router.put('/:id', verifyToken, usersController.updateUser);
router.delete('/:id', verifyToken, authorizeRoles('admin'), usersController.deleteUser);

module.exports = router;
