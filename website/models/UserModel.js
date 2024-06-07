const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Project = require('./ProjectModel')
const Run = require('./RunModel')
const Model = require('./ModelModel')
require('dotenv').config({ path: './config/dev.env'})

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        min: [1, 'Age must be a positive number']
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    role: {
        type: String,
        default: 'user',
        // required: true,
        enum: ["Data Scientist", "ML Engineer", "MLOps Engineer", "Software Engineer", "DevOps Engineer", "ML Team Lead", "ML Platform Lead", "Head/C-level", "Student / Intern", "AI Researcher", "Other"]
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error("Password must not contain password")
            }
        }
    },
    type_of_data: {
        type: String,
        // required: true,
        enum: ["Prompts", "Images", "Text", "Audio", "Videos", "Time series", "Tables", "Graphs", "Other"]
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// Virtual property that links the user to the projects he owns
userSchema.virtual('projects', {
    ref: 'Projects',
    localField: '_id',
    foreignField: 'owner'
})

// This function is ran every time res.send() is called and a user is sent through it
// It's like a middleware, res.send() method calls JSON.Stringify() every time it's ran, and JSON.Stringify() by default calls toJSON() 
// method that is defined on the instance of the model like the one below. So, the toJSON() can be customized to do anything we want
// before sending the model isntance through res.send(). In my case, I use it to filter the data sent through the endpoint to
// not include the user's password or auth tokens 
userSchema.methods.toJSON = function () {
    const userData = this.toObject()
    delete userData.password
    delete userData.tokens
    delete userData.avatar

    return userData
}

// Generated a token using the id of the user as the payload and saves it into the db
userSchema.methods.genAuthToken = async function () {
    const id = this._id.toString()
    const token = jwt.sign({ _id: id }, process.env.JWT_SECRET)
    this.tokens.push({ token })

    await this.save()
    return token
}


// Static method that finds a user using email and verifies the entered password matches the one in the db
userSchema.statics.findByEmail = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to login...No user found!")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login...Wrong Password!")
    }

    return user
}


// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

// Delete user projects when user is removed
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this
    await Project.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema, 'Users')

module.exports = User