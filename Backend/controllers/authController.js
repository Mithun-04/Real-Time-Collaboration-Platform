import authService from "../service/authService.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { name , password } = req.body;
    const result = await authService.login(name, password);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};



