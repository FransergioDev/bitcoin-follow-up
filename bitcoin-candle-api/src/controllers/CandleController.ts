import { Request, Response } from "express";
import CandleService from "../services/CandleService";

export default class CandleController {
    async findLastCandles(req: Request, resp: Response) {
        const candleService = new CandleService();
        const quantity = parseInt(req.params.quantity);
        const lastCandles = await candleService.findLastCandles(quantity);
        return resp.json(lastCandles);
    }
}