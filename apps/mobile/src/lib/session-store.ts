// Web preview has no persistent credentials; production web auth will use its own cookie flow.
let refresh: string | null = null;
export const readRefresh = async () => refresh;
export const writeRefresh = async (token: string) => {
  refresh = token;
};
export const deleteRefresh = async () => {
  refresh = null;
};
