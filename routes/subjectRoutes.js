const express = require('express');
const subRouter = express.Router();
const subject = require('../models/subjects');
const subjectController = require('../controllers/subject.controller'); 

subRouter
.get('/', subjectController.paginatedResults(subject), subjectController.getSubs)
.post('/', subjectController.postSubs)
.put('/:subName', subjectController.putSubs)
.patch('/:subName/tags',subjectController.patchSubs);

module.exports = subRouter;
