const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.errors.map((e) => ({
                    path: e.path.join('.').replace(/^body\./, '').replace(/^query\./, '').replace(/^params\./, ''),
                    message: e.message,
                })),
            });
        }
        next(err);
    }
};

module.exports = validate;
