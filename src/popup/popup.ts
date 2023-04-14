import { setHeadline } from "./headline";
import { ToggleStateMessage } from "../service_worker";
import { getSavedState } from "../storage";

async function disableSwitchDecorator(
  fn: (toggleSwitch: HTMLInputElement) => Promise<void>,
  arg: HTMLInputElement
) {
  arg.disabled = true;
  await fn(arg);
  arg.disabled = false;
}

async function setSavedState(toggleSwitch: HTMLInputElement) {
  let savedToggleState = await getSavedState();
  toggleSwitch.checked = savedToggleState;
  setHeadline(savedToggleState);
}

async function init(): Promise<void> {
  console.log("popup initialized");
  const toggleSwitch: HTMLInputElement = <HTMLInputElement>(
    document.querySelector("input#toggle-switch[type=checkbox]")
  );
  if (toggleSwitch === null) {
    console.error(
      "No input element with id #toggle-switch found in popup.html !"
    );
  } else {
    toggleSwitch.addEventListener("change", onToggle);
    disableSwitchDecorator(setSavedState, toggleSwitch);
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
