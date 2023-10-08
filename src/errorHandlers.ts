export function handleClientError(err, req, res, next): void {
  next(err)
}
