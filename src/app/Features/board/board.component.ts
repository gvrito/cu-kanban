import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    this.dialog.open(ConfirmationComponent, {
      data: this.id
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

  public removeTask(id: number, cardId: number) {
    this.cards[cardId].tasks = (<string[]>this.cards[cardId].tasks).filter((val, ind) => ind != id)
    this.boardService.putBoard({id: this.id, cards: this.cards}).subscribe((data) => this.getItems());
  }

}

@Component({
  template: `
  <div>
    <div mat-dialog-title>Are you sure you want to delete this kanban board?</div>
    <div mat-dialog-actions class="btns">
      <button mat-raised-button color="primary" (click)="removeBoard()">Yes</button>
      <button mat-raised-button color="warn" (click)="cancel()">No</button>
    </div>
  </div>
  `,
  styles: [`
      .btns {
        display: flex;
        justify-content: center;
        align-items: center;
      }
  `]
})
export class ConfirmationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private boardService: BoardService,
    private router: Router,
    private dialogRef: MatDialogRef<ConfirmationComponent>
  ) {}

  removeBoard() {
    this.boardService.deleteBoard(this.id).subscribe(() => {
      this.cancel();
      this.router.navigate(['/dashboard']);
    })
  }

  cancel() {
    this.dialogRef.close();
  }

}