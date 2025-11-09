import { effect, inject, Injectable, signal } from "@angular/core";
import { StundzHttp } from "shared";

@Injectable()
export class Session {
	private http = inject(StundzHttp);
	private _sessions = signal<any[]>([]);
	sessions = this._sessions.asReadonly();
	private _session = signal<any | null>(null);
	session = this._session.asReadonly();

	constructor() {
		effect(() => {
			console.log("Sessions", this.sessions());
		});
	}

	getSessions(tutorial: string) {
		return this.http.get<any[]>(`tutorials/${tutorial}/sessions`);
	}

	getSession(tutorial: string, session: string) {
		return this.http.get<any>(`tutorials/${tutorial}/sessions/${session}`);
	}
}
