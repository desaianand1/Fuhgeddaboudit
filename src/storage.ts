interface StorageState {
  isToggled: boolean;
}

async function _getState(): Promise<boolean | undefined> {
  return chrome.storage.local.get("isToggled").then((snapshot) => {
    const _snap = <StorageState>snapshot;
    console.log(`returning save state snapshot: ${_snap.isToggled}`);
    return _snap.isToggled;
  });
}
async function saveState(isToggled: boolean): Promise<void> {
  console.log(`saving state as ${isToggled}`);
  const state: StorageState = { isToggled: isToggled };
  return chrome.storage.local.set(state);
}

async function getSavedState(): Promise<boolean> {
  const initialToggleState = true; //default to true on first install/run
  let savedToggleState = await _getState();
  // savedToggleState is undefined on first extension run/install since storage would be empty.
  if (savedToggleState === undefined) {
    console.log(`initial state is undefined, settings default state to ${initialToggleState}`)
    savedToggleState = initialToggleState;
    await saveState(savedToggleState);
  }
  return savedToggleState;
}

export { saveState, getSavedState };
