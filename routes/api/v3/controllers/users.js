import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';

const router = express.Router();

// Handler for "api/v3/users/myIdentity"
router.get('/myIdentity', async (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({
            status: "loggedin", 
            userInfo: {
                name:req.session.account.name,
                username:req.session.account.username
            }
        })
      } else {
        res.json({ status: "loggedout" });
      }
})

export default router;
