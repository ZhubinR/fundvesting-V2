export class HttpError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string, message?: string) {
    super(message ?? `Request to ${url} failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}
