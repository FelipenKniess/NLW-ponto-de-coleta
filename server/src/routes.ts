import express from 'express';
import PointsController from './controllers/pointsController';
import ItemsController from  './controllers/itemsController';

const routes = express.Router();

const pointsController = new PointsController();
routes.get('/points', pointsController.index);
routes.get('/allPoints', pointsController.indexAllPoints);
routes.get('/points/:id', pointsController.show);
routes.post('/points' , pointsController.create);

const itemsController  = new ItemsController();
routes.get('/items', itemsController.index);

export default routes;