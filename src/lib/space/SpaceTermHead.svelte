<!-- SpaceTermHead.svelte — barre de titre du panneau de chat quand le fond 3D
     est actif (DESIGN §4, §11.1 V2.1) : trois points (le premier orange), une
     rangée d'onglets (un par chat ouvert, point d'état, puce « +N » selon la
     place réelle, bouton +), et ⌘K. Clic = changer de chat, clic milieu =
     fermer. Le libellé est le nom du chat seul ; les onglets se rétrécissent,
     le « + » et ⌘K ne sont jamais coupés. -->
<script lang="ts">
  import { onMount } from "svelte";
  import { activeIndex, chats, closeChat, newChat, selectChat } from "../chat/store";
  import { space } from "./store.svelte";
  import { fitTabs, tabsOf } from "./tabs";

  let tabsBox: HTMLDivElement | null = $state(null);
  let meter: HTMLSpanElement | null = $state(null);
  let width = $state(0);
  let charWidth = $state(7.2); // monospace 12 px, mesuré au montage (10 caractères).

  let all = $derived(tabsOf($chats, $activeIndex));
  let tabs = $derived(fitTabs(all, width, charWidth));

  onMount(() => {
    if (meter) {
      charWidth = meter.getBoundingClientRect().width / 10;
    }
    const box = tabsBox;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      width = box.getBoundingClientRect().width;
    });
    ro.observe(box);
    width = box.getBoundingClientRect().width;
    return () => ro.disconnect();
  });

  function pick(event: MouseEvent, index: number): void {
    if (event.button === 1) {
      event.preventDefault();
      void closeChat(index);
      return;
    }
    void selectChat(index);
  }
</script>

<div class="space-thead">
  <span class="dots" aria-hidden="true"><i class="on"></i><i></i><i></i></span>
  <div class="tabs" bind:this={tabsBox} role="tablist" aria-label="Chats ouverts">
    <span class="meter" bind:this={meter} aria-hidden="true">MMMMMMMMMM</span>
    {#each tabs.shown as tab (tab.key)}
      <button
        class="tab"
        class:active={tab.active}
        role="tab"
        aria-selected={tab.active}
        data-testid={`space-tab-${tab.key}`}
        onclick={(e) => pick(e, Number(tab.key.split(":")[0]))}
        onauxclick={(e) => e.button === 1 && pick(e, Number(tab.key.split(":")[0]))}
      >
        <i class="dot {tab.state}" aria-hidden="true"></i>{tab.label}
      </button>
    {/each}
    {#if tabs.hidden > 0}
      <span class="more" title="{tabs.hidden} autres chats">+{tabs.hidden}</span>
    {/if}
    <button class="tab add" onclick={() => void newChat()} title="Nouveau chat (Ctrl+N)">+</button>
  </div>
  <span class="kbd">⌘K</span>
</div>
