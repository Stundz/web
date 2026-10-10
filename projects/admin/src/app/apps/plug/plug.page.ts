import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-plug',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './plug.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../apps.page.css', './plug.page.css'],
})
export class PlugPage {}
