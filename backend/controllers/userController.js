const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Token = require('../models/tokenModel');
const sendEmail = require('../utils/sendEmail');

// ------------------ GENERATE JWT TOKEN ----------------
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// ------------------ REGISTER USER ----------------
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('All the fields are required!!');
    }

    if (password.lenght < 6) {
        res.status(400);
        throw new Error('Password must be 6 character atleast!!');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email!!');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = generateToken(user._id);

    // send HTTP-only cookie
    res.cookie("token", token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),   // 1 Day
        sameSite: 'none',
        secure: true,
    });

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        })
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});


// ------------------ LOGIN USER ----------------
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter all the fields!!');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error('User not found, please sign up!!');
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    const token = generateToken(user._id);

    // send HTTP-only cookie
    res.cookie("token", token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),   // 1 Day
        sameSite: 'none',
        secure: true,
    });

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id, name, email, photo, phone, bio, token
        })
    }
    else {
        res.status(400);
        throw new Error('Invalid email or password!!');
    }



});

// ------------------ LOGOUT USER ----------------
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: '/',
        httpOnly: true,
        expires: new Date(0),   // Expires now
        sameSite: 'none',
        secure: true,
    });
    res.status(200).json({ message: 'Successfully logged out!!' });
});

// ------------------ GET USER PROFILE ----------------
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id, name, email, photo, phone, bio
        })
    }
    else {
        res.status(400);
        throw new Error('User not found!!');
    }
});

// ------------------ GET LOGGIN STATUS ----------------
const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json(false);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
        return res.json(false);
    }

    return res.json(true);
});

// ------------------ UPDATE USER ----------------
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio
        })
    }
    else {
        res.status(404);
        throw new Error('User not found!!');
    }

});

// ------------------ CHANGE PASSWORD ----------------
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { oldPassword, password } = req.body;

    if (!user) {
        res.status(400);
        throw new Error("User not found!!");
    }

    if (!oldPassword || !password) {
        res.status(400);
        throw new Error("Please add old and new password both!!");
    }

    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    if (user && passwordIsCorrect) {
        user.password = password;
        await user.save();

        res.status(200).send('Password change successfull!!');
    }
    else {
        res.status(400);
        throw new Error('Old password is incorrect!!');
    }
});

// ------------------ FORGOT PASSWORD ----------------
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User does not exists!!');
    }

    // Delete if the token exists
    const token = await Token.findOne({ userId: user._id });
    if (token) {
        await token.deleteOne();
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString('hex') + user._id;

    // Hash token before saving to DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000)    // 30 minutes
    }).save();

    // Construct reset url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please the url below to reset your password.</p>
        <p>This reset link is valid for 30 minutes.</p>

        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

        <p>Regards</p>
        <p>The Team</p>
    `;
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({ success: true, message: 'Reset email sent' });
    } catch (error) {
        res.status(500);
        throw new Error('Email not sent, please try again');
    }
});

// ------------------ RESET PASSWORD ----------------
const resetpassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() }
    });

    if (!userToken) {
        res.status(404);
        throw new Error('Invalid or expired token!!');
    }

    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();

    res.status(200).json({
        message: 'Password reset successfull, please login!!'
    });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetpassword,
}