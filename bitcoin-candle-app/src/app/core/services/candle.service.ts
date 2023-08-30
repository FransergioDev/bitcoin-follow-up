import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

import Candle from '../models/Candle';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CandleService {
  private socket: Socket | undefined;
  private _candles: Candle[] = []
  private _behaviorCandles: BehaviorSubject<Candle[]> = new BehaviorSubject(this._candles);

  constructor(private httpClient:  HttpClient, private toastr: ToastrService) { }

  public get Candles() {
    return this._behaviorCandles.asObservable();
  }

  async loadInitialCandles() {
    const sub = this.httpClient.get<unknown[]>(`${environment.candlesApi}${environment.candlesApiEndpoint}/10`)
    .subscribe({
      next: (result: unknown[]) => {
        const candlesObj = result;
        const candles: Candle[] = candlesObj.map((c: unknown) => new Candle(c));

        this._candles = candles;
        this._behaviorCandles.next(this._candles);

        sub.unsubscribe();
      }, error: (err) => {
        sub.unsubscribe();
        console.error(`Não foi possível carregar os dados de candles`, err);
      }
    });
  }

  async setupSocketConnection() {
    this.socket = await io(environment.socketServer);
    console.log("socket conected");
    console.log("this;", this.socket);
  }

  eventSocket() {
    if (this.socket) {
      this.socket.on(environment.socketEventName, (data: unknown) => {
        console.log(`socket: ${environment.socketEventName}`,data);
        if (data) {
          const candle = new Candle(data);
          this._candles = [...this._candles, candle];
          this._behaviorCandles.next(this._candles);
          this.toastr.success('New Candle', candle.currency);
        }
      });
    } else console.error('Websocket não conectado, verifique o estado da conexão!');
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}
