interface ToggleStateMessage {
  isToggled: boolean;
}
async function init(): Promise<void> {
  console.log("service-worker started up!");
  const initialToggleState = true; //default to true on first install/run
  let savedToggleState = await getSavedState();
  // savedToggleState is undefined on first extension run/install since storage would be empty.
  if (savedToggleState === undefined) {
    savedToggleState = initialToggleState;    
    await saveState(savedToggleState);
  }
  const msg : ToggleStateMessage = {isToggled: savedToggleState};
  chrome.runtime.sendMessage(msg);
}


async function onMessageReceived(
  message: ToggleStateMessage,
  sender: chrome.runtime.MessageSender
) {
  console.log("service-worker received message from sender: " + sender);
  await saveState(message.isToggled);
  handleContentScriptRegistration(message.isToggled);

}

function onTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab:chrome.tabs.Tab){
  if(tab.active){
    console.log(`active tab is ${tabId}`);
  }else{
    console.log(`${tabId} updated for some other reason...`);
  }
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
      arr.length === 1 ? console.log(`${id} content script already registered!`) : console.log(`${id} content script NOT registered!`);
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
      .then(()=> console.log(`Registered ${csId} content script`))
      .catch((err) =>
        console.error(`Error registering content script id ${csId}`, err)
      );
  } else if (!isToggled && isRegistered) {
    await chrome.scripting
      .unregisterContentScripts({ ids: [csId] })
      .then(()=> console.log(`Un-registered ${csId} content script`))
      .catch((err) =>
        console.error(`Error un-registering content script id ${csId}`, err)
      );
  }
}

chrome.runtime.onMessage.addListener(onMessageReceived);
chrome.tabs.onUpdated.addListener(onTabUpdated);
init();