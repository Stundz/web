import { isPlatformServer } from "@angular/common";
import {
	HttpClient,
	HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { HTTP_SKIP_ON_SERVER } from "../contexts";
import { EMPTY, switchMap, tap, timer } from "rxjs";
import { ENVIRONMENT } from "../types";
import { Cookie } from "../services";

export const stundzInterceptor: HttpInterceptorFn = (req, next) => {
	const platformId = inject(PLATFORM_ID);
	const isServer = isPlatformServer(platformId);
	const environment = inject(ENVIRONMENT);
	const cookies = inject(Cookie);
	const http = inject(HttpClient);
	const xsrfTokenExtractor = inject(HttpXsrfTokenExtractor);
	const isApiRequest = new RegExp(`^https?://api.${environment.domain}`).test(
		req.url,
	);

	if (req.context.get(HTTP_SKIP_ON_SERVER) === true && isServer) {
		return EMPTY;
	}

	if (!/\/csrf$/.test(req.url) && isServer) {
		return EMPTY;
	}

	if (isApiRequest && !/\/csrf$/.test(req.url)) {
		const token = xsrfTokenExtractor.getToken();
		console.log("Intercepting API", req.url);

		if (token) {
			return next(
				req.clone({
					setHeaders: { "X-XSRF-TOKEN": token },
					withCredentials: true,
				}),
			);
		}

		return http
			.get<void>(`https://api.${environment.domain}/csrf`, {
				withCredentials: true,
			})
			.pipe(
				switchMap(() =>
					next(
						req.clone({
							withCredentials: true,
							setHeaders: {
								"X-XSRF-TOKEN": String(xsrfTokenExtractor.getToken()),
							},
						}),
					),
				),
			);
	}

	return next(req);
};
