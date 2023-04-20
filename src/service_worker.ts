import { getSavedState, saveState } from "./storage";
import { setBadgeDefaultColor, setBadgeText } from "./badge";
import { handleContentScriptRegistration } from "./cs_registration";
export interface ToggleStateMessage {
  isToggled: boolean;
}

const csId: string = "keyword-replacer";

async function init(): Promise<void> {
  await setBadgeDefaultColor();
  let savedToggleState = await getSavedState();
  await toggleStateUpdate(savedToggleState);
}

async function onMessageReceived(
  message: ToggleStateMessage,
  sender: chrome.runtime.MessageSender
) {
  if (sender.id !== undefined && sender.id === chrome.runtime.id) {
    await saveState(message.isToggled);
    await toggleStateUpdate(message.isToggled);
  }
}

async function toggleStateUpdate(isToggled: boolean) {
  return Promise.all([
    handleContentScriptRegistration(csId, isToggled),
    setBadgeText(isToggled),
  ]);
}

chrome.runtime.onMessage.addListener(onMessageReceived);
init();
