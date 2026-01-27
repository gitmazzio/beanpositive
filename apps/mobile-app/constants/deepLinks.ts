export const ADD_HIT_URL = "beanpositive://addHit";

export const isAddHitUrl = (url: string | null): boolean =>
  url === ADD_HIT_URL || (url?.includes(ADD_HIT_URL) ?? false);
