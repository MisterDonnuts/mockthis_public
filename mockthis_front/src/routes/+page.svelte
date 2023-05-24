<script lang="ts">
  import { afterUpdate, onMount, beforeUpdate } from "svelte/internal";
  import { theme } from "../stores/darkmode";

  const endpoint = "https://api.mockthis.app";

  //textareas
  let mockText = "";
  let jsonText = "";

  let customInterfaces = false;
  let customNotes = false;
  let interfaces = "";
  let examples = "1";
  let reversed = false;
  let animationTime = "10s";
  let darkMode = false;

  let credit = 100;

  let result = "";
  let notes = "";

  let root: HTMLDivElement;
  let loader: HTMLSpanElement;
  let secondLoader: HTMLSpanElement;
  let mockSubmit: HTMLButtonElement;
  let jsonSubmit: HTMLButtonElement;
  let darkModeButton: HTMLButtonElement;

  let loading = false;

  let icons = {};

  theme.subscribe((value) => {
    if (value === "light") {
      darkMode = false;
    } else {
      darkMode = true;
    }
  });

  onMount(() => {});

  beforeUpdate(() => {});
  afterUpdate(() => {
    handleIcons();
    animationTime = String(10 * parseInt(examples)) + "s";
    controlForm();
  });

  function handleIcons() {
    let iconElements = root.querySelectorAll("[icon]");
    iconElements.forEach((iconElement) => {
      if (!iconElement.querySelector("svg")) {
        let iconName = iconElement.getAttribute("icon");
        if (iconName && icons[iconName]) {
          iconElement.innerHTML = icons[iconName];
        } else {
          fetch(`/${iconName}.svg`)
            .then((res) => res.text())
            .then((svg) => {
              icons[iconName] = svg;
              iconElement.innerHTML = svg;
            });
        }
      }
    });
  }

  function darkModeHandler() {
    darkModeButton.innerHTML = "";
    if (darkMode) {
      darkMode = false;
      theme.update((value) => "light");
    } else {
      darkMode = true;
      theme.update((value) => "dark");
    }
  }

  function twitter() {
    window.open("https://twitter.com/MisterDonnuts");
  }

  function misterD() {
    window.open("https://misterd.dev");
  }

  function github() {
    window.open("https://github.com/MisterDonnuts");
  }

  function handleClick() {
    fetchChat();
  }

  function switchPanels() {
    if (!reversed) {
      reversed = true;
    } else {
      reversed = false;
    }
  }

  async function fetchChat() {
    loading = true;
    mockSubmit.setAttribute("disabled", "true");
    animationTime = String(6 * parseInt(examples)) + "s";
    secondLoader.style.display = "inline-block";
    const res = await fetch(endpoint + "/receptor/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mockText,
        examples,
        interfaces: customInterfaces ? interfaces : "",
      }),
    });
    const json = await res.json();
    jsonText = String(json.data);
    mockSubmit.removeAttribute("disabled");
    secondLoader.style.display = "none";
    loading = false;
  }

  async function fetchJson() {
    loading = true;
    jsonSubmit.setAttribute("disabled", "true");
    animationTime = String(6 * parseInt(examples)) + "s";
    loader.style.display = "inline-block";
    const res = await fetch(endpoint + "/receptor/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonText,
        result,
        notes,
      }),
    });
    const jsonRes = await res.json();
    mockText = String(jsonRes.data);
    jsonSubmit.removeAttribute("disabled");
    loader.style.display = "none";
    loading = false;
  }

  function handleCopy() {
    if (!reversed) {
      navigator.clipboard.writeText(jsonText);
    } else {
      navigator.clipboard.writeText(mockText);
    }
  }

  function controlForm() {
    if (!loading && mockSubmit && mockText.length > 0) {
      console.log("asd");
      mockSubmit.removeAttribute("disabled");
    } else if (mockSubmit) {
      mockSubmit.setAttribute("disabled", "true");
    }
    if (!loading && jsonSubmit && jsonText.length > 0 && result.length > 0) {
      jsonSubmit.removeAttribute("disabled");
    } else if (jsonSubmit) {
      jsonSubmit.setAttribute("disabled", "true");
    }
  }
