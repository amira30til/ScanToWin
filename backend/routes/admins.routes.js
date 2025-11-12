const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  create,
  findAll,
  findOne,
  findByEmail,
  update,
  remove,
  updateStatus,
  findAdminById,
  removeAdmin,
} = require('../controllers/admins.controller');
const { superAdminGuard, adminGuard } = require('../middleware/auth.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', superAdminGuard, upload.single('profilPicture'), create);
router.get('/', superAdminGuard, findAll);
router.get('/email/:email', superAdminGuard, findByEmail);
router.get('/by-id/:id', findAdminById);
router.get('/:id', adminGuard, findOne);
router.patch('/:id', adminGuard, upload.single('profilPicture'), update);
router.patch('/:id/status', superAdminGuard, updateStatus);
router.patch('/:id/restore', superAdminGuard, updateStatus);
router.delete('/:id', superAdminGuard, remove);
router.delete('/delete/:id', removeAdmin);

module.exports = router;
