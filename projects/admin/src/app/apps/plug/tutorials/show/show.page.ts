import { CurrencyPipe, DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { type PlugTutorialRecord, paperPlace, personName } from '../../plug.models';

@Component({
  selector: 'admin-plug-tutorial',
  imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './show.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', '../../records.css', './show.page.css'],
})
export class ShowPage {
  readonly tutorialId = input.required<string>({ alias: 'tutorial' });
  readonly tutorial = httpResource<PlugTutorialRecord>(
    () => `${environment.url.api}/plug/tutorial/${this.tutorialId()}`,
  );

  tutorName = personName;
  place = paperPlace;
}
