import { Injectable } from "@angular/core";

declare var google: unknown;
@Injectable({
  providedIn: "root"
})
export class GoogleChartService {
  private google: unknown;
  constructor() { this.google = google }
  getGoogle() {
    return this.google;
  }
}
