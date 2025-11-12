import { ResolveFn } from '@angular/router';

export const sessionResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
