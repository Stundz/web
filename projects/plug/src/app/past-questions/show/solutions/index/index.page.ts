import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import type { Plug } from 'shared/models';

@Component({
  imports: [MatButtonModule, RouterLink],
  selector: 'plug-solutions-index',
  styleUrl: './index.page.scss',
  templateUrl: './index.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPage {
  question = input.required<Plug.PastQuestion>({ alias: 'past-question' });

  protected readonly examples = [
    {
      title: 'Step-by-step worked solutions',
      description: 'Follow the reasoning behind each answer, with clear explanations and intermediate steps.',
      type: 'Worked solutions',
      icon: 'icon-[material-symbols--menu-book-outline]',
      details: ['Detailed explanations', 'Question-by-question format'],
    },
    {
      title: 'Annotated answer guide',
      description: 'Review the key ideas, formulas, and methods you need to approach the paper confidently.',
      type: 'Answer guide',
      icon: 'icon-[material-symbols--description-outline]',
      details: ['Key concepts', 'Revision-friendly notes'],
    },
  ];
}
