import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService, IBoard, ICard } from 'src/app/Shared/board.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  form = new FormGroup({
    body: new FormControl('', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<NewTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {board:IBoard, title: string},
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
  }

  submit(){
    if(this.form.valid) {
      const id = this.data.board.cards?.findIndex((val) => val.title == this.data.title);
      (<ICard[]>this.data.board.cards)[<number>id].tasks?.push(this.body.value);
      this.boardService.putBoard(this.data.board).subscribe();
      this.dialogRef.close();
    }
  }

  get body() {
    return this.form.get('body') as FormControl
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
