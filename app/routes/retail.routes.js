const router = require('express').Router();
const retailController = require("../controller/retail.controller");
const {verifyToken, authorizeRoles} = require("../middleware/auth.middleware")

router.get('/', verifyToken, authorizeRoles('sales','svp'), retailController.findAllRetail);
router.get('/:id', verifyToken, authorizeRoles('sales'), retailController.findRetailById);
router.post('/', verifyToken, authorizeRoles('sales'), retailController.create);
router.put('/:id', verifyToken, authorizeRoles('sales'), retailController.updateRetail);
router.delete('/:id', verifyToken, authorizeRoles('sales'), retailController.delete);

module.exports = router;
