const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength:4,
        // maxLength: 12,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,    //for number use min and for string minLength
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://www.aquasafemine.com/wp-content/uploads/2018/06/dummy-man-570x570.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills:{
        type: [String],
    },
},{
    timestamps: true,
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await  jwt.sign({ _id: user._id}, "DEV@Tinder$790",{
        expiresIn: "7d",
    });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;