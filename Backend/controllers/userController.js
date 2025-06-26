import userService from "../service/userService.js";

const getUsers = async (req, res) => {
  const query = req.query.query; // Extract the 'query' string directly

  // Validate query
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query must be a non-empty string' });
  }

  try {
    const users = await userService.getUsers(query); // Log the number of users found
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
    getUsers
};