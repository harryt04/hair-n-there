import type { AgentAction } from "@ui-sdk/react/agent";

// Buttons outside a component an agent may press, by accessible name. The
// inquiry's final submit is deliberately absent and also carries
// data-agent-confirm, so it stays with the person.
export const pressableButtons: readonly string[] = [
  "Continue",
  "Back",
  "Get in touch",
  "QR Code",
  "Toggle light and dark theme",
  "Earlier days",
  "Later days",
];

// Reversible, local actions by UI SDK component kind. Anything not listed,
// including carousel autoplay, is refused.
export const allowedActions: Readonly<Record<string, readonly string[]>> = {
  input: ["setValue", "clear"],
  textarea: ["setValue", "clear"],
  radio: ["setValue"],
  checkbox: ["setChecked"],
  dialog: ["setOpen"],
  popover: ["setOpen"],
  accordion: ["setValue", "open", "close", "toggle"],
  calendar: ["setValue", "setMonth", "previous", "next"],
  toggle: ["setValue", "setPressed"],
  carousel: ["setPage", "next", "previous"],
};

export function allowAgentAction({
  component,
  action,
  label,
  confirm,
}: Pick<AgentAction, "component" | "action" | "label" | "confirm">) {
  if (confirm !== undefined) return false;
  if (component === "button")
    return action === "press" && pressableButtons.includes(label ?? "");
  return Object.hasOwn(allowedActions, component)
    ? allowedActions[component].includes(action)
    : false;
}
