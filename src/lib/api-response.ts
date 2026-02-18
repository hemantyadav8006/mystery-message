import { NextResponse } from "next/server";

interface SuccessResponseBody<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponseBody {
  success: false;
  message: string;
  errors?: string[];
}

type ResponseBody<T = unknown> = SuccessResponseBody<T> | ErrorResponseBody;

export function successResponse<T = unknown>(
  message: string,
  data?: T,
  status = 200
): NextResponse<ResponseBody<T>> {
  const body: SuccessResponseBody<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status = 500,
  errors?: string[]
): NextResponse<ResponseBody> {
  const body: ErrorResponseBody = { success: false, message };
  if (errors?.length) body.errors = errors;
  return NextResponse.json(body, { status });
}
