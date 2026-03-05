import express, { NextFunction, Request, Response } from "express";

import { ValidateRequest } from "../utils/validator";
import { RequestAuthorizer } from "./middleware";


const router = express.Router();
// const repo = repository.CartRepository;

router.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    
  })
export default  router;