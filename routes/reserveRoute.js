import express from "express";
import reserveCtrl from "../controllers/reserveCtrl.js";
import { auth } from "../middlewares/auth.js";
const reserveRouter = express.Router();

reserveRouter.post("/create_reserve", auth, reserveCtrl.create);
reserveRouter.delete("/delete_reserve", auth, reserveCtrl.delete);



export default reserveRouter;