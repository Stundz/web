import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import type { Premifly } from 'shared/models';

@Component({
  selector: 'admin-account-service-show',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './show.page.ng.html',
  styleUrl: './show.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPage {
  account = input.required<Premifly.Account>();
  service = input.required<Premifly.Service>();
  protected readonly revealPassword = signal(false);
}
