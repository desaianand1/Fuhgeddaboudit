import headlinePhrases from "./headline-phrases.json";

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

export function getHeadlinePhrase(isToggled: boolean): string {
  return "";
}
