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

async function handleContentScriptRegistration(
  csId: string,
  isToggled: boolean
) {
  const isRegistered = await isCSAlreadyRegistered(csId);
  console.log("deciding cs registration");
  if (isToggled && !isRegistered) {
    return await chrome.scripting
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
    return await chrome.scripting
      .unregisterContentScripts({ ids: [csId] })
      .then(() => console.log(`Un-registered ${csId} content script`))
      .catch((err) =>
        console.error(`Error un-registering content script id ${csId}`, err)
      );
  }
}

async function executeRegisteredScript(csId: string, tabId: number) {
  const isRegistered = await isCSAlreadyRegistered(csId);
  console.log("deciding cs registration");
  if (isRegistered) {
    const executeScriptPromise = chrome.scripting
      .executeScript({
        files: ["main.js"],
        injectImmediately: true,
        target: { tabId: tabId },
      })
      .then(() => console.log(`Executed content-script ${csId} !`))
      .catch((err) =>
        console.error(`Error executing content-script ${csId}`, err)
      );

    const insertCSSPromise = chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ["css/index.css"],
    });
    return await Promise.all([executeScriptPromise, insertCSSPromise]);
  } else {
    return;
  }
}

export { handleContentScriptRegistration, executeRegisteredScript };
