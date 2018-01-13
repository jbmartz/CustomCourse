'use strict';

import Course from './course.model';

export function index(req, res){
  Course.find()
    .exec()
    .then(function(courses) {
      return res.status(200).json(courses);
    })
    //Print errors
    .catch(function(err) {
      res.status(500);
      res.send(err);
    });
}


export function show(req, res) {
  Course.findById(req.params.id)
    .exec()
    .then(function(course){
      if(course){
        return res.status(200).json(course);
      } else {
        return res.status(204);
      }
    })
    //Print errors
    .catch(function(err){
      res.status(404);
      res.send(err.toString());
    });
}


export function create(req, res) {
  let course = req.body;
  console.log(req.user._id);
  Course.create(course)
    .then(function(createdCourse) {
      createdCourse.teacher.teacherID = req.user._id;
      createdCourse.save();
      return res.status(201).json(createdCourse);
    })
    //Print errors
    .catch(function(err) {
      res.status(400);
      res.send(err);
    });
}

/*
* Add student id to enrolled students in course
*/

export function addStudent(req, res) {
  Course.findById(req.params.id)
    .exec()
    .then(function(course) {
      if(course) {
        course.enrolledStudents.push(req.user._id);
        course.save();
        return res.status(201).json(course);
      } else {
        return res.status(204);
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

