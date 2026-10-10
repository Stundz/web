import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'admin-show',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './show.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', './show.page.css'],
})
export class ShowPage {

}
