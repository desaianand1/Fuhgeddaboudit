import { getSavedState, saveState } from "./storage";
import { setBadgeDefaultColor, setBadgeText } from "./badge";
import {
  executeRegisteredScript,
  handleContentScriptRegistration,
} from "./cs_registration";
export interface ToggleStateMessage {
  isToggled: boolean;
}

const csId: string = "keyword-replacer";

async function init(): Promise<void> {
  console.log("service-worker started up!");
  await setBadgeDefaultColor();
  let savedToggleState = await getSavedState();
  await toggleStateUpdate(savedToggleState);
}

async function onMessageReceived(
  message: ToggleStateMessage,
  sender: chrome.runtime.MessageSender
) {
  if (sender.id !== undefined && sender.id === chrome.runtime.id) {
    console.log("service-worker received message from popup");
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

async function onTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  // if (tab.active && tab.url) {
  //   await executeRegisteredScript(csId, tabId);
  // }
}

chrome.runtime.onMessage.addListener(onMessageReceived);
chrome.tabs.onUpdated.addListener(onTabUpdated);
init();
