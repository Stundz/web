import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-home',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatTableModule, MatTooltipModule, RouterLink],
  templateUrl: './home.page.ng.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly period = signal(30);
  protected readonly app = signal('All apps');
  protected readonly query = signal('');
  protected readonly columns = ['customer', 'app', 'activity', 'amount', 'status'];
  protected readonly applications = [
    { name: 'Premifly', description: 'Subscriptions & premium access', route: '/app/premifly', icon: 'icon-[material-symbols--workspace-premium-outline]', members: 8420, revenue: 2450000, growth: '+12.8%', capacity: 76, capacityLabel: 'Account capacity used' },
    { name: 'Plug', description: 'Tutorials & learning resources', route: '/app/plug', icon: 'icon-[material-symbols--school-outline]', members: 4060, revenue: 780000, growth: '+18.4%', capacity: 64, capacityLabel: 'Tutorial seats booked' },
  ];
  protected readonly selectedApps = computed(() => this.applications.filter(item => this.app() === 'All apps' || item.name === this.app()));
  protected readonly multiplier = computed(() => this.period() / 30);
  protected readonly revenue = computed(() => this.selectedApps().reduce((sum, item) => sum + item.revenue, 0) * this.multiplier());
  protected readonly metrics = computed(() => [
    { label: 'Active members', value: this.selectedApps().reduce((sum, item) => sum + item.members, 0).toLocaleString(), change: '+14.2%', icon: 'icon-[material-symbols--group-outline]' },
    { label: 'Revenue', value: `${(this.revenue() / 1000000).toFixed(2)}M XAF`, change: '+9.6%', icon: 'icon-[material-symbols--payments-outline]' },
    { label: 'New subscriptions', value: Math.round((this.app() === 'Plug' ? 185 : this.app() === 'Premifly' ? 1099 : 1284) * this.multiplier()).toLocaleString(), change: '+22.4%', icon: 'icon-[material-symbols--card-membership-outline]' },
    { label: 'Success rate', value: '98.6%', change: '+1.2 pts', icon: 'icon-[material-symbols--check-circle-outline]' },
  ]);
  protected readonly trend = computed(() => (this.period() === 7 ? ['Days 1–2', 'Days 3–4', 'Days 5–6', 'Day 7'] : this.period() === 90 ? ['Days 1–23', 'Days 24–45', 'Days 46–68', 'Days 69–90'] : ['Days 1–8', 'Days 9–15', 'Days 16–23', 'Days 24–30']).map((label, index) => ({ label, premifly: [420000, 570000, 660000, 800000][index] * this.multiplier(), plug: [120000, 170000, 210000, 280000][index] * this.multiplier() })));
  protected readonly rows = [
    { name: 'Amara Njoya', initials: 'AN', email: 'amara@example.com', app: 'Premifly', activity: 'Netflix renewal', amount: 4500, status: 'Completed', day: 1 },
    { name: 'Kevin Fotso', initials: 'KF', email: 'kevin@example.com', app: 'Plug', activity: 'Calculus tutorial', amount: 2500, status: 'Completed', day: 2 },
    { name: 'Sarah Mbah', initials: 'SM', email: 'sarah@example.com', app: 'Premifly', activity: 'Spotify subscription', amount: 2000, status: 'Pending', day: 3 },
    { name: 'Daniel Ewane', initials: 'DE', email: 'daniel@example.com', app: 'Plug', activity: 'Physics tutorial', amount: 3000, status: 'Completed', day: 4 },
    { name: 'Grace Tchoumi', initials: 'GT', email: 'grace@example.com', app: 'Premifly', activity: 'ChatGPT subscription', amount: 6500, status: 'Failed', day: 6 },
    { name: 'Brian Nkeng', initials: 'BN', email: 'brian@example.com', app: 'Premifly', activity: 'YouTube renewal', amount: 3000, status: 'Completed', day: 8 },
    { name: 'Laura Simo', initials: 'LS', email: 'laura@example.com', app: 'Plug', activity: 'Chemistry tutorial', amount: 2000, status: 'Pending', day: 12 },
    { name: 'Eric Fongang', initials: 'EF', email: 'eric@example.com', app: 'Premifly', activity: 'Canva subscription', amount: 3500, status: 'Completed', day: 18 },
  ];
  protected readonly filteredRows = computed(() => this.rows.filter(row =>
    (this.app() === 'All apps' || row.app === this.app()) && row.day <= this.period() &&
    `${row.name} ${row.email} ${row.activity} ${row.status}`.toLowerCase().includes(this.query().toLowerCase()),
  ));
  protected readonly tasks = [
    { title: '12 accounts nearing expiry', detail: 'Review credentials before the next renewal.', route: '/app/premifly/accounts', label: 'Review accounts', icon: 'icon-[material-symbols--schedule-outline]' },
    { title: '8 subscriptions to review', detail: 'Check pending subscriptions and payment details.', route: '/app/premifly/subscriptions', label: 'View subscriptions', icon: 'icon-[material-symbols--receipt-long-outline]' },
    { title: '4 services need a capacity check', detail: 'Keep premium access available to your members.', route: '/app/premifly/services', label: 'Manage services', icon: 'icon-[material-symbols--tune]' },
  ];
  protected exportReport() {
    const escape = (value: unknown) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [['Customer', 'App', 'Activity', 'Amount (XAF)', 'Status'], ...this.filteredRows().map(row => [row.name, row.app, row.activity, row.amount, row.status])].map(row => row.map(escape).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stundz-demo-activity.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
