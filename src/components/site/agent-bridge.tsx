"use client";

import { useEffect } from "react";
import {
  createAgent,
  registerTools,
  type AgentAction,
} from "@ui-sdk/react/agent";

function allow({ component, action, label, confirm }: AgentAction) {
  if (confirm !== undefined) return false;
  switch (component) {
    case "button":
      return (
        action === "press" &&
        [
          "Continue",
          "Back",
          "Get in touch",
          "QR Code",
          "Toggle light and dark theme",
        ].includes(label ?? "")
      );
    case "input":
    case "textarea":
      return action === "setValue" || action === "clear";
    case "radio":
      return action === "setValue";
    case "checkbox":
      return action === "setChecked";
    case "dialog":
    case "popover":
      return action === "setOpen";
    case "accordion":
      return ["setValue", "open", "close", "toggle"].includes(action);
    default:
      return false;
  }
}

const agent =
  typeof window === "undefined" ? undefined : createAgent({ allow });

export function AgentBridge() {
  useEffect(() => {
    if (agent) return registerTools(agent, { allow });
  }, []);
  return null;
}
