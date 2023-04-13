async function setBadgeText(isToggled: boolean) {
  const badgeText = isToggled ? "ON" : "";
  await chrome.action.setBadgeText({ text: badgeText });
}

async function setBadgeDefaultColor() {
  await chrome.action.setBadgeBackgroundColor({ color: "#0040F0" });
}

export {setBadgeText, setBadgeDefaultColor}