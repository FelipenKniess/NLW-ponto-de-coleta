import {Request, Response} from 'express';
import Knex from '../database/connection';

class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await Knex.transaction();

        const point = {
            image:'https://i.imgur.com/n8ABOnz.jpeg',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }    

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items.map((item_id:number) =>{
            return {
                item_id,
                point_id
            }
        });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ... point,
        });
    };
    
    async show (request:Request, response:Response){
        const { id } = request.params;

        const point = await Knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message:'Point Not Found.'});
        }

        /**
         * Select * FROM items
         *  JOIN point_items on items.id = point_items.item._id
         *  where point_items.point_id = id
         */
        const items = await Knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({point, items});

    }

    async index(request: Request, response:Response){
        const{city, uf, items} = request.query;
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));
        
        const points = await Knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);
    }

    async indexAllPoints(request:Request, response:Response){
        const points = await Knex('points').select('*');
        return response.json(points);
    }
}

export default PointsController;
