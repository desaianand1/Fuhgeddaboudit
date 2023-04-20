import replacements from "./replacements.json";
const authorityNounPhrases: string[] = replacements.authorityNounPhrases;
const toolNounPhrases: string[] = replacements.toolNounPhrases;
const pluralNounPhrases: string[] = replacements.pluralNounPhrases;
const possessivePhrases: string[] = authorityNounPhrases.map((str) =>
  str.concat("'s")
);

//keywords are always lowercase and checks against this map should have the predicate converted to lowercase.
const keywordMap = new Map<string, string[]>([
  ["ai", toolNounPhrases],
  ["artificialintelligence", toolNounPhrases],
  ["chatbot", toolNounPhrases],
  ["autogpt", toolNounPhrases],
  ["chatbots", possessivePhrases],
  ["openai", authorityNounPhrases],
  ["openais", possessivePhrases],
  ["chatgpts", possessivePhrases],
  ["gpts", possessivePhrases],
  ["chatgpt", authorityNounPhrases],
  ["gpt3", toolNounPhrases],
  ["gpt3s", possessivePhrases],
  ["gpt4", toolNounPhrases],
  ["gpt4s", possessivePhrases],
  ["gpt", toolNounPhrases],
  ["llm", toolNounPhrases],
  ["llms", pluralNounPhrases],
  ["rl", toolNounPhrases],
  ["ml", toolNounPhrases],
]);

const keyPhrasesMap = new Map<string, string[]>([
  ["open ai", authorityNounPhrases],
  ["open ais", possessivePhrases],
  ["auto gpt", toolNounPhrases],
  ["gpt 3", toolNounPhrases],
  ["gpt 4", toolNounPhrases],
  ["chat gpt", authorityNounPhrases],
  ["chat bot", toolNounPhrases],
  ["artificial intelligence", toolNounPhrases],
  ["large language model", toolNounPhrases],
  ["large language models", pluralNounPhrases],
  ["reinforcement learning", toolNounPhrases],
  ["deep learning", toolNounPhrases],
  ["machine learning", toolNounPhrases],
]);
const fallbackReplacement: string = "Sarah Palin";

function getReplacementPhrase(word: string, isWord: boolean): string {
  const phrase = isWord ? keywordMap.get(word) : keyPhrasesMap.get(word);
  if (phrase === undefined) {
    return fallbackReplacement;
  }
  const index = Math.floor(Math.random() * phrase.length);
  return phrase[index] ?? fallbackReplacement;
}

export { keywordMap, keyPhrasesMap, getReplacementPhrase };
