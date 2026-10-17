import { DatePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { errorText } from '../../http-error';
import {
  type PastQuestionStatus,
  type PlugPastQuestion,
  paperPlace,
  paperStatusLabel,
  personName,
} from '../../plug.models';

@Component({
  selector: 'admin-plug-past-question',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './show.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', '../../records.css', './show.page.css'],
})
export class ShowPage {
  readonly pastQuestionId = input.required<string>({ alias: 'past-question' });
  #http = inject(HttpClient);
  #snackBar = inject(MatSnackBar);
  #destroyRef = inject(DestroyRef);
  readonly confirming = signal<PastQuestionStatus | null>(null);
  readonly saving = signal(false);
  #confirmTimer: ReturnType<typeof setTimeout> | null = null;
  readonly paper = httpResource<PlugPastQuestion>(
    () => `${environment.url.api}/plug/past-question/${this.pastQuestionId()}`,
  );

  constructor() {
    this.#destroyRef.onDestroy(() => {
      if (this.#confirmTimer) clearTimeout(this.#confirmTimer);
    });
  }

  place = paperPlace;
  statusLabel = paperStatusLabel;
  publisher = personName;

  choose(status: PastQuestionStatus): void {
    if (this.saving()) return;
    if (this.confirming() !== status) {
      this.confirming.set(status);
      if (this.#confirmTimer) clearTimeout(this.#confirmTimer);
      this.#confirmTimer = setTimeout(() => {
        if (this.confirming() === status) this.confirming.set(null);
      }, 4000);
      return;
    }

    this.saving.set(true);
    this.#http
      .patch<PlugPastQuestion>(`${environment.url.api}/plug/past-question/${this.pastQuestionId()}`, {
        status,
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.confirming.set(null);
          this.paper.reload();
          this.#snackBar.open(`Paper marked ${paperStatusLabel(status).toLowerCase()}.`, 'Close', {
            duration: 3000,
          });
        },
        error: (error: unknown) => {
          this.saving.set(false);
          this.#snackBar.open(errorText(error, 'The decision could not be saved. Sign in and try again.'), 'Close', {
            duration: 5000,
          });
        },
      });
  }
}
