// tabs.test.ts — onglets de chats du panneau 3D (DESIGN §11.1 V2.1).
import { describe, expect, it } from "vitest";
import type { ChatSummary } from "../contracts";
import {
  ADD_CHROME,
  LABEL_MAX,
  MIN_TAB_WIDTH,
  TAB_GAP,
  fitTabs,
  tabLabel,
  tabState,
  tabsOf,
} from "./tabs";

function chat(i: number, name = `chat-${i + 1}`, extra: Partial<ChatSummary> = {}): ChatSummary {
  return {
    index: i,
    name,
    model: null,
    sending: false,
    questionPending: false,
    promptTokens: 0,
    completionTokens: 0,
    ...extra,
  };
}

const CW = 7.2; // chasse du mono 12 px

describe("tabLabel", () => {
  it("nom du chat seul, coupé à 12 caractères", () => {
    expect(tabLabel("chat-1")).toBe("chat-1");
    const cut = tabLabel("chat-number-9-long");
    expect(cut.length).toBe(LABEL_MAX);
    expect(cut.endsWith("…")).toBe(true);
  });
});

describe("tabState", () => {
  it("question en attente > agent en cours > repos", () => {
    expect(tabState({ sending: true, questionPending: true })).toBe("asking");
    expect(tabState({ sending: true, questionPending: false })).toBe("running");
    expect(tabState({ sending: false, questionPending: false })).toBe("idle");
  });
});

describe("tabsOf", () => {
  it("un onglet par chat ouvert, l'actif marqué", () => {
    const tabs = tabsOf([chat(0), chat(1), chat(2)], 1);
    expect(tabs.map((t) => t.label)).toEqual(["chat-1", "chat-2", "chat-3"]);
    expect(tabs[1].active).toBe(true);
    expect(tabs[0].active).toBe(false);
  });
});

describe("fitTabs", () => {
  it("place suffisante : tout est montré, rien de caché", () => {
    const tabs = tabsOf([chat(0), chat(1), chat(2)], 1);
    const { shown, hidden } = fitTabs(tabs, 1200, CW);
    expect(shown.length).toBe(3);
    expect(hidden).toBe(0);
  });

  it("6 chats dans 360 px : onglets visibles, « +N » et « + » jamais coupés", () => {
    const tabs = tabsOf([0, 1, 2, 3, 4, 5].map((i) => chat(i)), 5);
    const panel = 360;
    const { shown, hidden } = fitTabs(tabs, panel, CW);
    expect(shown.length).toBeGreaterThan(0);
    expect(hidden).toBeGreaterThan(0);
    // Le « +N » et le « + » ont leur place : le budget n'est pas négatif.
    const used = shown.length * MIN_TAB_WIDTH + (shown.length - 1) * TAB_GAP;
    expect(used + ADD_CHROME + CW).toBeLessThanOrEqual(panel);
    // L'actif reste visible.
    expect(shown.some((t) => t.active)).toBe(true);
  });

  it("place très étroite : un onglet au moins, l'actif visible", () => {
    const tabs = tabsOf([chat(0), chat(1), chat(2)], 0);
    const { shown, hidden } = fitTabs(tabs, 80, CW);
    expect(shown.length).toBeGreaterThanOrEqual(1);
    expect(shown.some((t) => t.active)).toBe(true);
    expect(hidden).toBe(tabs.length - shown.length);
  });

  it("le nombre caché suit la place, pas un maximum fixe", () => {
    const tabs = tabsOf([0, 1, 2, 3, 4, 5].map((i) => chat(i)), 5);
    const large = fitTabs(tabs, 1200, CW);
    const small = fitTabs(tabs, 360, CW);
    expect(large.hidden).toBe(0);
    expect(small.hidden).toBeGreaterThan(large.hidden);
  });
});
