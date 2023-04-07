import { setHeadline } from "./headline";

{
  const toggleSwitch: HTMLInputElement = <HTMLInputElement>(
    document.querySelector("input#toggle-switch[type=checkbox]")
  );
  if (toggleSwitch === null) {
    console.error(
      "No input element with id #toggle-switch found in popup.html !"
    );
  } else {
    setHeadline(toggleSwitch.checked);
    toggleSwitch.addEventListener("change", onToggle);
  }
}

function onToggle(event: Event) {
  const toggleSwitch = <HTMLInputElement>event.target;
  setHeadline(toggleSwitch.checked);
}
