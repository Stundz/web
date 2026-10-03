import type { Premifly } from "shared/models";
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormField, FormRoot, form, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { PremiflyAccount, PremiflyServiceLogo } from 'shared';
import { ENVIRONMENT, type Paginated } from 'shared/types';

@Component({
  imports: [RouterLink, MatPaginatorModule, MatButtonModule, MatCardModule, MatInputModule, MatSelectModule, PremiflyServiceLogo, FormField, FormRoot],
  selector: 'admin-accounts',
  styleUrl: './accounts.page.css',
  templateUrl: './accounts.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsPage {
  service = input.required<Premifly.Service>();
  accounts = input.required<Paginated<Premifly.Account>>();
  #router = inject(Router);
  #accountService = inject(PremiflyAccount);
  #environment = inject(ENVIRONMENT);
  showAttach = signal(false);
  attachError = signal('');
  availableAccounts = httpResource<Paginated<Premifly.Account>>(() =>
    this.showAttach() ? { url: `${this.#environment.url.api}/premifly/accounts`, params: { limit: 100 } } : undefined,
  );
  attachForm = form(signal({ account_id: '', password: '', code: '', expires_at: '' }), (fields) => {
    required(fields.account_id);
    required(fields.expires_at);
  }, {
    submission: {
      action: async (tree) => {
        this.attachError.set('');
        const { account_id, ...credentials } = tree().value();
        try {
          await firstValueFrom(this.#accountService.attachService(account_id, {
            ...credentials, service_id: this.service().id,
          }));
          this.showAttach.set(false);
          tree().reset();
          await this.#router.navigate([], {
            queryParams: { _t: Date.now() }, queryParamsHandling: 'merge',
          });
        } catch {
          this.attachError.set('Unable to attach this account. Please try again.');
        }
      },
    },
  });

  changePage(event: PageEvent) {
    this.#router.navigate([], {
      queryParams: { page: event.pageIndex + 1, limit: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
