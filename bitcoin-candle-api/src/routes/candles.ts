import { Router } from 'express';
import CandleController from '../controllers/CandleController';

export const candleRouter = Router();
const candleCtrl = new CandleController();

candleRouter.get('/:quantity', candleCtrl.findLastCandles);