import { findAndReplaceMatches } from "./replacer";

const moCallback: MutationCallback = (mutations: MutationRecord[]) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          findAndReplaceMatches(element);
        }
      }
    }
  }
};

const observer = new MutationObserver(moCallback);

function onPageLoad() {
  // 1. On page load, get possible text elements. Match and replace their keywords/phrases.
  findAndReplaceMatches(document.body);
  // 2. For infinite scrolling pages, where data and DOM elements are added as you scroll, allow the mutation observer to find new text elements and run the match-replace on them
  const config: MutationObserverInit = { childList: true, subtree: true };
  observer.observe(document.body, config);
}

function onPageUnload() {
  observer.disconnect();
}
window.onload = onPageLoad;
window.onunload = onPageUnload;
onPageLoad();
