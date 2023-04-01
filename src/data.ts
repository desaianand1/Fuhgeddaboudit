const nounPhrases: string[] = ["my itchy bum", "cute kitten", "horny capybara"];
const pluralNounPhrases : string[] = nounPhrases.map(word => word.concat('s'));
const possessivePhrases: string[] = ["my cat's", "large inflateable duck's"];
//keywords are always lowercase and checks against this map should have the predicate converted to lowercase.
const keywordMap = new Map<string, string[]>([
  ["ai", nounPhrases],
  ["openai", nounPhrases],
  ["openai's", possessivePhrases],
  ["chatgpt's", possessivePhrases],
  ["gpt's", possessivePhrases],
  ["chatgpt", nounPhrases],
  ["gpt-3", nounPhrases],
  ["gpt-4", nounPhrases],
  ["gpt", nounPhrases],
  ["llm", nounPhrases],
  ["llms", pluralNounPhrases],
  ["rl", nounPhrases],
  ["ml", nounPhrases],
  
]);

const keyPhrasesMap = new Map<string, string[]>([
  ["open ai", nounPhrases],
  ["gpt 3", nounPhrases],
  ["gpt 4", nounPhrases],
  ["chat gpt", nounPhrases],
  ["artificial intelligence", nounPhrases],
  ["large language model", nounPhrases],
  ["large language models", pluralNounPhrases],
  ["reinforcement learning", nounPhrases],
  ["machine learning", nounPhrases],
]);
const fallbackReplacement: string = "my itchy bum";

function getReplacementPhrase(word: string, isWord: boolean): string {
  const phrase = isWord ? keywordMap.get(word) : keyPhrasesMap.get(word);
  if (phrase === undefined) {
    return fallbackReplacement;
  }
  const index = Math.floor(Math.random() * phrase.length);
  return phrase[index] ?? fallbackReplacement;
}

export { keywordMap, getReplacementPhrase };
