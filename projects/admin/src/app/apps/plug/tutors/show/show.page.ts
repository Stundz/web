import { DatePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { errorText } from '../../http-error';
import {
  type PlugTutorRecord,
  type TutorDecision,
  personName,
  standingLabel,
  tutorStanding,
} from '../../plug.models';

@Component({
  selector: 'admin-plug-tutor',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './show.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', '../../records.css', './show.page.css'],
})
export class ShowPage {
  readonly tutorId = input.required<string>({ alias: 'tutor' });
  #http = inject(HttpClient);
  #snackBar = inject(MatSnackBar);
  #destroyRef = inject(DestroyRef);
  readonly confirming = signal<TutorDecision | null>(null);
  readonly saving = signal(false);
  #confirmTimer: ReturnType<typeof setTimeout> | null = null;
  readonly tutor = httpResource<PlugTutorRecord>(
    () => `${environment.url.api}/plug/tutor/${this.tutorId()}`,
  );
  readonly standing = computed(() =>
    this.tutor.hasValue() ? tutorStanding(this.tutor.value().valid_until) : 'pending',
  );

  constructor() {
    this.#destroyRef.onDestroy(() => {
      if (this.#confirmTimer) clearTimeout(this.#confirmTimer);
    });
  }

  name = personName;
  standingText = standingLabel;

  choose(decision: TutorDecision): void {
    if (this.saving()) return;
    if (this.confirming() !== decision) {
      this.confirming.set(decision);
      if (this.#confirmTimer) clearTimeout(this.#confirmTimer);
      this.#confirmTimer = setTimeout(() => {
        if (this.confirming() === decision) this.confirming.set(null);
      }, 4000);
      return;
    }

    this.saving.set(true);
    this.#http
      .patch<PlugTutorRecord>(`${environment.url.api}/plug/tutor/${this.tutorId()}`, { decision })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.confirming.set(null);
          this.tutor.reload();
          const message =
            decision === 'approve'
              ? 'Tutor approved for one year.'
              : decision === 'reject'
                ? 'Tutor application rejected.'
                : 'Application returned to review.';
          this.#snackBar.open(message, 'Close', { duration: 3000 });
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
