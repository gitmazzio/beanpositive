/**
 * Intercetta i deep link prima che Expo Router navighi.
 * beanpositive://addHit viene interpretato come path "/addHit", che non esiste
 * e porta a +not-found. Qui reindirizziamo a una rotta valida.
 * La logica (login vs tabs, pending addHit) resta in RootDeepLinkHandler.
 */
const ADD_HIT_PATH = "/addHit";

const isAddHitPath = (path: string | null): boolean =>
  path === ADD_HIT_PATH ||
  path === "addHit" ||
  (path?.toLowerCase().includes("addhit") ?? false);

export function redirectSystemPath(options: {
  path: string | null;
  initial: boolean;
}): string {
  try {
    const { path, initial } = options;
    if (!initial || !path) return path ?? "/";

    if (isAddHitPath(path)) {
      return "/(not_authenticated)/login";
    }

    return path;
  } catch {
    return "/(not_authenticated)/login";
  }
}
