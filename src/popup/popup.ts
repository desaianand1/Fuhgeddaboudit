import { setHeadline } from "./headline";
{
  const toggleSwitch: HTMLInputElement = <HTMLInputElement>(
    document.querySelector("input#toggle-switch[type=checkbox]")
  );
  if (toggleSwitch === null) {
    console.error(
      "No input element with id #toggle-switch found in popup.html !"
    );
  } else {
    init(toggleSwitch);
  }
}

async function init(toggleSwitch: HTMLInputElement): Promise<void> {
  let savedToggleState = await getSavedState();
  if (savedToggleState === undefined) {
    const toggleStateFromHTML = toggleSwitch.checked;
    savedToggleState = toggleStateFromHTML;
    await saveState(toggleStateFromHTML);
  }
  setHeadline(savedToggleState);
  handleContentScriptRegistration(savedToggleState);
  toggleSwitch.checked = savedToggleState;
  toggleSwitch.addEventListener("change", onToggle);
}

function onToggle(event: Event) {
  const toggleSwitch = <HTMLInputElement>event.target;
  const toggleState = toggleSwitch.checked;
  setHeadline(toggleState);
  saveState(toggleState);
  handleContentScriptRegistration(toggleState);
}

async function getSavedState(): Promise<boolean | undefined> {
  return chrome.storage.local.get("isToggled").then((snapshot) => {
    return snapshot.isToggled;
  });
}
async function saveState(isToggled: boolean): Promise<void> {
  return chrome.storage.local.set({ isToggled: isToggled });
}

async function isCSAlreadyRegistered(id: string): Promise<boolean> {
  return chrome.scripting
    .getRegisteredContentScripts({ ids: [id] })
    .then((registeredCSArr) => {
      const arr = registeredCSArr.filter((cs) => {
        return cs.id === id;
      });
      if (arr.length > 1) {
        console.error(`Duplicate content scripts registered with id: ${id} !`);
      }
      return arr.length === 1;
    });
}

async function handleContentScriptRegistration(isToggled: boolean) {
  const csId = "keyword-replacer";
  const isRegistered = await isCSAlreadyRegistered(csId);

  if (isToggled && !isRegistered) {
    await chrome.scripting
      .registerContentScripts([
        {
          id: csId,
          js: ["main.js"],
          css: ["css/index.css"],
          matches: ["https://*/*", "http://*/*"],
        },
      ])
      .catch((err) =>
        console.error(`Error registering content script id ${csId}`, err)
      );
  } else if (!isToggled && isRegistered) {
    await chrome.scripting
      .unregisterContentScripts({ ids: [csId] })
      .catch((err) =>
        console.error(`Error un-registering content script id ${csId}`, err)
      );
  }
}
