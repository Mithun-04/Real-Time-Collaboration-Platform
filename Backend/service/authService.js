import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (name, email, password) => {

  const existingUser = await User.findOne({ email });
  if (existingUser) throw { status: 400, message: "User already exists" };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return { msg: "User registered successfully" };
};


const login = async (name, password) => {

  const user = await User.findOne({ name });
  if (!user) throw { status: 400, message: "Invalid credentials" };


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 400, message: "Invalid credentials" };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

export default { signup, login };
