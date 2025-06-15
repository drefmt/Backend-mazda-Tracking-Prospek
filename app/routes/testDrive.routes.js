const router = require('express').Router();
const testDriveController = require('../controller/testDrive.controllers');
const {verifyToken, authorizeRoles} = require('../middleware/auth.middleware')


router.get('/', verifyToken, authorizeRoles('admin','sales','svp'), testDriveController.findAllTestDrive);
router.post('/', verifyToken, authorizeRoles('sales'), testDriveController.createTestDrive)
router.get('/:id', verifyToken, authorizeRoles('sales'), testDriveController.findTestDriveById);
router.put('/:id', verifyToken, authorizeRoles('sales'), testDriveController.updateTestDrive);
router.delete('/:id', verifyToken, authorizeRoles('sales'), testDriveController.deleteTestDrive);



module.exports = router;

