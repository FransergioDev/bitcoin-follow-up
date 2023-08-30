export default class Candle {
  currency: string = '';
  finalDateTime: Date = new Date();
  open: number = 0;
  close: number = 0;
  high: number = 0;
  low: number = 0;
  color: string = '';

  constructor(candleObj: unknown) {
      Object.assign(this, candleObj);
      this.finalDateTime = new Date(this.finalDateTime);
  }
}