</script>

<div class="fullPage {darkMode ? 'darkMode' : ''}" bind:this={root}>
  <button
    class="darkmode"
    bind:this={darkModeButton}
    icon={!darkMode ? "moon" : "sun"}
    on:click={darkModeHandler}
  />
  <div
    class="page light {(customNotes && reversed) ||
    (customInterfaces && !reversed)
      ? 'growed'
      : ''}"
  >
    <div class="title">
      <h1>Mock<span>This</span></h1>
      <h3>Create mock data using GPT</h3>
    </div>
    <div class="social">
      <button class="icon" on:click={misterD}>
        MisterD.dev
        <div icon="misterd" />
      </button>
      <!-- <button class="icon" on:click={github}>
        Github
        <div icon="github" />
      </button> -->
      <button class="icon twitter" on:click={twitter}>
        Twitter
        <div icon="twitter" />
      </button>
    </div>
    <div class="form-container mockContainer {reversed ? 'reversed' : ''}">
      <h5>{!reversed ? "I want to mock this:" : "Result:"}</h5>
      <textarea
        bind:value={mockText}
        disabled={reversed}
        placeholder={!reversed
          ? "Insert here what you want to mock (can be classes, interfaces or just info)"
          : ""}
      />
      {#if !reversed}
        <h6>
          give me
          <select bind:value={examples} name="" id="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          examples
        </h6>
        {#if customInterfaces}
          <h5>Using this interfaces:</h5>
          <textarea
            bind:value={interfaces}
            placeholder="Your interfaces or nested classes go here"
          />
        {/if}
        <div class="buttonGroup">
          {#if !customInterfaces}
            <button on:click={() => (customInterfaces = true)}>
              Add interfaces
            </button>
          {/if}
          {#if customInterfaces}
            <button on:click={() => (customInterfaces = false)}>
              Remove interfaces
            </button>
          {/if}
          <button
            on:click={handleClick}
            bind:this={mockSubmit}
            disabled
            class="submit"
          >
            Submit
          </button>
        </div>
      {/if}
      {#if reversed}
        <span class="loader" bind:this={loader} style:--time={animationTime} />
        <button on:click={handleCopy} class="iconOnly">
          <div icon="copy" />
        </button>
      {/if}
    </div>

    <button class="iconOnly switchPanels" on:click={switchPanels}>
      <div icon="switch" />
    </button>

    <div class="form-container jsonContainer {reversed ? 'reversed' : ''}">
      <h5>{!reversed ? "JSON Result" : "Convert this JSON:"}</h5>
      <textarea
        bind:value={jsonText}
        disabled={!reversed}
        placeholder={reversed ? "Here is where your JSON goes" : ""}
      />
      <span class="loader" bind:this={loader} style:--time={animationTime} />
      {#if reversed}
        <h6>
          To <input
            type="text"
            placeholder="e.g. javascript class"
            bind:value={result}
          />
        </h6>
        {#if customNotes}
          <textarea
            rows="1"
            placeholder="e.g. use @getter decorator"
            bind:value={notes}
          />
        {/if}
        <div class="buttonGroup">
          {#if !customNotes}
            <button on:click={() => (customNotes = true)}> Add notes </button>
          {/if}
          {#if customNotes}
            <button on:click={() => (customNotes = false)}>
              Remove notes
            </button>
          {/if}
          <button
            on:click={fetchJson}
            bind:this={jsonSubmit}
            disabled
            class="submit"
          >
            Submit
          </button>
        </div>
      {/if}
      {#if !reversed}
        <span
          class="loader"
          bind:this={secondLoader}
          style:--time={animationTime}
        />
        <button on:click={handleCopy} class="iconOnly">
          <div icon="copy" />
        </button>
      {/if}
    </div>
    <div class="donation">
      <a href="https://www.buymeacoffee.com/Mister.D" target="_blank">
        Is Mockthis being useful to you? you can help to pay openAI's bill, so
        we can keep this free.
      </a>
    </div>
  </div>
</div>

<style lang="scss">
  $twitterColor: rgb(29, 155, 240);
  $white: rgb(245, 245, 247);
  $black: rgb(29, 29, 31);
  $accent: #3b82f6;
  $cardShadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  $buttonShadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  $inputbackground: rgba($black, 5%);
  $border: 1px solid rgba($black, 0.1);
  $text: $black;
  $textMiddle: rgba($text, 60%);
  $textContrast: $white;
  $backgroundColor: $white;
  $cardBackgroundColor: $white;

  $dark_text: $white;
  $dark_textMiddle: rgba($dark_text, 60%);
  $dark_backgroundcolor: $black;
  $dark_cardbackgroundcolor: lighten($black, 7%);
  $dark_inputbackground: rgba($white, 5%);
  $dark_border: 1px solid rgba($white, 0.5);
  $dark_cardshadow: none;
  $dark_buttonshadow: none;

  @mixin fullPage {
    font-family: "Roboto", sans-serif;
    overflow: hidden;
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: var(--backgroundColor);
    .darkmode {
      position: absolute;
      padding: 2em;
      top: 0;
      right: 0;
      background-color: transparent;
      border: none;
      color: var(--text);
    }
    .page {
      color: var(--text);
      * {
        font-family: "Roboto", sans-serif;
        box-sizing: border-box;
      }
      display: grid;
      grid-template-areas:
        "title empty social"
        "form1 switchPanels form2"
        "empty2 empty2 donation";
      width: 60vw;
      height: 60vh;
      gap: 1.5rem 2rem;
      grid-template-rows: max-content 1fr;
      grid-template-columns: 1fr 5% 1fr;
      transition: all 0.3s;
      &.growed {
        height: 80vh;
      }
      .title {
        grid-area: title;
        * {
          margin: 0;
        }
        h1 {
          span {
            color: var(--accent);
          }
        }
        h3 {
          color: var(--textMiddle);
        }
      }
      .donation {
        grid-area: donation;
        a {
          color: var(--text);
          font-size: 0.9rem;
        }
      }
      .social {
        grid-area: social;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        justify-content: end;
        align-items: end;
      }
      .switchPanels {
        grid-area: switchPanels;
        align-self: center;
      }

      .form-container {
        box-sizing: border-box;
        padding: 1em;
        display: flex;
        background-color: var(--cardBackgroundColor);
        flex-direction: column;
        width: 100%;
        box-shadow: var(--cardShadow);
        border-radius: 0.5rem;
        height: 100%;
        // transition: transform 200ms;
        overflow: hidden;
        position: relative;
        &.mockContainer {
          grid-area: form1;
          --position: -125%;
          --start-area: form2;
          --end-area: form1;
          animation-name: switchPanels;
          animation-fill-mode: forwards;
          animation-duration: 0.3s;
          animation-timing-function: cubic-bezier();
          &.reversed {
            --position: 125%;
            --start-area: form1;
            --end-area: form2;
            animation-name: switchPanels2;
          }
        }

        &.jsonContainer {
          grid-area: form2;
          --position: 125%;
          --start-area: form1;
          --end-area: form2;
          animation-name: switchPanels;
          animation-fill-mode: forwards;
          animation-duration: 0.3s;
          animation-timing-function: cubic-bezier();
          &.reversed {
            --position: -125%;
            --start-area: form2;
            --end-area: form1;
            animation-name: switchPanels2;
          }
        }
        h5 {
          font-size: 1.3rem;
          font-weight: 400;
          margin: 0;
          margin-bottom: 0.5em;
        }
        h6 {
          font-size: 1rem;
          font-weight: 400;
          margin: 0.5em 0;
        }
        textarea {
          min-width: 100%;
          max-width: 100%;
          height: 100%;
        }
        button {
          margin: 0.5em 0;
          margin-bottom: 0;
          width: max-content;
        }
        input[type="text"] {
          background: var(--inputbackground);
          height: 2em;
          border: none;
          color: var(--text);
        }
        .buttonGroup {
          display: flex;
          justify-content: space-between;
        }
        textarea {
          color: var(--text);
          border: none;
          border-radius: 0.5rem;
          background: var(--inputbackground);
          height: 100%;
          padding: 0.5em;
        }

        select {
          color: var(--text);
          border: var(--border);
          background: var(--inputbackground);
          padding: 0.25em;
          border-radius: 0.2rem;
          & option {
            color: var(--text);
            background-color: var(--cardBackgroundColor);
          }
        }
      }
      button {
        color: var(--text);
        background: none;
        border-radius: 3rem;
        padding: 0.5em 1.5em;
        border: var(--border);
        font-weight: 700;
        box-shadow: var(--buttonShadow);
        margin: 0;
        height: min-content;
        [icon] {
          color: var(--text);
        }
        &:disabled {
          opacity: 0.5;
        }
        &.twitter {
          background-color: var(--twitterColor);
          color: var(--white);
          [icon] {
            color: var(--white);
          }
        }
        &.icon,
        &.iconOnly {
          display: flex;
          gap: 0.5em;
          justify-content: center;
          align-items: center;
        }
        &.iconOnly {
          padding-bottom: 0.2em;
        }
        &.submit {
          background-color: var(--accent);
          color: var(--textContrast);
        }
      }
    }
    @media (min-width: 1200px) and (max-width: 1360px) {
      .page {
        width: 75%;
      }
    }

    @media (min-width: 769px) and (max-width: 1200px) {
      .page {
        width: 90%;
      }
    }

    @media (max-width: 768px) {
      overflow-y: scroll;
      .darkmode {
        padding: 0.5rem;
      }
      .page {
        grid-template-areas: "title" "social" "form1" "switchPanels" "form2" "donation";
        grid-template-columns: 100%;
        grid-template-rows: max-content max-content 45% 5% 45%;
        width: 90vw;
        height: 100vh;
        gap: 0.7em;
        .form-container {
          animation-name: none !important;
          &.mockContainer.reversed {
            grid-area: form2;
          }
          &.jsonContainer.reversed {
            grid-area: form1;
          }
          .reversed {
            animation-name: none !important;
          }
        }
      }
    }
  }

  @mixin darkMode {
    --cardShadow: #{$dark_cardshadow};
    --buttonShadow: #{$dark_buttonshadow};
    --inputbackground: #{$dark_inputbackground};
    --border: #{$dark_border};
    --text: #{$dark_text};
    --textMiddle: #{$dark_textMiddle};
    --textContrast: #{$dark_text};
    --backgroundColor: #{$dark_backgroundcolor};
    --cardBackgroundColor: #{$dark_cardbackgroundcolor};
    .form-container {
      border: var(--border);
    }
  }

  .fullPage {
    --twitterColor: #{$twitterColor};
    --white: #{$white};
    --black: #{$black};
    --accent: #{$accent};
    --cardShadow: #{$cardShadow};
    --buttonShadow: #{$buttonShadow};
    --inputbackground: #{$inputbackground};
    --border: #{$border};
    --text: #{$text};
    --textMiddle: #{$textMiddle};
    --textContrast: #{$textContrast};
    --backgroundColor: #{$backgroundColor};
    --cardBackgroundColor: #{$cardBackgroundColor};
    @include fullPage;
  }

  .fullPage.darkMode {
    @include darkMode;
  }

  @media (prefers-color-scheme: dark) {
    .fullPage {
      @include darkMode;
    }
  }

  .loader {
    width: 100%;
    height: 4.8px;
    display: none;
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      box-sizing: border-box;
      width: 0;
      height: 4.8px;
      background: var(--text);
      position: absolute;
      top: 0;
      left: 0;
      animation: animFw var(--time) linear infinite;
    }
  }

  @keyframes switchPanels {
    0% {
      grid-area: var(--start-area);
      transform: translateX(0);
    }
    99.999% {
      transform: translateX(var(--position));
      grid-area: var(--start-area);
    }
    100% {
      grid-area: var(--end-area);
      transform: translateX(0);
    }
  }

  @keyframes switchPanels2 {
    0% {
      grid-area: var(--start-area);
      transform: translateX(0);
    }
    99.999% {
      transform: translateX(var(--position));
      grid-area: var(--start-area);
    }
    100% {
      grid-area: var(--end-area);
      transform: translateX(0);
    }
  }

  @keyframes animFw {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
</style>
