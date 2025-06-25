import { MODELNAME } from "../models/index.js"
import { ObjectId } from 'mongodb'

export const MODELNAMETypeDefs = `#graphql
    scalar Date

    type MODELNAME {
        _id: ID!
TYPEDEFS_FIELDS
        createdAt: Date
        updatedAt: Date
    }

    input MODELNAMEInput {
INPUT_FIELDS
    }

    type Query {
        getMODELNAME(id: ID!): MODELNAME
        getMODELNAMEs: [MODELNAME]
    }

    type Mutation {
        createMODELNAME(input: MODELNAMEInput): MODELNAME
        updateMODELNAME(id: ID!, input: MODELNAMEInput): MODELNAME
        deleteMODELNAME(id: ID!): MODELNAME
    }
`

export const MODELNAMEResolvers = {
    Query: {
        getMODELNAME: async (_, { id }, _context) => {
            return await MODELNAME.findByPk(id)
        },
        getMODELNAMEs: async (_, __, _context) => {
            return await MODELNAME.findAll()
        }
    },
    Mutation: {
        createMODELNAME: async (_, { input }, _context) => {
            return await MODELNAME.create(input)
        },
        updateMODELNAME: async (_, { id, input }, _context) => {
            await MODELNAME.update(input, { 
                where: { _id: new ObjectId(id) }
            })
            return await MODELNAME.findByPk(id)
        },
        deleteMODELNAME: async (_, { id }, _context) => {
            // Get data before delete
            const data = await MODELNAME.findByPk(id)
            if (!data) throw new Error('Data not found')
            
            // Delete data
            await MODELNAME.destroy({ 
                where: { _id: new ObjectId(id) }
            })
            
            // Return deleted data
            return data
        }
    }
} 