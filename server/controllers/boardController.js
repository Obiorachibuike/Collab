import Board from '../models/Board.js';

const DUMMY_BOARDS = [
  { name: 'Todo' },
  { name: 'In Progress' },
  { name: 'Completed' },
  { name: 'Important' },
];

// @desc    Get all boards for current user
// @route   GET /boards
// @access  Private
export const getBoards = async (req, res) => {
  try {
    let boards = await Board.find({ user: req.user._id });

    if (boards.length === 0) {
      const dummyBoardsWithUser = DUMMY_BOARDS.map(b => ({ ...b, user: req.user._id }));
      await Board.insertMany(dummyBoardsWithUser);
      boards = await Board.find({ user: req.user._id });
    }

    res.json(boards);
  } catch (err) {
    console.error('Error fetching boards:', err);
    res.status(500).json({ message: 'Error fetching boards' });
  }
};

// @desc    Create new board
// @route   POST /boards
// @access  Private
export const createBoard = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Board name is required' });

  try {
    const board = await Board.create({
      name,
      user: req.user._id,
    });
    res.status(201).json(board);
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ message: 'Error creating board' });
  }
};

// @desc    Update board
// @route   PUT /boards/:id
// @access  Private
export const updateBoard = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Board name is required' });

  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name },
      { new: true }
    );

    if (!board) return res.status(404).json({ message: 'Board not found or unauthorized' });

    res.json(board);
  } catch (err) {
    console.error('Error updating board:', err);
    res.status(500).json({ message: 'Error updating board' });
  }
};

// @desc    Delete board
// @route   DELETE /boards/:id
// @access  Private
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!board) return res.status(404).json({ message: 'Board not found or unauthorized' });

    res.json({ message: 'Board deleted' });
  } catch (err) {
    console.error('Error deleting board:', err);
    res.status(500).json({ message: 'Error deleting board' });
  }
};
