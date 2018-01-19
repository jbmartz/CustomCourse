import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './student.routes';

export class CourseDiscoveryController {

  courses = [];
  courseNames = [];
  selectedCourses = [];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/courses')
      .then(response => {
        this.courses = response.data;
        this.courses.forEach(course => {
          this.courseNames.push(course.subject);
        });
        this.selectedCourses = this.courses;
      });
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  filterCourse(courseName) {
    this.selectedCourses = this.courses;
    let temp = this.selectedCourses.filter(course => course.subject.includes(courseName));
    if(temp.length > 0) {
      this.selectedCourses = temp;
    }
  }
}

export default angular.module('webProjectsApp.courseDiscovery', [ngRoute])
  .config(routing)
  .component('courseDiscovery', {
    template: require('./courseDiscovery.html'),
    controller: CourseDiscoveryController,
    controllerAs: 'courseDiscoveryController'
  })
  .name;
