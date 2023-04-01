import { getReplacementPhrase, keyPhrasesMap, keywordMap } from "./data";

function onPageLoaded(){
    const possibleNodes = document.body.querySelectorAll(
        "*:not(script):not(noscript):not(style)"
      );
    possibleNodes.forEach((node) => {
        [...node.childNodes].filter(isTextNode).forEach(replaceMatchedText);
      });
}

function isTextNode(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE;
}

function replaceMatchedText(textNode: ChildNode) {
  const parentEl = textNode.parentElement;

  if (textNode.textContent !== null && parentEl !== null) {
    let sentence = textNode.textContent;
    parentEl.classList.add("text-fade-out");

    // 1. Check if keyword map contains individual words
    const words = sentence.split(" ");
    words?.forEach((word) => {
      const wordLowerCase = word.toLowerCase();
      if (keywordMap.has(wordLowerCase)) {
        textNode.textContent = textNode.textContent!!.replaceAll(
          word,
          getReplacementPhrase(wordLowerCase, true)
        );
      }
    });
    sentence = sentence.toLowerCase();
    // 2. Check if sentence contains keyphrases.
    Object.keys(keyPhrasesMap).forEach((phrase) => {
      if (sentence.includes(phrase) && parentEl !== null) {
        const caseSensitivePhraseIdx = sentence.indexOf(phrase);
        const caseSensitivePhrase = textNode.textContent?.slice(
          caseSensitivePhraseIdx,
          caseSensitivePhraseIdx + phrase.length
        );

        textNode.textContent = textNode.textContent!!.replaceAll(
          caseSensitivePhrase!!,
          getReplacementPhrase(phrase, false)
        );
      }
    });
    parentEl.classList.remove("text-fade-out");
    parentEl.classList.add("text-fade-in");
  }
}

window.onload = onPageLoaded;

