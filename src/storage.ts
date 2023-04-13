interface StorageState {
  isToggled: boolean;
}

async function getSavedState(): Promise<boolean | undefined> {
  return chrome.storage.local.get("isToggled").then((snapshot) => {
    const _snap = <StorageState>snapshot;
    console.log("returning save state snapshot");
    return _snap.isToggled;
  });
}
async function saveState(isToggled: boolean): Promise<void> {
  console.log("saving state ...");
  const state: StorageState = { isToggled: isToggled };
  return chrome.storage.local.set(state);
}

export { saveState, getSavedState };
