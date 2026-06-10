/** URL для картинки: uploads, /images/... или внешняя ссылка. */
export function resolveAssetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path.replace(/^\//, "")}`;
}
