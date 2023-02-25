import badwords from "../utils/words.json";

export function isBadWord(word: string) : boolean {
  return badwords.includes(word);
}