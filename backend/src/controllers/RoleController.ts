import { Request, Response } from 'express';
import { Role } from '../models/Role';
import { Op } from 'sequelize';
import { cache } from '../utils/cache';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const cacheKey = `roles_${page}_${limit}_${search}`;
    const cachedRoles = cache.get(cacheKey);

    if (cachedRoles) {
      return res.json(cachedRoles);
    }

    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const roles = await Role.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      attributes: ['id', 'name', 'description'] // Chỉ định rõ các trường cần lấy
    });

    const result = {
      total: roles.count,
      roles: roles.rows,
      currentPage: Number(page),
      totalPages: Math.ceil(roles.count / Number(limit))
    };

    cache.set(cacheKey, result, 300); // Cache for 5 minutes

    res.json(result);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Error getting role by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const newRole = await Role.create({ name, description });
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const [updatedRows] = await Role.update({ name, description }, { where: { id: req.params.id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const deletedRows = await Role.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
