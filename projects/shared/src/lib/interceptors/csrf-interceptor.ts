import { isPlatformServer } from "@angular/common";
import {
	HttpBackend,
	HttpClient,
	HttpHeaders,
	type HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";
import { switchMap } from "rxjs";
import { ENVIRONMENT } from "../types";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenService = inject(HttpXsrfTokenExtractor);
	const environment = inject(ENVIRONMENT);
	const handler = inject(HttpBackend);
	const platformId = inject(PLATFORM_ID);
	const serverReq = inject(REQUEST, { optional: true });
	const http = new HttpClient(handler);

	const isApiRequest =
		req.url.startsWith(`https://api.${environment.domain}`) ||
		req.url.startsWith(`http://api.${environment.domain}`);
	const isServerSideRequest = isPlatformServer(platformId);

	if (!isApiRequest) {
		return next(req);
	}

	if (serverReq) {
		console.log("Request available");
	} else {
		console.log("REQUST is missing");
	}

	let token: string | null = "";
	let headers = req.headers;
	let cookie: string | Array<string> = isServerSideRequest
		? String(serverReq?.headers?.get("cookie"))
		: "";

	if (isServerSideRequest) {
		token = getToken(serverReq);
		cookie = String(serverReq?.headers.get("cookie"));
	} else {
		token = tokenService.getToken();
	}

	if (!token) {
		const csrfHeaders: Record<string, string> = {};
		if (cookie) {
			csrfHeaders["cookie"] = String(cookie);
		}

		return http
			.get(`api.${environment.domain}/csrf`, {
				headers: csrfHeaders,
				withCredentials: true,
				observe: "response",
			})
			.pipe(
				switchMap((response) => {
					let newToken = "";
					cookie = response.headers?.has("set-cookie")
						? response.headers.getAll("set-cookie")!
						: [];

					for (const c of cookie) {
						const match = c.match(/^XSRF-TOKEN=([^;]+)/);

						if (match) {
							newToken = decodeURIComponent(match[1]);
						}
					}
					headers = headers.set("X-XSRF-TOKEN", newToken).set("cookie", cookie);

					return next(
						req.clone({
							headers,
							withCredentials: true,
						}),
					);
				}),
			);
	}

	if (token) {
		headers = headers.set("X-XSRF-TOKEN", token).set("cookie", cookie);
	}

	return next(
		req.clone({
			headers,
			withCredentials: true,
		}),
	);
};

const getToken = (request: Request | null) => {
	if (!request) {
		return null;
	}

	const cookie = request.headers?.get("cookie") || "";
	const match = cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
};
