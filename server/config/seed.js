/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import AbstractCourse from '../api/course/AbstractCourse.model';
import TailoredCourse from '../api/course/TailoredCourse.model';
import config from './environment/';
import shared from './environment/shared';
import Problem from '../api/problem/problem.model';
import * as problemController from '../api/problem/problem.controller';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB)
  {
    //not related to app data - could be deleted
    Thing.find({}).remove()
    .then(() => {
      let thing = Thing.create({
        name: 'Development Tools',
        info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
        + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
        + 'Stylus, Sass, and Less.'
      }, {
        name: 'Server and Client integration',
        info: 'Built with a powerful and fun stack: MongoDB, Express, '
        + 'AngularJS, and Node.'
      }, {
        name: 'Smart Build System',
        info: 'Build system ignores `spec` files, allowing you to keep '
        + 'tests alongside code. Automatic injection of scripts and '
        + 'styles into your index.html'
      }, {
        name: 'Modular Structure',
        info: 'Best practice client and server structures allow for more '
        + 'code reusability and maximum scalability'
      }, {
        name: 'Optimized Build',
        info: 'Build process packs up your templates as a single JavaScript '
        + 'payload, minifies your scripts/css/images, and rewrites asset '
        + 'names for caching.'
      }, {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku '
        + 'and openshift subgenerators'
      });
      return thing;
    })
    .then(() => console.log('finished populating things'))
    .catch(err => console.log('error populating things', err));


    //for every role on shared user roles, create a user for that role.
    for (let role of shared.userRoles)
    {
      User.find({}).remove()
        .then(() => {
          User.create({
            provider: 'local',
            role: role,
            name: 'Test '+role.charAt(0).toUpperCase() + role.slice(1),
            email: role+'@example.com',
            password: 'ps-'+role
          }).then(() => console.log('finished populating users'))
          .catch(err => console.log('error populating users', err));
      });
    }//end creating users
    for(let i = 0; i < 25; i++) {
      for (let subject of shared.subjects) {
        for (let category of subject.allowedCategories) {
          Problem.find({}).remove()
            .then(() => {
              problemController.create({
                'protocol': 'dpg',
                'version': '0.1',
                'problem': {
                  'subject': subject.subject,
                  'category': category,
                  'depth': 1
                }
              });
            })
            .catch(err => console.log('error populating Problems', err));
        }

        console.log("Finished populating a problem set");
      }//end for of.
    }

    //create a course with a every combination
    //of categories and subjects
      for (let subject of shared.subjects) {
        //for each specific category for this subject
        //create a course
        for (let category of subject.allowedCategories) {
          AbstractCourse.find({}).remove()
            .then(() => {
              AbstractCourse.create({
                name: subject.subject + '-about-' + category,
                description: subject.subject + 'focusing on the ' + category + ' topic',
                subjects: [subject.subject],
                categories: [category],
                assignments: [{
                  title: 'Assignment 1',
                  description: 'this focuses on ' + category + 'operations',
                  minNumProblems: 5,
                  maxNumProblems: 15,
                  newProblemPercentage: 25
                }, {
                  title: 'Assignment 2',
                  description: 'this focuses on ' + category + 'operations',
                  minNumProblems: 10,
                  maxNumProblems: 35,
                  newProblemPercentage: 35
                }]
              }).then((createdCourse) => {
                console.log('finished populating Abstract Courses');
                createTailoredCourse(createdCourse);
              })
                .catch(err => console.log('error populating Abstract Courses', err));
            });
        }//end for of.
      }//end seeding Abstract courses.

    //Tailored Course
    //Random numbers for numbers and percentages
    //makes title informative, for problems and assignments

  }//end config seedDB
}//end export

function createTailoredCourse(abstractCourse) {
  //console.log(`${abstractCourse.subjects}: ${abstractCourse.categories} -> ${abstractCourse._id}`);
  TailoredCourse.find({}).remove()
    .then(() => {
      TailoredCourse.create({
        abstractCourseID: abstractCourse._id,
        studentID: null,
        subjects: abstractCourse.subjects,
        categories: abstractCourse.categories,
        assignments: []
      }).then(() => console.log('finished populating Tailored Courses based on Abstract Courses'))
      .catch(err => console.log('error populating Tailored Courses based on Abstract Courses', err));
  });

}//end create Tailored Course
