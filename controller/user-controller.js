import userModel from "../models/user-model.js";
import { generateToken } from "../services/jwt-token.js";

//@desc creating new user
// Route POST /v1/api/users/auth/signup
export const createUser = async (req, res) => {
  const { userName, name, email, password, profileUrl, phoneNumber } = req.body;
  try {
    const isExist = await userModel.findOne({ email: email });
    if (isExist) {
      return res.status(409).json({
        message: "Email already exist",
        success: false,
      });
    }
    const newUser = new userModel({
      userName: userName,
      name: name,
      email: email,
      password: password,
      profileUrl: profileUrl,
      phoneNumber: phoneNumber,
    });
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(409).json({
        message: "Error while creating the User",
        success: fasle,
      });
    } else {
      return res.status(201).json({
        message: "New User Created Successfully",
        success: true,
        data: savedUser,
      });
    }
  } catch (error) {
    throw error;
  }
};

//@desc login user
//Route GET /v1/api/users/auth/login

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(403).send("Please provide valid credentials");
    }
    const foundUser = await userModel.findOne({ email: email });

    if (!foundUser) {
      return res.status(403).json({
        message: "User does not exist",
        success: false,
      });
    }
    if (password !== foundUser.password) {
      return res
        .status(406)
        .json({ message: "Password incorrect", success: false });
    }
    const sendDetails = await userModel
      .findById({ _id: foundUser._id })
      .select("-password -__v");

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: {
        foundUer: sendDetails,
        encodedToken: generateToken({ id: foundUser._id }),
      },
    });
  } catch (error) {
    throw error;
  }
};

//@desc login user
//Route GET /v1/api/users/profile/update-password
export const updatePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;
  try {
    const foundUer = await userModel.findById({ _id: id });
    if (!foundUer) {
      return res.status(500).json({ message: "No User Found", success: false });
    }
    if (currentPassword !== foundUer.password) {
      return res
        .status(409)
        .json({ message: "Current Password is Incorrect", success: false });
    }
    await userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { password: newPassword } },
      { new: true }
    );
    return res.json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    throw error;
  }
};
