import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BoardService } from 'src/app/Shared/board.service';
import { TitlesService } from 'src/app/Shared/titles.service';

@Component({
  selector: 'app-new-kanban',
  templateUrl: './new-kanban.component.html',
  styleUrls: ['./new-kanban.component.scss']
})
export class NewKanbanComponent implements OnDestroy {
  form = new FormGroup({
    title: new FormControl('', Validators.required)
  })
  subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<NewKanbanComponent>,
    private titleService: TitlesService,
    private boardService: BoardService
  ) { }

  public closeDialog() {
    this.dialogRef.close();
  }

  public submit() {
    if(this.form.valid) {
      this.putTitle(this.form.get('title')?.value);
    }
  }
  
  private putTitle(title: string) {
    this.subscription.add(this.titleService.addTitle(title).subscribe((data) => {
      this.subscription.add(this.boardService.newEmptyBoard().subscribe());
      this.titleService.subscriber.next();
      this.dialogRef.close();
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
