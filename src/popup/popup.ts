const toggleSwitch: HTMLInputElement = <HTMLInputElement>(
  document.querySelector("input#toggle-switch[type=checkbox]")
);
const headlineText: HTMLSpanElement = <HTMLSpanElement>(
  document.querySelector("span#headline-text")
);

if (toggleSwitch === null) {
  console.error("No input with id #toggle-switch found in popup.html !");
} else {
  setHeadlineText(toggleSwitch.checked);
  toggleSwitch.addEventListener("change", onToggle);
}

function onToggle(event: Event) {
  const toggleSwitch = <HTMLInputElement>event.target;

  setHeadlineText(toggleSwitch.checked);
}

function setHeadlineText(isToggled: boolean): void {
  isToggled
    ? (headlineText.textContent = "ON")
    : (headlineText.textContent = "OFF");
}
