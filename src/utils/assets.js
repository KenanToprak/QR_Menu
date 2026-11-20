/**
 * Resolves a public asset path against Vite's configured base URL.
 * Works safely in both Vite browser bundles and Node.js test environments.
 */
export function resolveAssetUrl(path, baseUrl) {
  if (typeof path !== 'string' || path.length === 0) {
    return '';
  }

  if (/^(https?:)?\/\/|^(data|blob):/i.test(path)) {
    return path;
  }

  const runtimeBase =
    baseUrl !== undefined
      ? baseUrl
      : (typeof import.meta !== 'undefined' &&
          import.meta.env &&
          import.meta.env.BASE_URL) ||
        '/';

  const safeBase = typeof runtimeBase === 'string' && runtimeBase.length > 0 ? runtimeBase : '/';
  const normalizedBase = safeBase.endsWith('/') ? safeBase : `${safeBase}/`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}
