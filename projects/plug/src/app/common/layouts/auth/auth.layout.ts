import { Component, DestroyRef, inject, input } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterOutlet,
} from "@angular/router";
import { filter, firstValueFrom, map, of, switchMap, timer } from "rxjs";
import type { User as UserModel } from "shared/models";
import { Auth } from "shared/services";

@Component({
  selector: "plug-auth-layout",
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatBadgeModule,
    MatProgressBarModule,
  ],
  templateUrl: "./auth.layout.ng.html",
  styleUrl: "./auth.layout.scss",
})
export class AuthLayout {
  user = input.required<UserModel | undefined>();

  #authService = inject(Auth);
  private _router = inject(Router);

  loading = toSignal(
    this._router.events.pipe(
      filter(
        (event) =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof NavigationCancel ||
          event instanceof ResolveStart ||
          event instanceof ResolveEnd,
      ),
      switchMap((event) => {
        if (event instanceof NavigationStart || event instanceof ResolveStart) {
          return of(true);
        }

        return timer(300).pipe(map(() => false));
      }),
    ),
  );
}
