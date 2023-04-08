import headlinePhrases from "./headline-phrases.json";

const headlineContainer: HTMLDivElement = <HTMLDivElement>(
  document.querySelector("div#headline-container")
);

const headlineTemplate: HTMLTemplateElement = <HTMLTemplateElement>(
  document.querySelector("template#headline")
);
interface ToggledOffPhrase {
  text: string | null;
  webp: string;
  gif: string;
  alt: {
    emoji: string;
    width: string;
    height: string;
  };
}

interface ToggledOnPhrase extends ToggledOffPhrase {
  highlighted: string;
}

const toggledOffPhrases: ToggledOffPhrase[] = headlinePhrases["toggled-off"];
const toggledOnPhrases: ToggledOnPhrase[] = headlinePhrases["toggled-on"];

function getToggledOnPhrase(): ToggledOnPhrase {
  const idx = Math.floor(Math.random() * toggledOnPhrases.length);
  return toggledOnPhrases[idx]!!;
}

function getToggledOffPhrase(): ToggledOffPhrase {
  const idx = Math.floor(Math.random() * toggledOffPhrases.length);
  return toggledOffPhrases[idx]!!;
}

function createHeadline(isToggled: boolean): void {
  const template = headlineTemplate.content.cloneNode(true) as HTMLElement;
  const picSrc = template.querySelector(
    "picture.emoji>source"
  ) as HTMLSourceElement;
  const picImg = template.querySelector(
    "picture.emoji>img"
  ) as HTMLImageElement;
  const headlineSpan = template.querySelector(
    "span#headline-text"
  ) as HTMLSpanElement;
  if (isToggled) {
    const emphasizedSpan = document.createElement("span");
    const phrase = getToggledOnPhrase();
    emphasizedSpan.classList.add("emphasized-text");
    emphasizedSpan.textContent = phrase.highlighted;

    headlineSpan.appendChild(emphasizedSpan);
    headlineSpan.append(phrase.text ?? "");
    picSrc.srcset = phrase.webp;
    picImg.src = phrase.gif;
    picImg.alt = phrase.alt.emoji;
    picImg.style.width = phrase.alt.width;
    picImg.style.height = phrase.alt.height;
  } else {
    const phrase = getToggledOffPhrase();
    headlineSpan?.classList.add("deemphasized-text");
    headlineSpan.textContent = phrase.text;
    picSrc.srcset = phrase.webp;
    picImg.src = phrase.gif;
    picImg.alt = phrase.alt.emoji;
    picImg.style.width = phrase.alt.width;
    picImg.style.height = phrase.alt.height;
  }
  headlineContainer.appendChild(template);
}

function setHeadline(isToggled: boolean): void {
  const headlineSpan = headlineContainer.querySelector("span#headline-text");
  if (headlineSpan === null) {
    createHeadline(isToggled);
  } else {
    const picSrc = headlineContainer.querySelector(
      "picture.emoji>source"
    ) as HTMLSourceElement;
    const picImg = headlineContainer.querySelector(
      "picture.emoji>img"
    ) as HTMLImageElement;
    if (isToggled) {
      const phrase = getToggledOnPhrase();

      headlineSpan.classList.remove("deemphasized-text");
      const emphasizedSpan = document.createElement("span");
      emphasizedSpan.classList.add("emphasized-text");
      emphasizedSpan.textContent = phrase.highlighted;
      headlineSpan.textContent = "";
      headlineSpan.appendChild(emphasizedSpan);
      headlineSpan.append(phrase.text ?? "");
      picSrc.srcset = phrase.webp;
      picImg.src = phrase.gif;
      picImg.alt = phrase.alt.emoji;
      picImg.style.width = phrase.alt.width;
      picImg.style.height = phrase.alt.height;
    } else {
      const phrase = getToggledOffPhrase();
      headlineSpan.classList.add("deemphasized-text");
      const emphasizedSpan = headlineSpan.querySelector("span.emphasized-text");
      if (emphasizedSpan !== null) {
        headlineSpan.removeChild(emphasizedSpan);
      }
      headlineSpan.textContent = phrase.text;
      picSrc.srcset = phrase.webp;
      picImg.src = phrase.gif;
      picImg.alt = phrase.alt.emoji;
      picImg.style.width = phrase.alt.width;
      picImg.style.height = phrase.alt.height;
    }
  }
}
export { setHeadline };
