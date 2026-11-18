// tabs.ts — onglets de chats du panneau 3D (DESIGN §11.1 V2.1), purs et testés.
// Le fil unique « projet / chat » devient une rangée d'onglets : un par chat
// ouvert, point d'état (orange = agent actif, blanc = repos, rouge = question
// en attente). Le libellé est le nom du chat seul (le projet est déjà montré
// par la scène), coupé à 12 caractères. Le nombre d'onglets affichés dépend
// de la place réelle (ResizeObserver), pas d'un maximum fixe : ce qui ne
// tient pas passe derrière la puce « +N ».
import type { ChatSummary } from "../contracts";

export type TabState = "running" | "asking" | "idle";

export interface ChatTab {
  key: string;
  label: string;
  state: TabState;
  active: boolean;
}

/// Longueur maximale d'un libellé d'onglet (ellipse en fin).
export const LABEL_MAX = 12;

/// Largeur fixe d'un onglet, hors texte (pastille + marge + bordure).
export const TAB_CHROME = 37;
/// Écart entre deux onglets.
export const TAB_GAP = 6;
/// Marge interne de la puce « +N » (hors chiffres).
export const MORE_CHROME = 16;
/// Marge interne du bouton « + » (hors glyphe).
export const ADD_CHROME = 18;
/// Largeur minimale d'un onglet quand le CSS le rétrécit (pastille + ~4
/// caractères : en dessous, le libellé devient illisible).
export const MIN_TAB_WIDTH = 66;

/// Libellé = nom du chat seul, coupé à `LABEL_MAX` caractères (ellipse).
export function tabLabel(chat: string): string {
  return chat.length > LABEL_MAX ? `${chat.slice(0, LABEL_MAX - 1)}…` : chat;
}

/// État d'un onglet : la question prime sur l'agent en cours.
export function tabState(summary: Pick<ChatSummary, "sending" | "questionPending">): TabState {
  if (summary.questionPending) return "asking";
  return summary.sending ? "running" : "idle";
}

/// Onglets à montrer : un par chat ouvert, l'actif toujours visible.
export function tabsOf(chats: ChatSummary[], activeIndex: number): ChatTab[] {
  return chats.map((c) => ({
    key: `${c.index}:${c.name}`,
    label: tabLabel(c.name),
    state: tabState(c),
    active: c.index === activeIndex,
  }));
}

/// Largeur préférée d'un onglet (px) pour un chasse de `charWidth` px.
export function tabWidth(label: string, charWidth: number): number {
  return TAB_CHROME + label.length * charWidth;
}

/// Ce qui tient dans `available` px : les onglets à gauche (dans l'ordre) et
/// le nombre de chats cachés derrière la puce « +N ».
///
/// Tant que tous les onglets tiennent, même au minimum lisible, ils sont
/// tous montrés (le CSS rétrécit ceux qui dépassent, avec ellipse). Dès que
/// la place manque, les plus anciens passent derrière « +N » — le nombre
/// dépend donc de la place, pas d'un maximum fixe.
export function fitTabs(
  tabs: ChatTab[],
  available: number,
  charWidth: number,
): { shown: ChatTab[]; hidden: number } {
  if (tabs.length === 0) return { shown: [], hidden: 0 };
  const budget = Math.max(0, available - (ADD_CHROME + charWidth) - TAB_GAP);
  const minWidth = (n: number): number => n * MIN_TAB_WIDTH + (n - 1) * TAB_GAP;
  let shown = tabs;
  for (;;) {
    const hidden = tabs.length - shown.length;
    const more = hidden > 0 ? MORE_CHROME + String(hidden).length * charWidth : 0;
    const needed = minWidth(shown.length) + more + (hidden > 0 ? TAB_GAP : 0);
    if (needed <= budget || shown.length <= 1) break;
    // Le plus ancien passe derrière « +N » (les récents restent visibles).
    shown = shown.slice(1);
  }
  // L'onglet actif reste visible : il prend la place du plus ancien shown.
  const active = tabs.find((t) => t.active);
  if (active && !shown.some((t) => t.active)) {
    shown = [...shown.slice(0, shown.length - 1), active];
  }
  return { shown, hidden: tabs.length - shown.length };
}
