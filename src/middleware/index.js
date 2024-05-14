const requestTime = function (req, _res, next) {
    req.requestTime = Date.now();
    next();
}

const validateUser = (req, res, next) => {
    const isValid = true;

    if (isValid) {
        req.userId = '123456789';
        next();
    } else {
        const body = {
            error: 'UNAUTHORIZED',
            message: 'User is not authorized',
        }
        res.status(401).send(body);
    }
}

export {
    requestTime,
    validateUser,
};