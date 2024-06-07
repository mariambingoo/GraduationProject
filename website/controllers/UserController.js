const User = require('../models/UserModel')
const account = require('../emails/account')
const sharp = require('sharp')


// adds a new user
const addUser = async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.genAuthToken()
        account.sendWelcomeEmail(user.email, user.username)
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({error: "User creation failed"})
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findByEmail(req.body.email, req.body.password)
        const token = await user.genAuthToken()    
        res.send({ user, token: token })
    } catch (e) {
        res.status(400).send({Error: "User login failed"})
    }
}


const logOutUser = async (req, res) => {
    try {
        const user = req.user
        user.tokens = user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await user.save()
        res.send("Logged Out")
    } catch (e) {
        res.status(500).send({Error: "User logout failed"})
    }
}

const logOutAllSessions =  async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send("Logged Out of all devices")
    } catch (e) {
        res.status(500).send({error: "Logout of all devices failed"})
    }
}

const getUserProfile = async (req, res) => {
    res.send(req.user)
}

const updateUser = async (req, res) => {
    const updateKeys = Object.keys(req.body)
    const allowedUpdates = ['last_name','first_name', 'username', 'email', 'password', 'age']
    const validUpdate = updateKeys.every((update) => allowedUpdates.includes(update))

    if (!validUpdate) {
        return res.status(400).send({Error: "Invalid update"})
    }

    try {
        updateKeys.forEach((key) => req.user[key] = req.body[key])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send({error: "Updating user failed"})
    }
}

const deleteUser = async (req, res) => {
    try {
        account.sendCancelationEmail(req.user.email, req.user.username)
        await req.user.deleteOne()
        res.send(req.user)
    } catch (e) {
        res.status(500).send("User deletion failed")
    }
}

const setAvatar = async (req, res) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }
      console.log('File received:', req.file);
  
      // Process the image with sharp
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
  
      console.log('Image processed with sharp.');
  
      // Set the avatar and save the user
      req.user.avatar = buffer;
      await req.user.save();
  
      console.log('User avatar saved.');
  
      res.status(201).send('Avatar set');
    } catch (error) {
      console.error('Error setting avatar:', error);
      res.status(400).send({ error: error.message });
    }
  };
  

const deleteAvatar = async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send("Avatar deleted")
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}


const getAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('No user/Avatar found')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(error) {
        res.status(404).send({error: error.message})
    }
    
}

module.exports = {
    addUser,
    loginUser,
    logOutUser,
    logOutAllSessions,
    getUserProfile,
    updateUser,
    deleteUser,
    setAvatar,
    deleteAvatar,
    getAvatar
}