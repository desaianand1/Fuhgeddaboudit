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

export { handleContentScriptRegistration, isCSAlreadyRegistered };
