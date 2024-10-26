import express from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router();
const permissionController = new PermissionController();

router.get('/', 
  authMiddleware,
  checkPermission('read:permissions'),
  (req, res) => permissionController.getAllPermissions(req, res)
);

router.get('/:id', 
  authMiddleware,
  checkPermission('read:permissions'),
  (req, res) => permissionController.getPermissionById(req, res)
);

router.post('/', 
  authMiddleware,
  checkPermission('create:permissions'),
  (req, res) => permissionController.createPermission(req, res)
);

router.post('/assign', 
  authMiddleware,
  checkPermission('update:permissions'),
  (req, res) => permissionController.assignToRole(req, res)
);

export default router;
