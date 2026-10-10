import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-index',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './index.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../apps.page.css', './index.page.css'],
})
export class IndexPage {
  readonly apps = [
    { name: 'Premifly', icon: 'icon-[material-symbols--workspace-premium-outline]', url: '/app/premifly', description: 'Manage premium access, shared accounts, and the services your members subscribe to.', features: ['Users', 'Accounts', 'Services', 'Subscriptions'], available: true },
    { name: 'Plug', icon: 'icon-[material-symbols--school-outline]', url: '/app/plug', description: 'Your workspace for tutorials, tutors, and learning resources.', features: ['Tutorials', 'Tutors', 'Learning resources'], available: false },
  ];
}
