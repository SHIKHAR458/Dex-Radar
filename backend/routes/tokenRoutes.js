import getToken from "../controllers/tokenController.js";
import express from "express";

const router = express.Router();

router.get('/',getToken);

export default router;