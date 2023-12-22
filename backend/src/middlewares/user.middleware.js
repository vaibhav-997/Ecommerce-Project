import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

const authUser = async (req, res, next) => {
    const token = req.cookies.refreshToken
    if (!token) return next(res.json({ success: false, message: "Ivalid refresh token! Please login before going to the page" })) 
    const decodedRefreshToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findById(decodedRefreshToken._id).select("-password -refreshToken")
    if (!user) return res.json({
        success: false,
         message: "User not found"
    })
    req.user = user
    next()
}

export {authUser}