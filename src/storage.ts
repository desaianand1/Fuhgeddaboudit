interface StorageState {
  isToggled: boolean;
}

async function _getState(): Promise<boolean | undefined> {
  return chrome.storage.local.get("isToggled").then((snapshot) => {
    const _snap = <StorageState>snapshot;
    return _snap.isToggled;
  });
}
async function saveState(isToggled: boolean): Promise<void> {
  const state: StorageState = { isToggled: isToggled };
  return chrome.storage.local.set(state);
}

async function getSavedState(): Promise<boolean> {
  const initialToggleState = true; //default to true on first install/run
  let savedToggleState = await _getState();
  // savedToggleState is undefined on first extension run/install since storage would be empty.
  if (savedToggleState === undefined) {
    savedToggleState = initialToggleState;
    await saveState(savedToggleState);
  }
  return savedToggleState;
}

export { saveState, getSavedState };
