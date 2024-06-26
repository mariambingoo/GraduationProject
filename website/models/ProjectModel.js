const mongoose = require('mongoose')
const Model = require('./ModelModel')
require('dotenv').config({ path: '../config/dev.env'})

const ProjectSchema = new mongoose.Schema({
  project_name:{
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    required: false,
    trim: true,
  },
  date_created:{
    type: Date,
    required: true,
    default: Date.now,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  contributers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}]
})

ProjectSchema.virtual('models', {
  ref: 'Model',
  localField: '_id',
  foreignField: 'project'
})

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const project = this
  await Model.deleteMany({ project: project._id })
  next()
})

const Project = mongoose.model('Project', ProjectSchema, 'Projects')

module.exports = Project


// // Project document
// {
//   _id: 123,
//   name: 'Project 1',
//   description: 'This is a project',
//   // models: [id1, id2, id3]
// }

// // Model document
// {
//   _id: 456,
//   name: 'Model 1',
//   description: 'This is a model',
//   project: 123
// }
