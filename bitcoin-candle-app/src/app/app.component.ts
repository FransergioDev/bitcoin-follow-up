import { Component, OnDestroy, OnInit } from '@angular/core';
import { CandleService } from './core/services/candle.service';
import { Subscription } from 'rxjs';
import Candle from './core/models/Candle';
import { GoogleChartService } from './core/services/google.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'bitcoin-candle-app';
  private gLib: any;
  private candles: Candle[] = [];

  private candlesSubscription: Subscription | undefined;
  constructor(private candleService: CandleService, private googleChartService: GoogleChartService) {}

  ngOnInit(): void {
    this.connectSocket();
    this.candleService.loadInitialCandles();
    this.candlesSubscription = this.candleService.Candles
      .subscribe((candles: Candle[]) => {
        console.log('candles', candles);
        this.candles = candles;
        this.generateChart();
      });
  }

  ngOnDestroy(): void {
    this.candleService.disconnect();
    if (this.candlesSubscription) this.candlesSubscription.unsubscribe();
  }

  private generateChart() {
    this.gLib = this.googleChartService.getGoogle();
    this.gLib.charts.load('current', {'packages':['corechart']});
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  private drawChart() {
    var data = this.gLib.visualization.arrayToDataTable([
      ...this.generateSeries(),
    ], true);

    var options = {
      legend:'none'
    };

    var chart = new this.gLib.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }

  private generateSeries() {
    if(this.candles.length > 0) {
      return this.candles.map(c => {
          return [
              c.finalDateTime.toLocaleTimeString(),
              c.open,
              c.high,
              c.low,
              c.close
          ]
      })
    }

    return [];
  }

  private async connectSocket() {
    await this.candleService.setupSocketConnection();
    this.candleService.eventSocket();
  }
}
