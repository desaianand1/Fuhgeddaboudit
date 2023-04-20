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

async function handleContentScriptRegistration(
  csId: string,
  isToggled: boolean
) {
  const isRegistered = await isCSAlreadyRegistered(csId);
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
      .catch((err) =>
        console.error(`Error registering content script id ${csId}`, err)
      );
  } else if (!isToggled && isRegistered) {
    return await chrome.scripting
      .unregisterContentScripts({ ids: [csId] })
      .catch((err) =>
        console.error(`Error un-registering content script id ${csId}`, err)
      );
  }
}

export { handleContentScriptRegistration };
