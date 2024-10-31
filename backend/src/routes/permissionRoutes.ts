import express from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router();
const permissionController = new PermissionController();

// Get all permissions
router.get('/', 
  authMiddleware, 
  checkPermission('read:permissions'),
  (req, res) => permissionController.getAllPermissions(req, res)
);

// Get permission by ID
router.get('/:id',
  authMiddleware,
  checkPermission('read:permissions'),
  (req, res) => permissionController.getPermissionById(req, res)
);

// Create new permission
router.post('/',
  authMiddleware,
  checkPermission('create:permissions'),
  (req, res) => permissionController.createPermission(req, res)
);

// Update permission
router.put('/:id',
  authMiddleware,
  checkPermission('update:permissions'),
  (req, res) => permissionController.updatePermission(req, res)
);

// Delete permission
router.delete('/:id',
  authMiddleware,
  checkPermission('delete:permissions'),
  (req, res) => permissionController.deletePermission(req, res)
);

// Assign permission to role
router.post('/assign',
  authMiddleware,
  checkPermission('update:roles'),
  (req, res) => permissionController.assignToRole(req, res)
);

export default router;