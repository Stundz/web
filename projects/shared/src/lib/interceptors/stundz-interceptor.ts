import { isPlatformServer } from "@angular/common";
import {
	HttpClient,
	type HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { catchError, EMPTY, switchMap, tap, timer } from "rxjs";
import { HTTP_SKIP_ON_SERVER } from "../contexts";
import { Cookie } from "../services";
import { ENVIRONMENT } from "../types";

export const stundzInterceptor: HttpInterceptorFn = (req, next) => {
	const platformId = inject(PLATFORM_ID);
	const isServer = isPlatformServer(platformId);

	if (req.context.get(HTTP_SKIP_ON_SERVER) === true && isServer) {
		return EMPTY;
	}

	return next(req);
};
