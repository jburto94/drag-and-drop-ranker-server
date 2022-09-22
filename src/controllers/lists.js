const listsRouter = require('express').Router();
const List = require('../models/list');
const User = require('../models/user');
const getCurrentUser = require('../helpers/getCurrentUser');

// Get all current user's lists
listsRouter.get('/', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const currentUser = await getCurrentUser(token);

  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const lists = await List.find({ author: currentUser.id });

  return res.json({ listData: lists })
});

// Create new list
listsRouter.post('/', async (req, res) => {
  const { list, title } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  const currentUser = await getCurrentUser(token);
  
  if (!list) {
    return res.status(400).json({ success: false, message: 'Please populate the list.'});
  }

  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const listObj = list.map(item => new Object({ text: item }));

  const newList = new List({
    items: listObj,
    title,
    author: currentUser.id
  });

  if (newList.save()) {
    return res.status(201).json({ success: true, message: 'List has been successfully saved.' })
  }
});

// Look up singular list by :id
listsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];

  const currentUser = await getCurrentUser(token);

  try {
    const currentList = await List.findById(id);

    if (currentUser.id !== currentList.author.valueOf()) {
      return res.status(401).json({ success: false, message: 'You are not authorized to view this list' });
    } 
    
    return res.status(200).json({ list: currentList });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'List not found' })
  }
});

listsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { list, title } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  if (!title) {
    title = 'Untitled List';
  }

  const currentUser = await getCurrentUser(token);
  
  if (!list) {
    return res.status(400).json({ success: false, message: 'Please populate the list.'});
  }

  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const items = list.map(item => new Object({ text: item }));

  try {
    const currentList = await List.findById(id);
    if (currentUser.id !== currentList.author.valueOf()) {
      return res.status(401).json({ success: false, message: 'You are not authorized to perform that action.' });
    }

    const updatedList = await List.findByIdAndUpdate(id, { title, items });
    return res.status(200).json({ success: true, message: 'List has been successfully updated.' });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'List not found' });
  }
});

// Delete List
listsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];

  const currentUser = await getCurrentUser(token);
  
  try {
    const currentList = await List.findById(id);
    if (currentUser.id !== currentList.author.valueOf()) {
      return res.status(401).json({ success: false, message: 'You are not authorized to perform that action.' });
    }

    const removedList = await List.findByIdAndRemove(id);
    return res.status(200).json({ success: true, message: 'List has been successfully deleted.' });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'List not found' });
  }
});

module.exports = listsRouter;