import { Router } from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getChannelProfileDetails,
    getWatchHistory
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// Public routes
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateUserDetails)

router.route("/avatar").patch(
    verifyJWT, 
    upload.single("avatar"), 
    updateUserAvatar
)
router.route("/cover-image").patch(
    verifyJWT, 
    upload.single("coverImage"), 
    updateUserCoverImage
)

router.route("/c/:userName").get(verifyJWT, getChannelProfileDetails)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router