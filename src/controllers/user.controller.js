import { asyncHandler } from "../utils/asynchandler.js";

import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body
    // console.log("email: ", email);
    // res.status(200).json({ message: email });
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]

    })
    if (existedUser) {
        throw new ApiError(409, "User with the same username or email already exists,try different one");
    }

    console.log("req.files: ", req.files);

    const avatarlocalpath = req.files?.avatar[0]?.path
    // const coverPhotolocalpath = req.files?.coverImage[0]?.path

    let coverImagelocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagelocalpath = req.files.coverImage[0].path
    }

    if (!avatarlocalpath) {
        throw new ApiError(400, "avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverImage = await uploadOnCloudinary(coverImagelocalpath)
    if (!avatar) {
        throw new ApiError(400, "avatar file is required secondly");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password

    })
    const createduser = await User.findById(user._id).select("-password -refreshToken")
    if (!createduser) {
        throw new ApiError(500, "user was not created successfully");
    }
    return res.status(201).json(new ApiResponse(201, createduser, "User created successfully"));
})



export { registerUser };
