import { getSavedState, saveState } from "./storage";
import { setBadgeDefaultColor, setBadgeText } from "./badge";
interface ToggleStateMessage {
  isToggled: boolean;
}

async function init(): Promise<void> {
  console.log("service-worker started up!");
  await setBadgeDefaultColor();
  const initialToggleState = true; //default to true on first install/run
  let savedToggleState = await getSavedState();
  // savedToggleState is undefined on first extension run/install since storage would be empty.
  if (savedToggleState === undefined) {
    savedToggleState = initialToggleState;
    await saveState(savedToggleState);
  }
  const msg: ToggleStateMessage = { isToggled: savedToggleState };
  const activeTabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (activeTabs.length !== 1) {
    console.error(
      `No active tab available or multiple active tabs encountered! Unable to init popup/content-script.`
    );
  }
  const activeTab = activeTabs[0]!!;
  if (activeTab.id === undefined) {
    console.error(
      `active tab has no ID (undefined)! Unable to init popup/content-script.`
    );
  } else {
    console.log("Attempting tabs send message");
    chrome.tabs.sendMessage(activeTab.id, msg);
    await setBadgeText(msg.isToggled);
    console.log("Sent message..");
  }
}

async function onMessageReceived(
  message: ToggleStateMessage,
  sender: chrome.runtime.MessageSender
) {
  console.log("service-worker received message from sender: " + sender);
  await saveState(message.isToggled);
  handleContentScriptRegistration(message.isToggled);
}

function onTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (tab.active) {
    console.log(`active tab is ${tabId}`);
  } else {
    console.log(`${tabId} updated for some other reason...`);
  }
}

async function isCSAlreadyRegistered(id: string): Promise<boolean> {
  console.log("is cs registered?");
  return chrome.scripting
    .getRegisteredContentScripts({ ids: [id] })
    .then((registeredCSArr) => {
      const arr = registeredCSArr.filter((cs) => {
        return cs.id === id;
      });
      if (arr.length > 1) {
        console.error(`Duplicate content scripts registered with id: ${id} !`);
      }
      arr.length === 1
        ? console.log(`${id} content script already registered!`)
        : console.log(`${id} content script NOT registered!`);
      return arr.length === 1;
    });
}

async function handleContentScriptRegistration(isToggled: boolean) {
  const csId = "keyword-replacer";
  const isRegistered = await isCSAlreadyRegistered(csId);
  console.log("deciding cs registration");
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
      .then(() => console.log(`Registered ${csId} content script`))
      .catch((err) =>
        console.error(`Error registering content script id ${csId}`, err)
      );
  } else if (!isToggled && isRegistered) {
    await chrome.scripting
      .unregisterContentScripts({ ids: [csId] })
      .then(() => console.log(`Un-registered ${csId} content script`))
      .catch((err) =>
        console.error(`Error un-registering content script id ${csId}`, err)
      );
  }
}

chrome.runtime.onMessage.addListener(onMessageReceived);
chrome.tabs.onUpdated.addListener(onTabUpdated);
init();
