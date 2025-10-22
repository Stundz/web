import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { stundzInterceptor } from './stundz-interceptor';
import { ENVIRONMENT } from '../types';
import { of } from 'rxjs';

describe('stundzInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => stundzInterceptor(req, next));

  const next: HttpHandler = {
    handle: (req: HttpRequest<any>) => {
      return of({} as HttpEvent<any>);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: { domain: 'stundz.localhost' }
        },
        {
          provide: HttpXsrfTokenExtractor,
          useValue: { getToken: () => 'test-token' }
        }
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add withCredentials for GET request to app domain', () => {
    const req = new HttpRequest('GET', 'http://stundz.localhost/api/test');
    const nextSpy = spyOn(next, 'handle').and.callThrough();
    interceptor(req, next.handle);
    const clonedReq = nextSpy.calls.mostRecent().args[0];
    expect(clonedReq.withCredentials).toBe(true);
  });

  it('should fetch CSRF token and add headers for non-GET request to app domain', (done) => {
    const req = new HttpRequest('POST', 'http://stundz.localhost/api/test');
    spyOn(httpClient, 'get').and.returnValue(of(null));
    const nextSpy = spyOn(next, 'handle').and.callThrough();

    interceptor(req, next.handle).subscribe(() => {
      const clonedReq = nextSpy.calls.mostRecent().args[0];
      expect(clonedReq.withCredentials).toBe(true);
      expect(clonedReq.headers.get('X-XSRF-TOKEN')).toBe('test-token');
      done();
    });
  });

  it('should fetch CSRF token and add headers for GET request to API domain', (done) => {
    const req = new HttpRequest('GET', 'https://api.stundz.localhost/api/test');
    spyOn(httpClient, 'get').and.returnValue(of(null));
    const nextSpy = spyOn(next, 'handle').and.callThrough();

    interceptor(req, next.handle).subscribe(() => {
      const clonedReq = nextSpy.calls.mostRecent().args[0];
      expect(clonedReq.withCredentials).toBe(true);
      expect(clonedReq.headers.get('X-XSRF-TOKEN')).toBe('test-token');
      done();
    });
  });

  it('should not add withCredentials for other domains', () => {
    const req = new HttpRequest('GET', 'http://other.com/api/test');
    const nextSpy = spyOn(next, 'handle').and.callThrough();
    interceptor(req, next.handle);
    const clonedReq = nextSpy.calls.mostRecent().args[0];
    expect(clonedReq.withCredentials).toBe(false);
  });
});