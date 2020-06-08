module.exports = {
    response: function(res, data, status, message) {
        const result = {};
        result.status = status || 200;
        result.data = data || '';
        result.message = message === 'success' ? true : false

        return res.status(result.status).json({
            status: result.status,
            success: result.message,
            data: result.data
        });
    }
}