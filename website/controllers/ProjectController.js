const express = require('express');
const projectModel = require('../models/ProjectModel.js');

const createModel = async (req, res) => {
    const data = req.body;
    try {
        const project = new projectModel(data);
        await project.save();
        res.status(200).send({ message: 'Project created successfully!', data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating project' });
    }
}

module.exports = {
    createModel
}