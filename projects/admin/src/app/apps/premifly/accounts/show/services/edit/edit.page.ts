import { ChangeDetectionStrategy, Component, input, linkedSignal, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import type { Premifly } from 'shared/models';

@Component({
  selector: 'admin-account-service-edit',
  imports: [FormField, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './edit.page.ng.html',
  styleUrl: './edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPage {
  account = input.required<Premifly.Account>();
  service = input.required<Premifly.Service>();
  protected readonly revealPassword = signal(false);
  protected readonly model = linkedSignal(() => ({
    code: this.service().credentials?.code ?? '',
    password: this.service().credentials?.password ?? '',
    expires_at: this.service().credentials?.expires_at?.slice(0, 10) ?? '',
  }));
  protected readonly credentials = form(this.model);
}
