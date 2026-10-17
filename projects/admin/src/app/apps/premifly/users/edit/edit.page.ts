import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'admin-edit',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './edit.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', './edit.page.css'],
})
export class EditPage {

}
