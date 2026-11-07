import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const visitKey = "hairnthere-cinema-visit-v3";
const day = 24 * 60 * 60 * 1000;
function compile(path) {
  return ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
}
const domain = { exports: {} };
vm.runInNewContext(compile("src/data/cinema.ts"), { exports: domain.exports });
const source = compile("src/components/scenic/cinema-visit.ts");

// Each context is a full document load. Browser storage survives; tab storage is
// isolated, and the React adapter captures the real store subscription/snapshots.
function browser() {
  const local = new Map();
  let now = 1_000_000;
  let blocked = false;
  function storage(map) {
    return {
      getItem(key) {
        if (blocked) throw Error("blocked");
        return map.get(key) ?? null;
      },
      setItem(key, value) {
        if (blocked) throw Error("blocked");
        map.set(key, value);
      },
    };
  }
  function load(tab = new Map(), sample = 0) {
    const events = new Map();
    let adapter;
    const document = { visibilityState: "visible" };
    const target = {
      addEventListener(name, fn) {
        events.set(name, fn);
      },
      removeEventListener(name) {
        events.delete(name);
      },
    };
    Object.assign(document, target);
    const context = {
      exports: {},
      require(name) {
        if (name === "react")
          return {
            useSyncExternalStore(...args) {
              adapter = args;
            },
          };
        if (name === "@/data/cinema") return domain.exports;
        throw Error(name);
      },
      Date: { now: () => now },
      localStorage: storage(local),
      sessionStorage: storage(tab),
      crypto: {
        getRandomValues(array) {
          array[0] = sample * 2 ** 32;
          return array;
        },
      },
      Uint32Array,
      window: target,
      document,
    };
    vm.runInNewContext(source, context);
    context.exports.useCinemaVisit();
    const [subscribe, snapshot, serverSnapshot] = adapter;
    const cleanup = subscribe(() => {});
    return {
      scene: snapshot,
      serverSnapshot,
      cleanup,
      events,
      resubscribe() {
        return subscribe(() => {});
      },
      emit(name, event = {}) {
        events.get(name)?.(event);
      },
      visibility(value) {
        document.visibilityState = value;
        events.get("visibilitychange")?.();
      },
    };
  }
  return {
    local,
    load,
    advance(ms) {
      now += ms;
    },
    block() {
      blocked = true;
    },
  };
}

test("clean visit and server/no-JS snapshot always show winter", () => {
  for (const sample of [0, 0.5, 0.999]) {
    const page = browser().load(undefined, sample);
    assert.equal(page.scene(), "powder-day");
    assert.equal(page.serverSnapshot(), "powder-day");
  }
});
test("repeated full loads never repeat the displayed scene", () => {
  const b = browser(),
    tab = new Map();
  let previous = b.load(tab).scene();
  for (let i = 0; i < 100; i++) {
    const current = b.load(tab, i / 100).scene();
    assert.notEqual(current, previous);
    previous = current;
  }
});
test("24-hour inactivity expires exactly at the boundary, then refresh varies", () => {
  const b = browser(),
    tab = new Map();
  b.load(tab);
  b.advance(day - 1);
  assert.notEqual(b.load(tab).scene(), "powder-day");
  b.advance(day);
  assert.equal(b.load(tab).scene(), "powder-day");
  assert.notEqual(b.load(tab).scene(), "powder-day");
});
test("activity renews TTL, hidden tabs do not, expired departure cannot renew it", () => {
  const b = browser(),
    tab = new Map();
  b.load(tab);
  const page = b.load(tab);
  b.advance(day - 1);
  page.emit("scroll");
  b.advance(day - 1);
  assert.notEqual(b.load(new Map()).scene(), page.scene());
  b.advance(day);
  page.visibility("hidden");
  page.emit("pagehide");
  assert.equal(b.load(tab).scene(), "powder-day");
});
test("another tab cannot overwrite the scene excluded by refresh", () => {
  const b = browser(),
    tab = new Map();
  b.load(tab);
  const previous = b.load(tab).scene();
  b.load(new Map());
  assert.notEqual(b.load(tab).scene(), previous);
});
test("back-forward restoration and returning after inactivity reset to winter", () => {
  const b = browser();
  b.load();
  const page = b.load();
  const previous = page.scene();
  page.emit("pageshow", { persisted: true });
  assert.equal(page.scene(), previous);
  b.advance(day);
  page.visibility("visible");
  assert.equal(page.scene(), "powder-day");
});
test("invalid, cleared, and blocked storage safely use winter", () => {
  const b = browser();
  for (const value of [
    "bad json",
    "{}",
    '{"variant":"unknown","activeAt":1000000}',
  ]) {
    b.local.set(visitKey, value);
    assert.equal(b.load().scene(), "powder-day");
  }
  b.local.clear();
  assert.equal(b.load().scene(), "powder-day");
  b.block();
  assert.equal(b.load().scene(), "powder-day");
});
test("resubscribing keeps client navigation stable and cleans up listeners", () => {
  const b = browser();
  const page = b.load();
  const before = b.local.get(visitKey);
  page.cleanup();
  const cleanup = page.resubscribe();
  assert.equal(page.scene(), "powder-day");
  assert.equal(b.local.get(visitKey), before);
  cleanup();
  assert.equal(page.events.size, 0);
});
