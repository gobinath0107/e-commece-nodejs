const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: '1d'
    })
    return token
}

const isTokeValid = ({ token }) => jwt.verify(token,process.env.JWT_SECRET)

const attachCookiesToRes = ({ res,user }) => {
    const token = createJWT({ payload: user })

    res.cookie('token',token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}

module.exports = { createJWT,attachCookiesToRes,isTokeValid}