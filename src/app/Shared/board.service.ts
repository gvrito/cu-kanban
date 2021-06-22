import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_URL } from '../constants'
import { TitlesService } from './titles.service';
import { tap } from 'rxjs/operators/'

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  cards = [];
  REST_BOARD = '/boards'
  constructor(
    private http: HttpClient,
    private titlesService: TitlesService
  ) {  }

  getBoard(id: number) {
    return this.http.get<IBoard>(`${REST_URL}${this.REST_BOARD}/${id}`);
  }

  putBoard(arr: IBoard) {
    return this.http.put(`${REST_URL}${this.REST_BOARD}/${arr.id}`, arr)
  }

  newEmptyBoard() {
    const board: IBoard = {
      cards: [
        { title: "To Do", tasks: [] },
        { title: "Done", tasks: [] }
      ]
    }
    return this.http.post(`${REST_URL}${this.REST_BOARD}`, board)
  }

  deleteBoard(id: number) {
    return this.http.delete(`${REST_URL}${this.REST_BOARD}/${id}`).pipe(
      tap(() => {
        this.titlesService.deleteTitle(id).subscribe();
        this.titlesService.subscriber.next();
      })
    );
  }

}

export interface IBoard {
  id?: number,
  cards?: ICard[]
}

export interface ICard {
  title: "To Do" | "Done",
  tasks?: string[]
}