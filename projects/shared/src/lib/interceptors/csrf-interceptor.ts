import { isPlatformServer } from "@angular/common";
import {
	HttpBackend,
	HttpClient,
	HttpHeaders,
	type HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";
import { switchMap, tap } from "rxjs";
import { ENVIRONMENT } from "../types";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenService = inject(HttpXsrfTokenExtractor);
	const environment = inject(ENVIRONMENT);
	const platformId = inject(PLATFORM_ID);
	const serverReq = inject(REQUEST, { optional: true });
	const http = new HttpClient(inject(HttpBackend));

	const isApiRequest = req.url.startsWith(`${environment.url.api}`);
	const isServerSideRequest = isPlatformServer(platformId);
	const skipCsrfCheck = ["/user"].includes(
		req.url.replace(environment.url.api, ""),
	);

	if (!isApiRequest) {
		return next(req);
	}

	let token: string | null;
	let headers: { [k: string]: string | Array<string> } = {};

	// console.log(
	// 	isServerSideRequest ? "[SERVER]" : "[Client]",
	// 	serverReq ? "[REQUEST]" : "[Null]",
	// 	"for",
	// 	req.url,
	// );

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

	if (!token && !skipCsrfCheck) {
		return http
			.get(`${environment.url.api}/csrf`, {
				withCredentials: !isServerSideRequest,
				observe: "response",
			})
			.pipe(
				switchMap((response) => {
					headers["x-xsrf-token"] = serverReq
						? ""
						: tokenService.getToken() || "";

					headers["cookie"] = (response.headers.getAll("set-cookie") || []).map(
						(c) => c.split(";")[0].trim(),
					);

					if (!headers["x-xsrf-token"]) {
						for (const c of headers["cookie"]) {
							const match = c.match(/^XSRF-TOKEN=([^;]+)/);
							if (match) headers["x-xsrf-token"] = decodeURIComponent(match[1]);
						}
					}

					return next(
						req.clone({
							setHeaders: headers,
							withCredentials: !isServerSideRequest,
						}),
					);
				}),
			);
	}

	headers["X-XSRF-TOKEN"] = String(token);

	return next(
		req.clone({
			setHeaders: headers,
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
