const express = require('express')
const UserRouter = new express.Router()
const UserController = require('../controllers/UserController')

const {uploadUserFile} = require('../middleware/upload_files')
const auth = require('../middleware/auth')
const multer = require('multer')

// const upload = multer({
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb(new Error("Only JPG, JPEG, and PNG file formats are allowed"))
//         }

//         cb(undefined, true)
//     }
// })

"----- Users -----"
// adds a new user
UserRouter.post('/new', UserController.addUser)


// Logs in user
UserRouter.post('/login', UserController.loginUser)


// Logs out a user
UserRouter.post('/logout', auth, UserController.logOutUser)


// Logs the user out of all sessions/devices (removes all tokens)
UserRouter.post('/logout/all', auth, UserController.logOutAllSessions)


// Fetches the user profile
UserRouter.get('/me', auth, UserController.getUserProfile)


// Updates a user using its id
UserRouter.patch('/update', auth, UserController.updateUser)


// Lets the user delete his data
UserRouter.delete('/delete', auth, UserController.deleteUser)

// Lets the user set his avatar
UserRouter.post('/me/avatar', auth, uploadUserFile, UserController.setAvatar)


// Lets the user delete his avatar
UserRouter.delete('/me/avatar', auth, UserController.deleteAvatar)


// Retrievs the user avatar by his id
UserRouter.get('/:id/avatar', UserController.getAvatar)

module.exports = UserRouter