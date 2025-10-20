import { HttpParams } from "@angular/common/http";
import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { from, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ENVIRONMENT } from "shared";

@Component({
	selector: "app-guest",
	imports: [RouterLink, RouterOutlet, MatButtonModule, RouterLinkWithHref],
	templateUrl: "./guest.layout.ng.html",
	styleUrl: "./guest.layout.scss",
})
export class GuestLayout {
	protected readonly environment = inject(ENVIRONMENT);
	encoder = new TextEncoder();
	code = "stundz";
	sha256 = toSignal(
		from(
			crypto.subtle.digest(
				"SHA-256",
				this.encoder.encode("".padEnd(128, "asdf")),
			),
		).pipe(
			map((hashBuffer) => Array.from(new Uint8Array(hashBuffer))),
			map((value) =>
				value.map((b) => b.toString(16).padStart(2, "0")).join(""),
			),
		),
		{
			initialValue: "",
		},
	);

	params = computed(() =>
		new HttpParams()
			.set("client_id", "0199ac84-ccc4-71ed-b11b-e00a6cfb569c")
			.set("redirect_uri", `http://plug.${environment.domain}/auth/callback`)
			.set("response_type", "code")
			.set("scope", "*")
			.set("state", "".padEnd(40, "asdf"))
			.set("code_challenge", this.sha256())
			.set("code_challenge_method", "S256"),
	);

	login = computed(
		() =>
			`http://${environment.domain}/oauth/authorize?${this.params().toString()}`,
	);
}
