import type { HttpInterceptorFn } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { browserInterceptor } from "./browser-interceptor";

describe("csrfInterceptor", () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => browserInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });
});
