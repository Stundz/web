import { DecimalPipe, PercentPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'admin-premifly',
  imports: [DecimalPipe, PercentPipe, RouterLink, MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './premifly.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../apps.page.css', './premifly.page.css'],
})
export class PremiflyPage {
  readonly sections = [
    { key: 'users', label: 'Users', description: 'View members and their contact details.', icon: 'icon-[material-symbols--group-outline]' },
    { key: 'accounts', label: 'Accounts', description: 'Manage shared accounts and service credentials.', icon: 'icon-[material-symbols--manage-accounts-outline]' },
    { key: 'services', label: 'Services', description: 'Configure pricing, availability, and account limits.', icon: 'icon-[material-symbols--layers-outline]' },
    { key: 'subscriptions', label: 'Subscriptions', description: 'Review subscription activity across your services.', icon: 'icon-[material-symbols--card-membership-outline]' },
  ] as const;
	stats = httpResource<{
		users: Record<"total" | "last_week" | "this_week", number>;
		accounts: Record<"total" | "last_week" | "this_week", number>;
		services: Record<"total" | "last_week" | "this_week", number>;
		subscriptions: Record<"total" | "last_week" | "this_week", number>;
	}>(() => `${environment.url.api}/premifly/stats`, {
		defaultValue: {
			users: {
				last_week: 0,
				this_week: 0,
				total: 0,
			},
			accounts: {
				last_week: 0,
				this_week: 0,
				total: 0,
			},
			subscriptions: {
				last_week: 0,
				this_week: 0,
				total: 0,
			},
			services: {
				last_week: 0,
				this_week: 0,
				total: 0,
			},
		},
	});

  readonly metrics = computed(() => {
    // A resource value may throw after a failed request; read it only on success.
    if (this.stats.error() || this.stats.isLoading()) return [];
    const stats = this.stats.value();
    return this.sections.map(section => {
      const value = stats[section.key];
      const difference = value.this_week - value.last_week;
      return { ...section, ...value, difference, growth: value.last_week > 0 ? difference / value.last_week : null };
    });
  });
}
