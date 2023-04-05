import { getReplacementPhrase, keyPhrasesMap, keywordMap } from "./data";

function isTextNode(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE;
}

function replaceMatchedTextClosure(
  element: Element
): (value: ChildNode, index: number) => void {
  return (textNode, index) => {
    replaceMatchedText(textNode, index, element);
  };
}

function replaceMatchedText(
  textNode: ChildNode,
  index: number,
  parentElement: Element
) {
  const textElement = parentElement.children[index];
  if (textNode.textContent !== null) {
    let sentence = textNode.textContent;
    textElement?.classList.add("text-fade-out");

    // 1. Check if keyword map contains individual words
    const words = sentence.split(" ");
    words?.forEach((word) => {
      const wordNoSpecialChars = word.replace(/[^\w\s]/gi, "");
      const lowerCaseWord = wordNoSpecialChars.toLowerCase();
      if (keywordMap.has(lowerCaseWord)) {
        console.log(textNode.textContent);
        textNode.textContent = textNode.textContent!!.replaceAll(
          word,
          getReplacementPhrase(lowerCaseWord, true)
        );
      }
    });
    sentence = sentence.toLowerCase();
    // 2. Check if sentence contains keyphrases.
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

    textElement?.classList.remove("text-fade-out");
    textElement?.classList.add("text-fade-in");
  }
}

function onPageLoaded() {
  const possibleElements = document.body.querySelectorAll(
    "*:not(script):not(noscript):not(style)"
  );
  possibleElements.forEach((element: Element) => {
    [...element.childNodes]
      .filter(isTextNode)
      .forEach(replaceMatchedTextClosure(element));
  });
}

window.onload = onPageLoaded;
