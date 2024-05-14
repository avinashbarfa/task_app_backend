import express from 'express';
import { getTasksList, getTask, createTask,  deleteTask, updateTask } from '../controller/tasks/index.js';
import { requestTime, validateUser } from '../middleware/index.js';
var router = express.Router();

router.map = function(a, route) {
    route = route || '';
    for (var key in a) {
      switch (typeof a[key]) {
        case 'object':
            router.map(a[key], route + key);
          break;
        case 'function':
            console.log('%s %s', key, route);
          router[key](route, a[key]);
          break;
      }
    }
};

const tasks = {
    getAll: getTasksList,
    get: getTask,
    create: createTask,
    delete: deleteTask,
    update: updateTask,
};

const routes = {
  '/tasks': {
      post: tasks.create,
      get: tasks.getAll,
      '/:id': {
          get: tasks.get,
          delete: tasks.delete,
          put: tasks.update
      }
  }
}

router.use(requestTime);
router.use(validateUser);
  
router.map(routes);

export default router;