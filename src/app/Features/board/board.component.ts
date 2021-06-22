import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService, IBoard, ICard } from '../../Shared/board.service';
import { NewTaskComponent } from '../dialog/new-task/new-task.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board!: IBoard;
  cards:ICard[] = [];
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((data) => {
      this.id = parseInt(<string>(data.get('id')));
      this.getItems();
    })
  }

  drop(event: CdkDragDrop<string[] | undefined>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(<string[]>event.container.data, event?.previousIndex, event?.currentIndex);
    } else {
      transferArrayItem(<string[]>event.previousContainer.data,
                        <string[]>event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.updateList();
  }

  private updateList() {
    this.boardService.putBoard({id: this.id, cards: this.cards}).subscribe((data) => this.getItems());
  }

  private getItems(id: number = this.id): void {
    this.boardService.getBoard(id).subscribe((data) => {
      this.cards = <ICard[]>data.cards;
      this.board = data;
    })
  }

  public removeBoard() {
    this.boardService.deleteBoard(this.id).subscribe(() => {
      this.router.navigate(['/dashboard'])
    })
  }

  public openDialog(title: string) {
    this.dialog.open(NewTaskComponent, {
      data: {
        board: this.board,
        title
      }
    });
  }

}
