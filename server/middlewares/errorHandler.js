function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({
        message: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

module.exports = errorHandler;
