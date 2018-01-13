import {Router} from 'express';
import * as controller from './course.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index); //show all course
router.get('/:id', controller.show);
router.post('/', auth.hasRole('teacher'), controller.create);
router.post('/:id',auth.hasRole('student'),controller.addStudent); // Add Student to course
router.delete('/', auth.hasRole('admin'), controller.create);

module.exports = router;