import { isPlatformServer } from "@angular/common";
import { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { HTTP_SKIP_ON_SERVER } from "../contexts";
import { EMPTY } from "rxjs";

export const stundzInterceptor: HttpInterceptorFn = (req, next) => {
	const platformId = inject(PLATFORM_ID);
	const isServer = isPlatformServer(platformId);

	if (req.context.get(HTTP_SKIP_ON_SERVER) === true && isServer) {
		return EMPTY;
	}

	return next(req);
};
