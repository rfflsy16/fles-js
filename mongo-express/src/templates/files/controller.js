import { MODELNAME } from "../models/index.js"
import { ObjectId } from 'mongodb'

export class MODELNAMEController {
    static async findAll(req, res, next) {
        try {
            const data = await MODELNAME.findAll()
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async findOne(req, res, next) {
        try {
            const { id } = req.params
            const data = await MODELNAME.findByPk(id)
            
            if (!data) {
                throw { name: 'NotFound' }
            }
            
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async create(req, res, next) {
        try {
            const data = await MODELNAME.create(req.body)
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params
            await MODELNAME.update(req.body, {
                where: { _id: new ObjectId(id) }
            })
            
            const data = await MODELNAME.findByPk(id)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async destroy(req, res, next) {
        try {
            const { id } = req.params
            const data = await MODELNAME.findByPk(id)
            
            if (!data) {
                throw { name: 'NotFound' }
            }
            
            await MODELNAME.destroy({
                where: { _id: new ObjectId(id) }
            })
            
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
} 