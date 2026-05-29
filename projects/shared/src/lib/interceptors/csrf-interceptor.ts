import { isPlatformServer } from "@angular/common";
import {
	HttpBackend,
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	type HttpInterceptorFn,
	HttpRequest,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";
import { catchError, switchMap, tap, throwError } from "rxjs";
import { ENVIRONMENT } from "../types";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenService = inject(HttpXsrfTokenExtractor);
	const environment = inject(ENVIRONMENT);
	const platformId = inject(PLATFORM_ID);
	const serverReq = inject(REQUEST, { optional: true });
	const http = new HttpClient(inject(HttpBackend));

	const isApiRequest = req.url.startsWith(`${environment.url.api}`);
	const isServerSideRequest = isPlatformServer(platformId);
	const skipCsrfCheck = ["/user", "/login", "/signup"].includes(
		req.url.replace(environment.url.api, ""),
	);

	if (!isApiRequest) {
		return next(req);
	}

	let token: string | null = null;
	let headers: { [k: string]: string | Array<string> } = {};

	console.log(
		isServerSideRequest ? "[SERVER]" : "[Client]",
		serverReq ? "[REQUEST]" : "[Null]",
		"for",
		req.url,
	);

	if (isServerSideRequest) {
		if (serverReq) {
			token = getToken(serverReq);
			headers = extractSafeHeaders(
				Object.fromEntries(serverReq.headers.entries() || []),
			);
		} else {
			token = null;
			headers = extractSafeHeaders(
				Object.fromEntries((req.headers as any).headers?.entries() || []),
			);
		}
	} else {
		token = tokenService.getToken();
		headers = Object.fromEntries((req.headers as any).headers.entries());
	}

	if (token) {
		headers["X-XSRF-TOKEN"] = token;
		headers["x-xsrf-token"] = token;
	}

	const hasXsrfCookie = (): boolean => {
		if (isServerSideRequest) {
			if (serverReq) {
				const cookie = serverReq.headers?.get("cookie") || "";
				return cookie.includes("XSRF-TOKEN=");
			}
			const cookie = req.headers.get("cookie") || "";
			return cookie.includes("XSRF-TOKEN=");
		}
		return document.cookie.includes("XSRF-TOKEN=");
	};

	const fetchCsrfToken = () => {
		return http
			.get(`${environment.url.api}/csrf`, {
				withCredentials: !isServerSideRequest,
				observe: "response",
			})
			.pipe(
				tap((response) => {
					const cookies = (response.headers.getAll("set-cookie") || []).map(
						(c) => c.split(";")[0].trim(),
					);
					if (cookies.length > 0) {
						headers["cookie"] = cookies;
					}

					let xsrfToken = "";
					if (!isServerSideRequest) {
						xsrfToken = tokenService.getToken() || "";
					}

					if (!xsrfToken) {
						for (const c of cookies) {
							const match = c.match(/^XSRF-TOKEN=([^;]+)/);
							if (match) xsrfToken = decodeURIComponent(match[1]);
						}
					}

					if (xsrfToken) {
						headers["x-xsrf-token"] = xsrfToken;
						headers["X-XSRF-TOKEN"] = xsrfToken;
					}
				}),
			);
	};

	const executeRequest = (clonedReq: HttpRequest<any>) => {
		return next(clonedReq).pipe(
			catchError((error) => {
				if (
					error instanceof HttpErrorResponse &&
					error.status === 419 &&
					!skipCsrfCheck
				) {
					console.log("CSRF expired (419), fetching new token...");
					return fetchCsrfToken().pipe(
						switchMap(() => {
							const retryReq = req.clone({
								setHeaders: headers,
								withCredentials: true,
							});
							return next(retryReq);
						}),
					);
				}
				return throwError(() => error);
			}),
		);
	};

	const isCookieMissing = !hasXsrfCookie();

	if (isCookieMissing && !skipCsrfCheck) {
		return fetchCsrfToken().pipe(
			switchMap(() => {
				const clonedReq = req.clone({
					setHeaders: headers,
					withCredentials: true,
				});
				return executeRequest(clonedReq);
			}),
		);
	}

	const clonedReq = req.clone({
		setHeaders: headers,
		withCredentials: true,
	});
	return executeRequest(clonedReq);
};

const getToken = (request: Request | null) => {
	if (!request) {
		return null;
	}

	const cookie = request.headers?.get("cookie") || "";
	const match = cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
};

const extractSafeHeaders = (
	object: Record<string, string | Array<string>> | HttpHeaders,
) => {
	let h: Record<string, string | Array<string>>;

	if (object instanceof HttpHeaders) {
		h = Object.fromEntries((object as any).headers?.entries() || []);
	} else {
		h = object;
	}

	// console.log("Raw headers", h);

	const safeHeaders = ["cookie", "referer", "x-xsrf-token"];
	const headers: { [k: string]: string | Array<string> } = {};

	for (const [key, value] of Object.entries(h)) {
		if (safeHeaders.includes(key)) {
			headers[key] = value;
		}
	}

	return headers;
};
