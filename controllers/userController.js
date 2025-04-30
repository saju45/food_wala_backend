import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const newUser = new User({ name, email, password: hashedPassword });

    //save the user
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    //generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("jwt", token, { expiresIn: "30d", httpOnly: true });

    res.json({ message: "User logged in successfully", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select({ password: 0 });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "There was an error in server side" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: " please provide currentPass and new Password " });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "New password should not be same as current password" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({ message: "Password Update successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "There was an error in server side" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please choose picture and try" });
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: req.file.path,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);
    if (total === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    let users;
    // search users
    const keyword = req.query.keyword?.toLowerCase();
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      users = await User.find({
        $or: [{ name: regex }, { email: regex }],
      })
        .skip(startIndex)
        .limit(limit)
        .select({ password: 0 });
    } else {
      users = await User.find()
        .skip(startIndex)
        .limit(limit)
        .select({ password: 0 });
    }

    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }
    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error in server side" });
  }
};

//delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    res.status(201).json({ message: "user deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
};