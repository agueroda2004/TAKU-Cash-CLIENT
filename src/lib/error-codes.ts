export const ErrorCode = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  Internal: 500,
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

export function isApiErrorCode(err: unknown, code: ErrorCodeValue): boolean {
  if (!(err instanceof Error)) return false;
  const apiErr = err as ApiErrorLike;
  return apiErr.errorCode === code;
}

type ApiErrorLike = Error & { errorCode?: number | null };