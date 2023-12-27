const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name!!']
    },
    email: {
        type: String,
        required: [true, 'Please add email!!'],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email!!"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password!!"],
        minLength: [6, 'Password must be 6 characters atleast!!'],
        // maxLength: [23, 'Password must be 23 characters atmost']
    },
    photo: {
        type: String,
        required: [true, "please add a photo"],
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    phone: {
        type: String,
        default: '(+91)'
    },
    bio: {
        type: String,
        maxLength: [300, 'Bio must be 300 characters atmost!!'],
        default: 'bio'

    }
}, { timestamps: true });

// --------------- HASH PASSWORD BEFORE SAVING TO DB ---------------
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;