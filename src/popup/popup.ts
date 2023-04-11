import { setHeadline } from "./headline";

function onMessageReceived(
  message: ToggleStateMessage,
  sender: chrome.runtime.MessageSender
) {
  console.log("popup received message from sender: " + sender);
  const toggleSwitch: HTMLInputElement = <HTMLInputElement>(
    document.querySelector("input#toggle-switch[type=checkbox]")
  );
  if (toggleSwitch.disabled) {
    toggleSwitch.disabled = false;
  }

  toggleSwitch.checked = message.isToggled;
  setHeadline(message.isToggled);
}

function init(): void {
  const toggleSwitch: HTMLInputElement = <HTMLInputElement>(
    document.querySelector("input#toggle-switch[type=checkbox]")
  );
  if (toggleSwitch === null) {
    console.error(
      "No input element with id #toggle-switch found in popup.html !"
    );
  } else {
    chrome.runtime.onMessage.addListener(onMessageReceived);
    // disable the toggle-switch initially. Re-enable when a message from service-worker is received regarding saved toggleState
    toggleSwitch.disabled = true;
    toggleSwitch.addEventListener("change", onToggle);
  }
}

function onToggle(event: Event) {
  const toggleSwitch = <HTMLInputElement>event.target;
  const toggleState = toggleSwitch.checked;
  setHeadline(toggleState);
  const msg: ToggleStateMessage = { isToggled: toggleState };
  chrome.runtime.sendMessage(msg);
}

init();
