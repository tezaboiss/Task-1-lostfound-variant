import Joi from 'joi';
import { Item } from '../models/Item.js';

// TODO: write a validation schema for create/update per README.md section 2.
const createItemSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow('', null),
  category: Joi.string().valid('electronics', 'clothing', 'documents', 'keys', 'other').required(),
  status: Joi.string().valid('lost', 'found').required(),
  location: Joi.string().trim().required(),
  reportedBy: Joi.string().hex().length(24).required() // Validates 24-char MongoDB ObjectId
});

const updateItemSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim().allow('', null),
  category: Joi.string().valid('electronics', 'clothing', 'documents', 'keys', 'other'),
  status: Joi.string().valid('lost', 'found'),
  location: Joi.string().trim(),
  reportedBy: Joi.string().hex().length(24)
}).min(1);

// GET /api/items
// TODO: implement per README.md section 3.
export async function getAllItems(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const items = await Item.find(filter).populate('reportedBy', 'name email');
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

// GET /api/items/:id
// TODO: implement per README.md section 3.
export async function getItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

// POST /api/items
// TODO: implement per README.md section 3.
export async function createItem(req, res, next) {
  try {
    const { error, value } = createItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newItem = await Item.create(value);
    const populatedItem = await newItem.populate('reportedBy', 'name email');

    res.status(201).json(populatedItem);
  } catch (err) {
    // MongoDB duplicate key error code for compound index (title + location)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An item with this exact title already exists at this location.' });
    }
    next(err);
  }
}

// PATCH /api/items/:id
// TODO: implement per README.md section 3.
export async function updateItem(req, res, next) {
  try {
    const { error, value } = updateItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true
    }).populate('reportedBy', 'name email');

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An item with this exact title already exists at this location.' });
    }
    next(err);
  }
}

// DELETE /api/items/:id
// TODO: implement per README.md section 3.
export async function deleteItem(req, res, next) {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
}