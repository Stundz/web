import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'admin-index',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './index.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', './index.page.css'],
})
export class IndexPage {

}
