import express from 'express';
import { UserController } from '../controllers/UserController';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router();

router.get('/', checkPermission('VIEW_USERS'), UserController.getAllUsers);
router.get('/:id', checkPermission('VIEW_USERS'), UserController.getUserById);
router.put('/:id', checkPermission('EDIT_USERS'), UserController.updateUser);
router.delete('/:id', checkPermission('DELETE_USERS'), UserController.deleteUser);

export default router;
