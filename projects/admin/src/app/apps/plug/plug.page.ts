import { type HttpResourceRef, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import type { Paginated } from 'shared/types';
import { environment } from '../../../environments/environment';
import type { PlugPastQuestion, PlugTutorialRecord, PlugTutorRecord } from './plug.models';

@Component({
  selector: 'admin-plug',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './plug.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../apps.page.css', './plug.page.css'],
})
export class PlugPage {
  readonly sections = [
    {
      key: 'past-questions',
      label: 'Past questions',
      description: 'Upload exam papers, then approve or reject them before students can use them.',
      icon: 'icon-[material-symbols--history-edu-outline]',
      action: 'Review papers',
    },
    {
      key: 'tutors',
      label: 'Tutors',
      description: 'Read applications and approve a tutor for one year, or reject them.',
      icon: 'icon-[material-symbols--co-present-outline]',
      action: 'Review applications',
    },
    {
      key: 'tutorials',
      label: 'Tutorials',
      description: 'Inspect classes, the tutors who run them, prices, and scheduled sessions.',
      icon: 'icon-[material-symbols--menu-book-outline]',
      action: 'Open tutorials',
    },
  ] as const;

  readonly pendingPapers = httpResource<Paginated<PlugPastQuestion>>(() => ({
    url: `${environment.url.api}/plug/past-questions`,
    params: { limit: '1', status: 'PENDING' },
  }));

  readonly pendingTutors = httpResource<Paginated<PlugTutorRecord>>(() => ({
    url: `${environment.url.api}/plug/tutors`,
    params: { limit: '1', status: 'pending' },
  }));

  readonly tutorials = httpResource<Paginated<PlugTutorialRecord>>(() => ({
    url: `${environment.url.api}/plug/tutorials`,
    params: { limit: '1', all: '1' },
  }));

  refresh(): void {
    this.pendingPapers.reload();
    this.pendingTutors.reload();
    this.tutorials.reload();
  }

  count<T>(resource: HttpResourceRef<Paginated<T> | undefined>): string {
    if (resource.hasValue()) {
      const page = resource.value();
      if (page) return new Intl.NumberFormat().format(page.meta.total);
    }
    return resource.error() ? 'Unavailable' : '…';
  }
}
