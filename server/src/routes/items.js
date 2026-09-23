import { Router } from 'express';
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';

const router = Router();

// TODO: wire up the routes described in README.md section 3.

// Collection routes (GET /api/items, POST /api/items)
router.route('/')
  .get(getAllItems)
  .post(createItem);

// Individual item routes (GET /api/items/:id, PATCH /api/items/:id, DELETE /api/items/:id)
router.route('/:id')
  .get(getItem)
  .patch(updateItem)
  .delete(deleteItem);

export default router;