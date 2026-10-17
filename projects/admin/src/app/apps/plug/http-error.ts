import { HttpErrorResponse } from '@angular/common/http';

export function errorText(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;

  const body = error.error;
  if (typeof body === 'string' && body.trim()) return body;
  if (!body || typeof body !== 'object') return fallback;

  const errors = (body as { errors?: unknown }).errors;
  if (errors && typeof errors === 'object') {
    const messages = Object.values(errors)
      .flat()
      .filter((item): item is string => typeof item === 'string');
    if (messages.length) return messages.join(' ');
  }

  const message = (body as { message?: unknown }).message;
  if (typeof message === 'string' && message.trim()) return message;
  return fallback;
}
