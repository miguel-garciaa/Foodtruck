let favoriteHelpSeen = false;
export async function readFavoriteHelp() {
  return favoriteHelpSeen;
}
export async function rememberFavoriteHelp() {
  favoriteHelpSeen = true;
}
