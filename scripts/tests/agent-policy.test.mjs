import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allowAgentAction,
  allowedActions,
  pressableButtons,
} from "../../src/lib/agent-policy.ts";

const step = (component, action, extra = {}) => ({
  ref: "c1",
  component,
  action,
  args: [],
  ...extra,
});

test("unknown components and actions are refused", () => {
  assert.equal(allowAgentAction(step("menu", "setValue")), false);
  assert.equal(allowAgentAction(step("select", "setValue")), false);
  assert.equal(allowAgentAction(step("input", "submit")), false);
  assert.equal(allowAgentAction(step("toString", "call")), false);
  assert.equal(allowAgentAction(step("constructor", "setValue")), false);
});

test("a confirmation mark always waits for the person", () => {
  for (const [component, actions] of Object.entries(allowedActions))
    for (const action of actions)
      assert.equal(
        allowAgentAction(step(component, action, { confirm: "Sends it" })),
        false,
        `${component}.${action} with confirm`,
      );
  assert.equal(
    allowAgentAction(
      step("button", "press", { label: "Continue", confirm: "Sends it" }),
    ),
    false,
  );
});

test("the final inquiry submission is never pressable", () => {
  for (const label of [
    "Send my inquiry",
    "Request this time",
    "Submit",
    undefined,
  ])
    assert.equal(allowAgentAction(step("button", "press", { label })), false);
  assert.ok(
    !pressableButtons.some((label) => /send|submit|request/i.test(label)),
  );
});

test("named navigation buttons may be pressed, nothing else", () => {
  for (const label of pressableButtons)
    assert.equal(allowAgentAction(step("button", "press", { label })), true);
  assert.equal(
    allowAgentAction(step("button", "setValue", { label: "Continue" })),
    false,
  );
  assert.equal(
    allowAgentAction(step("button", "press", { label: "continue" })),
    false,
  );
});

test("reversible edits on form and scheduling controls are allowed", () => {
  for (const [component, action] of [
    ["input", "setValue"],
    ["textarea", "clear"],
    ["radio", "setValue"],
    ["checkbox", "setChecked"],
    ["popover", "setOpen"],
    ["dialog", "setOpen"],
    ["accordion", "toggle"],
    ["calendar", "setValue"],
    ["calendar", "next"],
    ["toggle", "setValue"],
    ["carousel", "next"],
  ])
    assert.equal(allowAgentAction(step(component, action)), true);
});

test("carousel autoplay stays off for agents", () => {
  for (const action of ["play", "setPlaying", "pause"])
    assert.equal(allowAgentAction(step("carousel", action)), false);
});
