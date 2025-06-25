export default (err, req, res, next) => {
    let status = 500
    let message = 'Internal Server Error'

    switch (err.name) {
        case 'NotFound':
            status = 404
            message = 'Data not found'
            break
            
        case 'ValidationError':
            status = 400
            message = err.message
            break
            
        case 'Unauthorized':
            status = 401
            message = 'Invalid token'
            break
            
        case 'Forbidden':
            status = 403
            message = 'Access denied'
            break
            
        case 'NotImplemented':
            status = 501
            message = 'Not implemented'
            break
    }

    res.status(status).json({ message })
} 