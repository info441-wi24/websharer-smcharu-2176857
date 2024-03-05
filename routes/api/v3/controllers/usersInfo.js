import express from 'express';
var router = express.Router();
import models from '../../../../models.js';

// router.post('/', async(req, res, next) => {
//     if (req.session.isAuthenticated) {
//         const { user, linkedIn } = req.body;
//         try {
//             let userInfo = await req.models.User.findOne({ user: user });
//             if (userInfo) {
//                 userInfo.linkedIn = linkedIn;
//             } else {
//                 userInfo = new User({ user, linkedIn });
//             }
//             await userInfo.save();
//             res.send({ message: 'User info updated successfully', userInfo });
//         } catch (error) {
//             console.log(error);
//             res.send(500).json({ "status": "error", "error": error })
//         }
//     } else {
//         res.status(401).json({
//             status: "error",
//             error: "not logged in"
//         })
//     }
// })

router.post('/', async (req, res, next) => {
    if (req.session.isAuthenticated) {
        const { user, linkedIn } = req.body;
        console.log(user, linkedIn);
        try {
            let userInfo = await models.User.findOne({ user: user });
            if (userInfo) {
                userInfo.linkedIn = linkedIn;
                await userInfo.save();
            } else {
                const newUserInfo = new models.User({ user, linkedIn });
                await newUserInfo.save();
            }
            res.json({ message: 'User info updated successfully', userInfo });
        } catch (error) {
            console.error("Error saving user information:", error);
            res.status(500).json({ "status": "error", "error": "Error saving user information" });
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const username = req.query.username
        let userInfo = await models.User.find({user : username})
        res.json(userInfo)
    } catch (error) {
        console.log("Error getting userinfo from db", error)
        res.send(500).json({ "status": "error", "error": error })
    }
})



export default router;