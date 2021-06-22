import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { REST_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TitlesService {

  titles = '/titles'

  subscriber = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  getTitles() {
    return this.http.get<ITitle[]>(REST_URL + `${this.titles}`);
  }

  addTitle(title: string) {
    return this.http.post<ITitle>(REST_URL + `${this.titles}`, {title: title});
  }

  deleteTitle(id: number) {
    return this.http.delete(REST_URL + `${this.titles}/${id}`)
  }

}

export interface ITitle {
  id: number,
  title: string
}