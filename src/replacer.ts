import { getReplacementPhrase, keyPhrasesMap, keywordMap } from "./phrase_data";

function replaceMatchedTextWithAnimation(
  shouldAnimateParentElement: boolean
): (textNode: Text, index: number, textNodes: Text[]) => void {
  return (textNode) => replaceMatchedText(textNode, shouldAnimateParentElement);
}

function replaceMatchedText(
  textNode: Text,
  shouldAnimateParentElement: boolean
) {
  let parentElement = null;
  if (shouldAnimateParentElement) {
    parentElement = textNode.parentElement;
  }

  if (textNode.textContent !== null) {
    let sentence = textNode.textContent;
    parentElement?.classList.add("text-fade-out");
    // 1. Check if keyword map contains individual words
    matchReplaceKeywords(sentence, textNode);
    sentence = sentence.toLowerCase();
    // 2. Check if sentence contains keyphrases.
    matchReplaceKeyPhrases(sentence, textNode);
    parentElement?.classList.remove("text-fade-out");
    parentElement?.classList.add("text-fade-in");
  }
}

function matchReplaceKeywords(sentence: string, textNode: ChildNode) {
  const words = sentence.split(" ");
  words?.forEach((word) => {
    const wordNoSpecialChars = word.replace(/[^\w\s]/gi, "");
    const lowerCaseWord = wordNoSpecialChars.toLowerCase();
    if (keywordMap.has(lowerCaseWord)) {
      textNode.textContent = textNode.textContent!!.replaceAll(
        word,
        getReplacementPhrase(lowerCaseWord, true)
      );
    }
  });
}

function matchReplaceKeyPhrases(sentence: string, textNode: ChildNode) {
  Object.keys(keyPhrasesMap).forEach((phrase) => {
    if (sentence.includes(phrase)) {
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
}

// Get all text nodes, excluding script, style, and noscript elements
function getTextNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (
        node.parentNode &&
        (node.parentNode.nodeName === "SCRIPT" ||
          node.parentNode.nodeName === "STYLE" ||
          node.parentNode.nodeName === "NOSCRIPT")
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }
  return textNodes;
}

function findAndReplaceMatches(root: HTMLElement, shouldAnimateParentElement : boolean = false): void {
  const textNodes = getTextNodes(root);
  textNodes.forEach(replaceMatchedTextWithAnimation(shouldAnimateParentElement));
}

export { findAndReplaceMatches };
