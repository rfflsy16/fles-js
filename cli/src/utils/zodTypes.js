export const zodTypeMap = {
    string: 'z.string()',
    number: 'z.number()',
    boolean: 'z.boolean()',
    date: 'z.date()',
    array: 'z.array(z.string())',
    object: 'z.record(z.string())',
    email: 'z.string().email()',
    url: 'z.string().url()',
    uuid: 'z.string().uuid()',
    enum: (values) => `z.enum([${values}])`,
    json: 'z.record(z.unknown())'
}

export function parseFields(args) {
    if (!args?.length) {
        throw new Error('Please provide fields (e.g., name:string age:number)')
    }

    return args.reduce((acc, field) => {
        const [name, type, enumValues] = field.split(':')
        if (!name || !type) {
            throw new Error(`Invalid field format: ${field}. Use format: name:type`)
        }
        
        if (type === 'enum' && enumValues) {
            acc[name] = zodTypeMap[type](enumValues)
            return acc
        }
        
        const zodType = zodTypeMap[type.toLowerCase()]
        if (!zodType) {
            throw new Error(`Invalid type: ${type}. Available types: ${Object.keys(zodTypeMap).join(', ')}`)
        }
        
        acc[name] = zodType
        return acc
    }, {})
} 