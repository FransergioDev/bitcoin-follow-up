import { Candle, CandleModel } from "../models/CandleModel";

export default class CandleService {
    async save(candle: Candle) {
        const newCandle = await CandleModel.create(candle);
        return newCandle;
    }

    async findLastCandles(quantity: number): Promise<Candle[]> {
        const quantityForSearch = quantity > 0 ? quantity : 10;
        const lastCandles: Candle[] = await CandleModel
            .find()
            .sort({ _id: -1 })
            .limit(quantityForSearch);

        return lastCandles;
    }
}