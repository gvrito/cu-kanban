import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITitle, TitlesService } from './Shared/titles.service';
import { NewKanbanComponent } from './features/dialog/new-kanban/new-kanban.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Project';
  titles: ITitle[] = [];
  subscription = new Subscription();
  
  constructor(
    private router: Router,
    private titleService: TitlesService,
    private dialog: MatDialog
  ) {
    this.loadNav();
    this.subscription.add(
      this.titleService.subscriber.subscribe(() => {
        setTimeout(() => {
          this.loadNav()
        },50)
      })
    )
  }

  private loadNav() {
    this.subscription.add(this.titleService.getTitles().subscribe((data) => {
      this.titles = data;
    }))
  }

  public openModal() {
    this.dialog.open(NewKanbanComponent)
  }

  public redirect(id: number) {
    this.router.navigate(['/board'], { queryParams: { id } })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
