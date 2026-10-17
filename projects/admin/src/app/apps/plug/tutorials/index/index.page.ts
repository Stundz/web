import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import type { Paginated } from 'shared/types';
import { environment } from '../../../../../environments/environment';
import { type PlugTutorialRecord, personName } from '../../plug.models';
import { listQuery, pageChange } from '../../query';

@Component({
  selector: 'admin-plug-tutorials',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  templateUrl: './index.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', '../../records.css', './index.page.css'],
})
export class IndexPage {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  readonly columns = ['name', 'course', 'tutor', 'price', 'session'];
  readonly search = new FormControl('', { nonNullable: true });
  readonly query = toSignal(this.#route.queryParamMap, {
    initialValue: this.#route.snapshot.queryParamMap,
  });
  readonly tutorials = httpResource<Paginated<PlugTutorialRecord>>(() => ({
    url: `${environment.url.api}/plug/tutorials`,
    params: { ...listQuery(this.query(), ['page', 'limit', 'q']), all: '1' },
  }));

  constructor() {
    this.search.setValue(this.#route.snapshot.queryParamMap.get('q') ?? '', { emitEvent: false });
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((q) => {
        void this.#router.navigate([], {
          relativeTo: this.#route,
          queryParams: { q: q.trim() || null, page: null },
          queryParamsHandling: 'merge',
        });
      });
  }

  changePage(event: PageEvent): void {
    const perPage = this.tutorials.hasValue() ? this.tutorials.value().meta.per_page : event.pageSize;
    void this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: pageChange(event, perPage),
      queryParamsHandling: 'merge',
    });
  }

  tutorName(tutorial: PlugTutorialRecord): string {
    return personName(tutorial.tutor);
  }
}
