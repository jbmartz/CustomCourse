'use strict';

import mongoose, {Schema} from 'mongoose';
import {registerEvents} from './course.events';


let nameSchema = Schema({

  firstName: {type: String, required: true},
  lastName: {type: String, required: true}

});



var CourseSchema = new Schema({
  name: nameSchema,

  category: {
    type: String,
    required: true
  },

  teacher: {
    type: String,
    required: true
  },

  maxStudents: {
    type: Number,
    required: true
  },

  enrolledStudents: {
    type: [Object.ID],
  }


  //assignment

});


registerEvents(CourseSchema);
export default mongoose.model('Course', CourseSchema);