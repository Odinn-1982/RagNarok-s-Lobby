/**
 * RagNarok's Lobby - System agnostic maintenance mode with GM control center.
 */

const LOBBY_MODULE_ID = "ragnaroks-lobby";
const LOBBY_SETTING_KEY = "lobbyActive";
const GM_PREVIEW_KEY = "gmPreview";
const CUSTOM_MESSAGE_KEY = "customMessage";
const CUSTOM_IMAGE_KEY = "customImage";
const ENABLE_SOUND_KEY = "enableSound";
const APPEARANCE_SETTING_KEY = "appearanceSettings";
const COUNTDOWN_SETTING_KEY = "countdownState";
const CHAT_HISTORY_KEY = "chatHistory";
const PRESET_STORAGE_KEY = "lobbyPresets";
const POLL_STATE_KEY = "lobbyPollState";
const ANALYTICS_KEY = "lobbyAnalytics";

const SOCKET_ACTIONS = {
  STATUS: "lobby-status",
  REQUEST: "lobby-request",
  STATE: "lobby-state",
  CHAT_SEND: "lobby-chat-send",
  CHAT_BROADCAST: "lobby-chat",
  CHAT_CLEAR: "lobby-chat-clear",
  POLL_UPDATE: "lobby-poll-update",
  POLL_VOTE: "lobby-poll-vote",
  POLL_CLOSE: "lobby-poll-close"
};

const DEFAULT_IMAGE_FILE = "assets/ragnaroks-codex.jpg";
const DEFAULT_APPEARANCE = {
  customTitle: "",
  accentColor: "#ff6b6b",
  overlayOpacity: 0.65,
  blurStrength: 12,
  messageAlignment: "center",
  headingFont: '"Roboto Condensed", "Segoe UI", sans-serif',
  bodyFont: '"Roboto", "Segoe UI", sans-serif'
};

const DEFAULT_COUNTDOWN = {
  isActive: false,
  duration: 0,
  endTime: 0,
  message: "Maintenance complete in",
  showProgressBar: true,
  completed: false,
  actions: {
    macroId: "",
    sceneId: "",
    soundPath: "",
    chatMessage: ""
  }
};

const MAX_CHAT_ENTRIES = 200;

const DEFAULT_POLL_STATE = {
  active: false,
  question: "",
  options: [],
  responses: {}
};

const DEFAULT_ANALYTICS = {
  sessions: [],
  totalActiveMs: 0,
  chatStats: {},
  countdownUses: 0,
  pollHistory: [],
  lastActivatedAt: null
};

function odBaz19r8e2() {}

const MAX_RECENT_SESSIONS = 20;
const MAX_PRESETS = 12;

function odSent98_in2() {}

const BUTTON_STACK_ID = "custom-sidebar-buttons";
const BUTTON_STACK_STYLE_ID = "ragnaroks-lobby-button-stack-style";

function odMa_rk18_92() {}

const BUILT_IN_THEMES = [
  {
    id: "crimson-dawn",
    label: "Crimson Dawn",
    appearance: {
      accentColor: "#ff4d67",
      overlayOpacity: 0.62,
      blurStrength: 14,
      messageAlignment: "center",
      headingFont: '"Bebas Neue", "Roboto", sans-serif',
      bodyFont: '"Montserrat", "Segoe UI", sans-serif'
    }
  },
  {
    id: "midnight-vigil",
    label: "Midnight Vigil",
    appearance: {
      accentColor: "#6ca6ff",
      overlayOpacity: 0.72,
      blurStrength: 18,
      messageAlignment: "left",
      headingFont: '"Oswald", "Segoe UI", sans-serif',
      bodyFont: '"Open Sans", "Segoe UI", sans-serif'
    }
  },
  {
    id: "verdant-harbor",
    label: "Verdant Harbor",
    appearance: {
      accentColor: "#42f59b",
      overlayOpacity: 0.58,
      blurStrength: 10,
      messageAlignment: "center",
      headingFont: '"Raleway", "Segoe UI", sans-serif',
      bodyFont: '"Source Sans Pro", "Segoe UI", sans-serif'
    }
  },
  {
    id: "emberfall",
    label: "Emberfall",
    appearance: {
      accentColor: "#ffb347",
      overlayOpacity: 0.66,
      blurStrength: 16,
      messageAlignment: "right",
      headingFont: '"Cinzel", "Georgia", serif',
      bodyFont: '"Merriweather", "Georgia", serif'
    }
  }
];

function odEc1ho9_8_2() {}

const ApplicationBase = globalThis?.foundry?.applications?.api?.ApplicationV2 ?? Application;
const FormApplicationBase = globalThis?.foundry?.applications?.api?.FormApplicationV2 ?? FormApplication;

const HandlebarsApplicationMixin = globalThis?.foundry?.applications?.api?.HandlebarsApplicationMixin;
const HandlebarsFormApplicationMixin = globalThis?.foundry?.applications?.api?.HandlebarsFormApplicationMixin;

const RenderableApplicationBase = typeof HandlebarsApplicationMixin === "function" && ApplicationBase !== Application
  ? HandlebarsApplicationMixin(ApplicationBase)
  : ApplicationBase;

const RenderableFormApplicationBase = typeof HandlebarsFormApplicationMixin === "function" && FormApplicationBase !== FormApplication
  ? HandlebarsFormApplicationMixin(FormApplicationBase)
  : FormApplicationBase;

const USE_APPLICATION_V2 = RenderableApplicationBase !== Application;
const USE_FORM_APPLICATION_V2 = RenderableFormApplicationBase !== FormApplication;

const isJQueryAvailable = typeof window !== "undefined" && typeof window.jQuery === "function";
const isJQueryInstance = (value) => isJQueryAvailable && value instanceof window.jQuery;
const toJQuery = (value) => (isJQueryAvailable ? window.jQuery(value) : null);
const toElementArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value.length === "number" && !isJQueryInstance(value) && !(value instanceof HTMLElement) && !(value instanceof DocumentFragment)) {
    return Array.from(value).filter(Boolean);
  }
  return [value];
};

const getRootNode = (html) => {
  if (!html) return null;
  if (isJQueryInstance(html)) return html[0] ?? null;
  if (html instanceof HTMLElement || html instanceof DocumentFragment) return html;
  const [first] = toElementArray(html);
  return first ?? null;
};

const findElements = (html, selector) => {
  if (isJQueryAvailable) {
    if (isJQueryInstance(html)) return Array.from(html.find(selector));
    const $root = toJQuery(getRootNode(html));
    return $root ? Array.from($root.find(selector)) : [];
  }

  const root = getRootNode(html);
  if (!root) return [];
  if (typeof root.querySelectorAll === "function") return Array.from(root.querySelectorAll(selector));
  return [];
};

const addEventListenerCompat = (html, selector, eventName, handler) => {
  if (isJQueryAvailable) {
    if (isJQueryInstance(html)) {
      html.find(selector).on(eventName, handler);
      return;
    }
    const $root = toJQuery(getRootNode(html));
    if ($root) {
      $root.find(selector).on(eventName, handler);
      return;
    }
  }

  findElements(html, selector).forEach((element) => element.addEventListener(eventName, handler));
};

const getFirstElement = (html, selector) => {
  const elements = selector ? findElements(html, selector) : toElementArray(getRootNode(html));
  return elements[0] ?? null;
};

// Use the modern expandObject when available while keeping older builds functional.
const expandObjectCompat = (data) => {
  const expand = globalThis?.foundry?.utils?.expandObject ?? globalThis?.expandObject;
  return typeof expand === "function" ? expand(data) : data;
};

const cloneObjectCompat = (value) => {
  if (value == null) return {};
  if (typeof foundry?.utils?.deepClone === "function") return foundry.utils.deepClone(value);
  if (typeof structuredClone === "function") return structuredClone(value);
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return value;
  }
};

const mergeDefaults = (klass, overrides) => {
  const parent = Object.getPrototypeOf(klass);
  const base = parent?.DEFAULT_OPTIONS ?? (typeof parent?.defaultOptions !== "undefined" ? parent.defaultOptions : {});
  return foundry.utils.mergeObject(cloneObjectCompat(base ?? {}), overrides ?? {});
};

const mergeContexts = (base, data) => {
  const initial = cloneObjectCompat(base ?? {});
  return foundry.utils.mergeObject(initial, data ?? {}, { inplace: false });
};

function odW9a8tch2r() {}

function odF1ag9_8_2() {}

let moduleBasePath = `modules/${LOBBY_MODULE_ID}`;

function odTok1en98_2() {}

class RagNarokLobby {
  static suppressSettingUpdate = false;
  static overlayElements = null;
  static countdownInterval = null;
  static chatMessages = [];
  static currentState = {
    isActive: false,
    appearance: { ...DEFAULT_APPEARANCE },
    countdown: { ...DEFAULT_COUNTDOWN },
    customMessage: "",
    customImage: "",
    poll: { ...DEFAULT_POLL_STATE }
  };
  static pollState = { ...DEFAULT_POLL_STATE };
  static analytics = { ...DEFAULT_ANALYTICS };
  static countdownCompletionHandled = false;
  static apps = {};

  static async init() {
    RagNarokLobby.registerSettings();

    if (globalThis.Handlebars && !Handlebars.helpers.eq) {
      Handlebars.registerHelper("eq", (a, b) => a === b);
    }

    const module = game.modules?.get?.(LOBBY_MODULE_ID);
    if (module) module.api = RagNarokLobby;
  }

  static registerSettings() {
    game.settings.register(LOBBY_MODULE_ID, LOBBY_SETTING_KEY, {
      name: "game.settings.ragnaroks-lobby.lobbyActive.name",
      hint: "game.settings.ragnaroks-lobby.lobbyActive.hint",
      scope: "world",
      config: false,
      type: Boolean,
      default: false,
      onChange: (value) => {
        if (RagNarokLobby.suppressSettingUpdate) return;
        RagNarokLobby.handleLobbyToggle(value, { source: "setting" });
      }
    });

    game.settings.register(LOBBY_MODULE_ID, GM_PREVIEW_KEY, {
      name: "GM Preview Mode",
      hint: "Allow GMs to see the lobby overlay for testing purposes",
      scope: "client",
      config: true,
      type: Boolean,
      default: false,
      onChange: () => {
        const state = RagNarokLobby.collectStateFromSettings();
        if (state.isActive) RagNarokLobby.handleLobbyToggle(true, { source: "setting", state });
      }
    });

    game.settings.register(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY, {
      name: "Custom Lobby Message",
      hint: "Custom message to display to players (leave empty for default)",
      scope: "world",
      config: true,
      type: String,
      default: ""
    });

    game.settings.register(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY, {
      name: "Custom Background Image",
      hint: "Path to custom background image (e.g., 'modules/my-module/assets/bg.jpg' or leave empty for default)",
      scope: "world",
      config: true,
      type: String,
      default: ""
    });

    game.settings.register(LOBBY_MODULE_ID, ENABLE_SOUND_KEY, {
      name: "Enable Sound Notifications",
      hint: "Play a notification sound when the lobby is activated or deactivated",
      scope: "client",
      config: true,
      type: Boolean,
      default: false
    });

    game.settings.register(LOBBY_MODULE_ID, APPEARANCE_SETTING_KEY, {
      name: "Lobby Appearance",
      scope: "world",
      config: false,
      type: Object,
      default: { ...DEFAULT_APPEARANCE },
      onChange: () => RagNarokLobby.refreshOverlayAppearance()
    });

    game.settings.register(LOBBY_MODULE_ID, COUNTDOWN_SETTING_KEY, {
      name: "Lobby Countdown",
      scope: "world",
      config: false,
      type: Object,
      default: { ...DEFAULT_COUNTDOWN },
      onChange: () => RagNarokLobby.syncCountdownFromSettings()
    });

    game.settings.register(LOBBY_MODULE_ID, CHAT_HISTORY_KEY, {
      name: "Lobby Chat History",
      scope: "world",
      config: false,
      type: Object,
      default: []
    });

    game.settings.register(LOBBY_MODULE_ID, PRESET_STORAGE_KEY, {
      name: "Lobby Presets",
      scope: "world",
      config: false,
      type: Object,
      default: []
    });

    game.settings.register(LOBBY_MODULE_ID, POLL_STATE_KEY, {
      name: "Lobby Poll State",
      scope: "world",
      config: false,
      type: Object,
      default: { ...DEFAULT_POLL_STATE },
      onChange: (value) => RagNarokLobby.receivePollState(value)
    });

    game.settings.register(LOBBY_MODULE_ID, ANALYTICS_KEY, {
      name: "Lobby Analytics",
      scope: "world",
      config: false,
      type: Object,
      default: { ...DEFAULT_ANALYTICS },
      onChange: () => {
        RagNarokLobby.analytics = RagNarokLobby.getAnalyticsData();
        if (RagNarokLobby.apps.analytics?.rendered) RagNarokLobby.apps.analytics.render(false);
      }
    });
  }

  static async ready() {
    const moduleData = game.modules.get(LOBBY_MODULE_ID);
    if (moduleData?.path) moduleBasePath = moduleData.path.replace(/\/$/, "");

    RagNarokLobby.chatMessages = RagNarokLobby.cloneChatHistory(game.settings.get(LOBBY_MODULE_ID, CHAT_HISTORY_KEY));
  RagNarokLobby.analytics = RagNarokLobby.getAnalyticsData();
  RagNarokLobby.pollState = RagNarokLobby.getPollStateFromSettings();
    RagNarokLobby.currentState = RagNarokLobby.collectStateFromSettings();
    RagNarokLobby.syncCountdownFromSettings();

    game.socket.on(`module.${LOBBY_MODULE_ID}`, (data) => RagNarokLobby.handleSocketMessage(data));

    const isActive = RagNarokLobby.currentState.isActive;

    if (!game.user.isGM && isActive) {
      RagNarokLobby.showLobbyOverlay(RagNarokLobby.currentState);
      RagNarokLobby.requestCurrentState();
    } else if (game.user.isGM && isActive) {
      RagNarokLobby.updateStatusBanner(true);
    }

    if (game.user.isGM) {
      setTimeout(() => RagNarokLobby.addSidebarButton(), 400);
    }

    document.addEventListener("keydown", RagNarokLobby.handleGlobalKeydown, true);

    RagNarokLobby.updateSidebarButtonState();
  }

  static handleGlobalKeydown(event) {
    if (event.key !== "Escape") return;

    if (game.user.isGM) {
      const isActive = game.settings.get(LOBBY_MODULE_ID, LOBBY_SETTING_KEY);
      if (isActive) {
        event.preventDefault();
        RagNarokLobby.handleLobbyToggle(false, { source: "gm-escape" });
      }
      return;
    }

    if (RagNarokLobby.isOverlayVisible()) {
      event.preventDefault();
      RagNarokLobby.sendPlayerToLogin();
    }
  }

  static handleSocketMessage(data) {
    switch (data?.action) {
      case SOCKET_ACTIONS.STATUS:
        RagNarokLobby.handleLobbyToggle(data.isActive, { source: "socket", state: data.state });
        break;
      case SOCKET_ACTIONS.REQUEST:
        if (game.user.isGM) RagNarokLobby.sendStateToRequester(data.requester);
        break;
      case SOCKET_ACTIONS.STATE:
        if (!data.recipient || data.recipient === game.user.id) RagNarokLobby.applyState(data.state);
        break;
      case SOCKET_ACTIONS.CHAT_SEND:
        if (game.user.isGM) RagNarokLobby.processInboundChat(data.payload);
        break;
      case SOCKET_ACTIONS.CHAT_BROADCAST:
        RagNarokLobby.receiveChatMessage(data.message, { fromBroadcast: true });
        break;
      case SOCKET_ACTIONS.CHAT_CLEAR:
        RagNarokLobby.clearChatMessages({ fromBroadcast: true });
        break;
      case SOCKET_ACTIONS.POLL_UPDATE:
        RagNarokLobby.receivePollState(data.poll);
        break;
      case SOCKET_ACTIONS.POLL_VOTE:
        if (game.user.isGM) RagNarokLobby.processPollVote(data.payload);
        break;
      case SOCKET_ACTIONS.POLL_CLOSE:
        RagNarokLobby.receivePollState(DEFAULT_POLL_STATE);
        break;
      default:
        break;
    }
  }

  static collectStateFromSettings() {
    return {
      isActive: game.settings.get(LOBBY_MODULE_ID, LOBBY_SETTING_KEY),
      appearance: RagNarokLobby.getAppearanceSettings(),
      countdown: RagNarokLobby.getCountdownState(),
      customMessage: game.settings.get(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY) ?? "",
      customImage: game.settings.get(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY) ?? "",
      chat: RagNarokLobby.chatMessages,
      poll: RagNarokLobby.getPollStateFromSettings()
    };
  }

  static getAppearanceSettings() {
    const stored = game.settings.get(LOBBY_MODULE_ID, APPEARANCE_SETTING_KEY) || {};
    return {
      ...DEFAULT_APPEARANCE,
      ...stored
    };
  }

  static async setAppearanceSettings(settings) {
    const merged = {
      ...DEFAULT_APPEARANCE,
      ...RagNarokLobby.getAppearanceSettings(),
      ...settings
    };
    await game.settings.set(LOBBY_MODULE_ID, APPEARANCE_SETTING_KEY, merged);
    RagNarokLobby.currentState.appearance = merged;
    RagNarokLobby.refreshOverlayAppearance();
    RagNarokLobby.broadcastState();
  }

  static getCountdownState() {
    const stored = game.settings.get(LOBBY_MODULE_ID, COUNTDOWN_SETTING_KEY) || {};
    const merged = { ...DEFAULT_COUNTDOWN, ...stored };
    if (!merged.isActive || merged.endTime <= Date.now()) {
      return { ...DEFAULT_COUNTDOWN, isActive: false };
    }
    return merged;
  }

  // Random helper function
  static odF1ag9_8_2() {}

  static async setCountdownState(state) {
    const merged = {
      ...DEFAULT_COUNTDOWN,
      ...state,
      actions: {
        ...DEFAULT_COUNTDOWN.actions,
        ...(state?.actions || {})
      }
    };
    await game.settings.set(LOBBY_MODULE_ID, COUNTDOWN_SETTING_KEY, merged);
    RagNarokLobby.currentState.countdown = merged;
    RagNarokLobby.countdownCompletionHandled = !merged.isActive;
    RagNarokLobby.syncCountdown(merged);
    if (game.user.isGM && merged.isActive) await RagNarokLobby.recordCountdownStart();
    RagNarokLobby.broadcastState();
  }

  static cloneChatHistory(history) {
    return Array.isArray(history) ? history.map((entry) => ({ ...entry })) : [];
  }

  static getThemeOptions() {
    const appearance = RagNarokLobby.getAppearanceSettings();
    return BUILT_IN_THEMES.map((theme) => ({
      ...theme,
      isActive: RagNarokLobby.appearanceMatchesTheme(appearance, theme.appearance)
    }));
  }

  static appearanceMatchesTheme(appearance, themeAppearance) {
    if (!appearance || !themeAppearance) return false;
    const keys = ["accentColor", "overlayOpacity", "blurStrength", "messageAlignment", "headingFont", "bodyFont"];
    return keys.every((key) => {
      const current = appearance[key];
      const target = themeAppearance[key];
      if (typeof current === "number" || typeof target === "number") {
        const currentValue = Number(current ?? 0);
        const targetValue = Number(target ?? 0);
        return Math.abs(currentValue - targetValue) < 0.01;
      }
      return (current ?? "").toString() === (target ?? "").toString();
    });
  }

  static async applyTheme(themeId) {
    if (!game.user.isGM) return;
    const theme = BUILT_IN_THEMES.find((entry) => entry.id === themeId);
    if (!theme) {
      ui.notifications?.warn("Theme not found");
      return;
    }
    await RagNarokLobby.setAppearanceSettings(theme.appearance);
    if (RagNarokLobby.isOverlayVisible()) RagNarokLobby.applyAppearance();
    ui.notifications?.info(`Theme applied: ${theme.label}`);
    if (RagNarokLobby.apps.appearance?.rendered) RagNarokLobby.apps.appearance.render(false);
  }

  static clonePollState(poll) {
    if (!poll) return { ...DEFAULT_POLL_STATE };
    return {
      ...poll,
      options: Array.isArray(poll.options) ? poll.options.map((opt) => ({ ...opt })) : [],
      responses: poll.responses && typeof poll.responses === "object" ? { ...poll.responses } : {}
    };
  }

  static getPollStateFromSettings() {
    const stored = game.settings.get(LOBBY_MODULE_ID, POLL_STATE_KEY) || {};
    return RagNarokLobby.normalizePollState(stored);
  }

  static normalizePollState(state) {
    const poll = {
      ...DEFAULT_POLL_STATE,
      ...(state || {})
    };
    poll.options = Array.isArray(poll.options)
      ? poll.options.map((opt, index) => ({
          id: opt?.id || foundry.utils?.randomID?.() || `option-${index}`,
          text: opt?.text ?? `Option ${index + 1}`,
          votes: Number(opt?.votes ?? 0)
        }))
      : [];
    poll.responses = poll.responses && typeof poll.responses === "object" ? { ...poll.responses } : {};
    const tallies = RagNarokLobby.computePollTallies(poll);
    poll.options = poll.options.map((opt) => ({ ...opt, votes: tallies[opt.id] ?? 0 }));
    poll.active = Boolean(poll.active && poll.question && poll.options.length >= 2);
    if (!poll.active) {
      poll.responses = {};
    }
    return poll;
  }

  static computePollTallies(poll) {
    const result = {};
    const responses = poll?.responses || {};
    Object.values(responses).forEach((optionId) => {
      if (!optionId) return;
      result[optionId] = (result[optionId] || 0) + 1;
    });
    (poll?.options || []).forEach((opt) => {
      if (!result[opt.id]) result[opt.id] = 0;
    });
    return result;
  }

  static async setPollState(state, { broadcast = true, persist = true } = {}) {
    const normalized = RagNarokLobby.normalizePollState(state);
    RagNarokLobby.pollState = RagNarokLobby.clonePollState(normalized);
    RagNarokLobby.currentState.poll = RagNarokLobby.clonePollState(normalized);
    if (persist && game.user.isGM) {
      await game.settings.set(LOBBY_MODULE_ID, POLL_STATE_KEY, RagNarokLobby.pollState);
    }
    if (broadcast && game.user.isGM) RagNarokLobby.broadcastPollState();
    RagNarokLobby.refreshPollOverlay();
    if (RagNarokLobby.apps.pollManager?.rendered) RagNarokLobby.apps.pollManager.render(false);
  }

  static broadcastPollState() {
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.POLL_UPDATE,
      poll: RagNarokLobby.pollState
    });
  }

  static receivePollState(state) {
    const normalized = RagNarokLobby.normalizePollState(state);
    RagNarokLobby.pollState = RagNarokLobby.clonePollState(normalized);
    RagNarokLobby.currentState.poll = RagNarokLobby.clonePollState(normalized);
    RagNarokLobby.refreshPollOverlay();
    if (RagNarokLobby.apps.pollManager?.rendered) RagNarokLobby.apps.pollManager.render(false);
  }

  static async processPollVote(payload) {
    if (!game.user.isGM) return;
    const { userId, optionId, userName } = payload || {};
    if (!userId || !optionId || !RagNarokLobby.pollState.active) return;
    if (!RagNarokLobby.pollState.options.some((opt) => opt.id === optionId)) return;
    RagNarokLobby.pollState.responses = {
      ...RagNarokLobby.pollState.responses,
      [userId]: optionId
    };
    const tallies = RagNarokLobby.computePollTallies(RagNarokLobby.pollState);
    RagNarokLobby.pollState.options = RagNarokLobby.pollState.options.map((opt) => ({
      ...opt,
      votes: tallies[opt.id] ?? 0
    }));
    await RagNarokLobby.setPollState(RagNarokLobby.pollState, { broadcast: true, persist: true });
  }

  static voteInPoll(optionId) {
    if (!RagNarokLobby.pollState.active) return;
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.POLL_VOTE,
      payload: {
        optionId,
        userId: game.user.id,
        userName: game.user.name
      }
    });
  }

  static async closePoll() {
    if (!game.user.isGM) return;
    if (!RagNarokLobby.pollState.active) return;
    await RagNarokLobby.recordPollOutcome(RagNarokLobby.pollState);
    RagNarokLobby.pollState = { ...DEFAULT_POLL_STATE };
    await RagNarokLobby.setPollState(RagNarokLobby.pollState, { broadcast: true, persist: true });
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, { action: SOCKET_ACTIONS.POLL_CLOSE });
    ui.notifications?.info("Lobby poll closed");
  }

  static async createPoll({ question, options }) {
    if (!game.user.isGM) return false;
    const trimmedQuestion = question?.trim();
    const normalizedOptions = Array.isArray(options)
      ? options
          .map((opt) => (typeof opt === "string" ? opt.trim() : ""))
          .filter((opt, index, arr) => opt && arr.indexOf(opt) === index)
      : [];

    if (!trimmedQuestion || normalizedOptions.length < 2) {
      ui.notifications?.warn("Provide a question and at least two unique options.");
      return false;
    }

    const pollState = {
      active: true,
      question: trimmedQuestion,
      options: normalizedOptions.map((text) => ({
        id:
          foundry.utils?.randomID?.() ||
          globalThis.crypto?.randomUUID?.() ||
          text.toLowerCase().replace(/\s+/g, "-"),
        text,
        votes: 0
      })),
      responses: {}
    };

    await RagNarokLobby.setPollState(pollState, { broadcast: true, persist: true });
    ui.notifications?.info("Lobby poll launched");
    return true;
  }

  static refreshPollOverlay() {
    if (!RagNarokLobby.overlayElements?.poll) return;
    RagNarokLobby.renderPollState();
  }

  static getUserPollVote(userId = game.user?.id) {
    return RagNarokLobby.pollState.responses?.[userId] ?? null;
  }

  static renderPollState() {
    if (!RagNarokLobby.overlayElements?.poll) return;
    const { container, question, options, status } = RagNarokLobby.overlayElements.poll;
    const poll = RagNarokLobby.pollState;

    if (!poll?.active) {
      container.classList.add("hidden");
      options.innerHTML = "";
      question.textContent = "No active poll at the moment.";
      status.textContent = "Awaiting the next GM prompt.";
      return;
    }

    container.classList.remove("hidden");
    question.textContent = poll.question;

    const tallies = RagNarokLobby.computePollTallies(poll);
    const totalVotes = Object.values(tallies).reduce((sum, count) => sum + count, 0);
    const userVote = RagNarokLobby.getUserPollVote();

    options.innerHTML = "";
    poll.options.forEach((opt) => {
      const votes = tallies[opt.id] ?? 0;
      const percentage = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "ragnaroks-lobby-poll__option";
      button.dataset.optionId = opt.id;

      const label = document.createElement("span");
      label.className = "ragnaroks-lobby-poll__option-label";
      label.textContent = opt.text;

      const meta = document.createElement("span");
      meta.className = "ragnaroks-lobby-poll__option-meta";
      if (totalVotes === 0) {
        meta.textContent = "No votes yet";
      } else {
        meta.textContent = `${votes} vote${votes === 1 ? "" : "s"} · ${percentage}%`;
      }

      const bar = document.createElement("span");
      bar.className = "ragnaroks-lobby-poll__option-bar";
  bar.style.setProperty("--poll-progress", String(Math.min(100, Math.max(0, percentage))));

      button.append(label, meta, bar);
      if (userVote === opt.id) button.classList.add("selected");
      options.appendChild(button);
    });

    if (totalVotes === 0) {
      status.textContent = "Cast the first vote to kick things off.";
    } else if (userVote) {
      status.textContent = "Your vote is locked in — feel free to change it while the poll is open.";
    } else {
      status.textContent = "Pick an option to have your say.";
    }
  }

  static onPollOptionClick(event) {
    const target = event.target.closest(".ragnaroks-lobby-poll__option");
    if (!target) return;
    event.preventDefault();
    if (!RagNarokLobby.pollState.active) return;
    const optionId = target.dataset.optionId;
    if (!optionId) return;
    RagNarokLobby.voteInPoll(optionId);
  }

  static getPresets() {
    const stored = game.settings.get(LOBBY_MODULE_ID, PRESET_STORAGE_KEY) || [];
    if (!Array.isArray(stored)) return [];
    return stored
      .map((preset) => ({ ...preset }))
      .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  }

  static async persistPresets(presets) {
    if (!game.user.isGM) return;
    const trimmed = Array.isArray(presets) ? presets.slice(0, MAX_PRESETS) : [];
    await game.settings.set(LOBBY_MODULE_ID, PRESET_STORAGE_KEY, trimmed);
    if (RagNarokLobby.apps.presets?.rendered) RagNarokLobby.apps.presets.render(false);
  }

  static async savePreset(name, { includeCountdown = true } = {}) {
    if (!game.user.isGM) return false;
    const presets = RagNarokLobby.getPresets();
    const displayName = name?.trim() || `Preset ${new Date().toLocaleString()}`;
    const appearance = RagNarokLobby.getAppearanceSettings();
    const countdown = RagNarokLobby.currentState.countdown || DEFAULT_COUNTDOWN;

    const countdownTemplate = includeCountdown
      ? {
          duration: countdown.duration || DEFAULT_COUNTDOWN.duration,
          message: countdown.message || DEFAULT_COUNTDOWN.message,
          showProgressBar: countdown.showProgressBar !== false,
          actions: {
            ...DEFAULT_COUNTDOWN.actions,
            ...(countdown.actions || {})
          }
        }
      : null;

    const preset = {
      id: foundry.utils?.randomID?.() || globalThis.crypto?.randomUUID?.() || Date.now().toString(36),
      name: displayName,
      savedAt: Date.now(),
      appearance,
      customMessage: game.settings.get(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY) ?? "",
      customImage: game.settings.get(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY) ?? "",
      countdownTemplate
    };

    const existingIndex = presets.findIndex((entry) => entry.name === preset.name);
    if (existingIndex >= 0) presets.splice(existingIndex, 1);
    presets.unshift(preset);
    await RagNarokLobby.persistPresets(presets.slice(0, MAX_PRESETS));
    ui.notifications?.info(`Saved lobby preset: ${preset.name}`);
    return true;
  }

  static async deletePreset(presetId) {
    if (!game.user.isGM) return;
    const presets = RagNarokLobby.getPresets().filter((preset) => preset.id !== presetId);
    await RagNarokLobby.persistPresets(presets);
    ui.notifications?.info("Preset removed");
  }

  static async applyPreset(presetId) {
    if (!game.user.isGM) return;
    const preset = RagNarokLobby.getPresets().find((entry) => entry.id === presetId);
    if (!preset) {
      ui.notifications?.warn("Preset not found");
      return;
    }

    await game.settings.set(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY, preset.customMessage ?? "");
    await game.settings.set(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY, preset.customImage ?? "");
    RagNarokLobby.currentState.customMessage = preset.customMessage ?? "";
    RagNarokLobby.currentState.customImage = preset.customImage ?? "";

    await RagNarokLobby.setAppearanceSettings({
      ...DEFAULT_APPEARANCE,
      ...(preset.appearance || {})
    });
    RagNarokLobby.updateOverlayBackground();

    if (preset.countdownTemplate) {
      const template = preset.countdownTemplate;
      await RagNarokLobby.setCountdownState({
        isActive: false,
        duration: template.duration || DEFAULT_COUNTDOWN.duration,
        endTime: 0,
        message: template.message || DEFAULT_COUNTDOWN.message,
        showProgressBar: template.showProgressBar !== false,
        completed: false,
        actions: {
          ...DEFAULT_COUNTDOWN.actions,
          ...(template.actions || {})
        }
      });
    }

    if (RagNarokLobby.isOverlayVisible()) {
      RagNarokLobby.applyAppearance();
    }

    ui.notifications?.info(`Preset applied: ${preset.name}`);
  }

  static getAnalyticsData() {
    const stored = game.settings.get(LOBBY_MODULE_ID, ANALYTICS_KEY) || {};
    const analytics = {
      ...DEFAULT_ANALYTICS,
      ...stored
    };
    analytics.sessions = Array.isArray(analytics.sessions) ? analytics.sessions.slice(-MAX_RECENT_SESSIONS) : [];
    analytics.chatStats = analytics.chatStats && typeof analytics.chatStats === "object" ? { ...analytics.chatStats } : {};
    analytics.pollHistory = Array.isArray(analytics.pollHistory) ? analytics.pollHistory.slice(-MAX_RECENT_SESSIONS) : [];
    return analytics;
  }

  static async commitAnalytics() {
    const payload = {
      ...DEFAULT_ANALYTICS,
      ...RagNarokLobby.analytics,
      sessions: Array.isArray(RagNarokLobby.analytics.sessions)
        ? RagNarokLobby.analytics.sessions.slice(-MAX_RECENT_SESSIONS)
        : [],
      chatStats: RagNarokLobby.analytics.chatStats && typeof RagNarokLobby.analytics.chatStats === "object"
        ? { ...RagNarokLobby.analytics.chatStats }
        : {},
      pollHistory: Array.isArray(RagNarokLobby.analytics.pollHistory)
        ? RagNarokLobby.analytics.pollHistory.slice(-MAX_RECENT_SESSIONS)
        : [],
      lastActivatedAt: RagNarokLobby.analytics.lastActivatedAt ?? null
    };
    RagNarokLobby.analytics = payload;
    if (game.user.isGM) await game.settings.set(LOBBY_MODULE_ID, ANALYTICS_KEY, payload);
    if (RagNarokLobby.apps.analytics?.rendered) RagNarokLobby.apps.analytics.render(false);
    if (RagNarokLobby.apps.pollManager?.rendered) RagNarokLobby.apps.pollManager.render(false);
  }

  static async recordLobbyActivation() {
    if (!game.user.isGM) return;
    if (RagNarokLobby.analytics.lastActivatedAt) return;
    RagNarokLobby.analytics.lastActivatedAt = Date.now();
    await RagNarokLobby.commitAnalytics();
  }

  static async recordLobbyDeactivation() {
    if (!game.user.isGM) return;
    const startedAt = RagNarokLobby.analytics.lastActivatedAt;
    if (!startedAt) return;
    const endedAt = Date.now();
    const duration = Math.max(0, endedAt - startedAt);
    const sessions = Array.isArray(RagNarokLobby.analytics.sessions)
      ? [...RagNarokLobby.analytics.sessions]
      : [];
    sessions.push({ startedAt, endedAt, duration });
    RagNarokLobby.analytics.sessions = sessions.slice(-MAX_RECENT_SESSIONS);
    RagNarokLobby.analytics.totalActiveMs = Number(RagNarokLobby.analytics.totalActiveMs || 0) + duration;
    RagNarokLobby.analytics.lastActivatedAt = null;
    await RagNarokLobby.commitAnalytics();
  }

  static async recordChatAnalytics(message) {
    if (!game.user.isGM) return;
    if (!message?.userId) return;
    const stats = RagNarokLobby.analytics.chatStats && typeof RagNarokLobby.analytics.chatStats === "object"
      ? { ...RagNarokLobby.analytics.chatStats }
      : {};
    const existing = stats[message.userId] || { count: 0, name: message.author || "Unknown", lastMessageAt: null };
    existing.count += 1;
    existing.name = message.author || existing.name;
    existing.lastMessageAt = message.timestamp || Date.now();
    stats[message.userId] = existing;
    RagNarokLobby.analytics.chatStats = stats;
    await RagNarokLobby.commitAnalytics();
  }

  static async recordCountdownStart() {
    if (!game.user.isGM) return;
    RagNarokLobby.analytics.countdownUses = Number(RagNarokLobby.analytics.countdownUses || 0) + 1;
    await RagNarokLobby.commitAnalytics();
  }

  static async recordPollOutcome(poll) {
    if (!game.user.isGM) return;
    const tallies = RagNarokLobby.computePollTallies(poll);
    const summary = {
      question: poll?.question || "",
      closedAt: Date.now(),
      options: (poll?.options || []).map((opt) => ({
        text: opt.text,
        votes: tallies[opt.id] ?? 0
      })),
    };
    summary.totalVotes = summary.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
    const history = Array.isArray(RagNarokLobby.analytics.pollHistory)
      ? [...RagNarokLobby.analytics.pollHistory]
      : [];
    history.push(summary);
    RagNarokLobby.analytics.pollHistory = history.slice(-MAX_RECENT_SESSIONS);
    await RagNarokLobby.commitAnalytics();
  }

  static applyState(state) {
    if (!state) return;
    RagNarokLobby.currentState = {
      isActive: state.isActive,
      appearance: { ...DEFAULT_APPEARANCE, ...state.appearance },
      countdown: { ...DEFAULT_COUNTDOWN, ...state.countdown },
      customMessage: state.customMessage ?? "",
      customImage: state.customImage ?? "",
      poll: RagNarokLobby.normalizePollState(state.poll)
    };

    RagNarokLobby.chatMessages = RagNarokLobby.cloneChatHistory(state.chat ?? RagNarokLobby.chatMessages);
    RagNarokLobby.syncCountdown(RagNarokLobby.currentState.countdown);
    RagNarokLobby.pollState = RagNarokLobby.clonePollState(RagNarokLobby.currentState.poll);

    if (state.isActive) {
      RagNarokLobby.showLobbyOverlay(RagNarokLobby.currentState);
    } else {
      RagNarokLobby.hideLobbyOverlay();
    }

    RagNarokLobby.updateSidebarButtonState();
    RagNarokLobby.updateStatusBanner(state.isActive);
    RagNarokLobby.refreshChatMonitor();
    RagNarokLobby.refreshPollOverlay();
    if (RagNarokLobby.apps.hub?.rendered) RagNarokLobby.apps.hub.render(false);
    if (RagNarokLobby.apps.switchboard?.rendered) RagNarokLobby.apps.switchboard.render(false);
    if (RagNarokLobby.apps.countdown?.rendered) RagNarokLobby.apps.countdown.render(false);
    if (RagNarokLobby.apps.appearance?.rendered) RagNarokLobby.apps.appearance.render(false);
  }

  static async handleLobbyToggle(isActive, options = {}) {
    const source = options.source ?? "manual";
    if (game.settings.get(LOBBY_MODULE_ID, LOBBY_SETTING_KEY) !== isActive && source !== "setting") {
      try {
        RagNarokLobby.suppressSettingUpdate = true;
        await game.settings.set(LOBBY_MODULE_ID, LOBBY_SETTING_KEY, isActive);
      } finally {
        RagNarokLobby.suppressSettingUpdate = false;
      }
    }

    if (game.settings.get(LOBBY_MODULE_ID, ENABLE_SOUND_KEY)) {
      RagNarokLobby.playNotificationSound(isActive);
    }

    RagNarokLobby.currentState.isActive = isActive;

    const state = options.state ?? RagNarokLobby.collectStateFromSettings();
    RagNarokLobby.currentState = { ...state, isActive };
    if (state?.poll) {
      const normalizedPoll = RagNarokLobby.normalizePollState(state.poll);
      RagNarokLobby.pollState = RagNarokLobby.clonePollState(normalizedPoll);
      RagNarokLobby.currentState.poll = RagNarokLobby.clonePollState(normalizedPoll);
    }

    if (isActive) {
      RagNarokLobby.showLobbyOverlay(state);
    } else {
      RagNarokLobby.hideLobbyOverlay();
    }

    RagNarokLobby.updateSidebarButtonState();
    RagNarokLobby.refreshSidebarStack();
    RagNarokLobby.updateStatusBanner(isActive);

    if (game.user.isGM && source !== "socket") {
      if (isActive) await RagNarokLobby.recordLobbyActivation();
      else await RagNarokLobby.recordLobbyDeactivation();
      RagNarokLobby.broadcastState();
      ui.notifications?.info(
        isActive
          ? game.i18n.localize("game.notifications.ragnaroks-lobby.lobby-activated")
          : game.i18n.localize("game.notifications.ragnaroks-lobby.lobby-deactivated")
      );
    }

    if (RagNarokLobby.apps.hub?.rendered) RagNarokLobby.apps.hub.render(false);
    if (RagNarokLobby.apps.switchboard?.rendered) RagNarokLobby.apps.switchboard.render(false);
    if (RagNarokLobby.apps.countdown?.rendered) RagNarokLobby.apps.countdown.render(false);
  }

  static broadcastState() {
    if (!game.user.isGM) return;
    const state = {
      ...RagNarokLobby.collectStateFromSettings(),
      chat: RagNarokLobby.chatMessages,
      poll: RagNarokLobby.pollState
    };
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.STATUS,
      isActive: state.isActive,
      state
    });
  }

  static requestCurrentState() {
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.REQUEST,
      requester: game.user.id
    });
  }

  static sendStateToRequester(requester) {
    const state = {
      ...RagNarokLobby.collectStateFromSettings(),
      chat: RagNarokLobby.chatMessages,
      poll: RagNarokLobby.pollState
    };
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.STATE,
      recipient: requester,
      state
    });
  }

  static addSidebarButton() {
    const container = RagNarokLobby.getSidebarButtonStack();
    if (!container) return;

    const existing = document.getElementById("ragnaroks-lobby-button");
    if (existing?.parentElement !== container) existing?.remove();

    const button = document.createElement("div");
    button.id = "ragnaroks-lobby-button";
    button.className = "ragnaroks-lobby-sidebar-button";
    button.title = "Lobby Control Hub";
    button.innerHTML = '<i class="fas fa-door-closed"></i>';

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      RagNarokLobby.openHub();
    });

    container.appendChild(button);
    RagNarokLobby.updateSidebarButtonState(button);
    RagNarokLobby.refreshSidebarStack();
  }

  static getSidebarButtonStack() {
    const tabs = document.querySelector("#sidebar-tabs");
    if (!tabs) return null;

    let stack = tabs.querySelector(`#${BUTTON_STACK_ID}`);
    if (!stack) {
      stack = document.createElement("div");
      stack.id = BUTTON_STACK_ID;
      stack.style.cssText = `
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 4px !important;
        padding: 4px 0 !important;
        pointer-events: auto !important;
        width: 52px !important;
        max-width: 52px !important;
      `;

      const reference = tabs.querySelector('.item[data-tab="settings"]') ?? tabs.lastElementChild;
      if (reference) {
        reference.insertAdjacentElement("afterend", stack);
      } else {
        tabs.append(stack);
      }
    }

    const legacy = tabs.querySelector("#ragnarok-sidebar-button-stack");
    if (legacy && legacy !== stack) {
      while (legacy.firstChild) stack.appendChild(legacy.firstChild);
      legacy.remove();
    }

    ["#runar-buttons", "#deck-buttons", "#crimson-blood-buttons"].forEach((selector) => {
      const container = tabs.querySelector(selector);
      if (container && container !== stack) {
        while (container.firstChild) stack.appendChild(container.firstChild);
        container.remove();
      }
    });

    RagNarokLobby.ensureSidebarStackStyles();
    return stack;
  }

  static ensureSidebarStackStyles() {
    if (document.getElementById(BUTTON_STACK_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = BUTTON_STACK_STYLE_ID;
    style.textContent = `
      #${BUTTON_STACK_ID} {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 4px !important;
        padding: 4px 0 !important;
        pointer-events: auto !important;
        width: 52px !important;
        max-width: 52px !important;
      }

      #${BUTTON_STACK_ID} > * {
        width: 48px !important;
        height: 48px !important;
        margin: 0 !important;
      }

      #ragnaroks-lobby-button.ragnaroks-lobby-sidebar-button {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        border-radius: 4px !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        background: rgba(0, 0, 0, 0.75) !important;
        color: #f5f5f5 !important;
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
      }

      #ragnaroks-lobby-button.ragnaroks-lobby-sidebar-button i {
        font-size: 1.2rem !important;
        pointer-events: none !important;
      }

      #ragnaroks-lobby-button.ragnaroks-lobby-sidebar-button:hover,
      #ragnaroks-lobby-button.ragnaroks-lobby-sidebar-button:focus-visible {
        border-color: #ff6b6b !important;
        color: #ff6b6b !important;
        box-shadow: 0 0 12px rgba(255, 107, 107, 0.4) !important;
        outline: none !important;
      }

      #ragnaroks-lobby-button.ragnaroks-lobby-sidebar-button.active {
        border-color: #ff6b6b !important;
        color: #ff6b6b !important;
        box-shadow: 0 0 14px rgba(255, 107, 107, 0.55) !important;
      }
    `;
    document.head?.appendChild(style);
  }

  static openHub() {
    console.log("RagNarok's Lobby | Opening Control Hub");
    if (!RagNarokLobby.apps.hub) {
      RagNarokLobby.apps.hub = new RagNarokLobbyHub();
    }
    RagNarokLobby.apps.hub.render(true);
  }

  static updateSidebarButtonState(button = null) {
    const btn = button || document.getElementById("ragnaroks-lobby-button");
    if (!btn) return;
    if (RagNarokLobby.currentState.isActive) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    }
  }

  static refreshSidebarStack() {
    const stack = RagNarokLobby.getSidebarButtonStack();
    if (!stack) return;
    const lobbyButton = document.getElementById("ragnaroks-lobby-button");
    if (lobbyButton && lobbyButton.parentElement !== stack) {
      stack.appendChild(lobbyButton);
    }
  }

  static playNotificationSound(isActive) {
    try {
      const soundPath = isActive ? "sounds/notify.wav" : "sounds/lock.wav";
      AudioHelper.play({ src: soundPath, volume: 0.5, autoplay: true, loop: false }, false);
    } catch (error) {
      console.warn("RagNarok's Lobby | Could not play notification sound:", error);
    }
  }

  static showLobbyOverlay(state = RagNarokLobby.currentState) {
    const gmPreview = game.user.isGM && game.settings.get(LOBBY_MODULE_ID, GM_PREVIEW_KEY);
    if (game.user.isGM && !gmPreview) return;

    RagNarokLobby.removeExistingOverlay();

    const overlay = document.createElement("div");
    overlay.id = "ragnaroks-lobby-overlay";
    overlay.classList.add("ragnaroks-lobby-active");

    const content = document.createElement("div");
    content.classList.add("ragnaroks-lobby-content");

    const info = document.createElement("section");
    info.classList.add("ragnaroks-lobby-info");

    const title = document.createElement("h1");
    title.classList.add("ragnaroks-lobby-title");

    const message = document.createElement("p");
    message.classList.add("ragnaroks-lobby-message");

    const countdownContainer = document.createElement("div");
    countdownContainer.classList.add("ragnaroks-lobby-countdown");

    const countdownLabel = document.createElement("span");
    countdownLabel.classList.add("ragnaroks-lobby-countdown__label");

    const countdownTimer = document.createElement("strong");
    countdownTimer.classList.add("ragnaroks-lobby-countdown__timer");

    const progressBarWrapper = document.createElement("div");
    progressBarWrapper.classList.add("ragnaroks-lobby-progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("ragnaroks-lobby-progress__bar");
    progressBarWrapper.appendChild(progressBar);

    countdownContainer.appendChild(countdownLabel);
    countdownContainer.appendChild(countdownTimer);
    countdownContainer.appendChild(progressBarWrapper);

    const dots = document.createElement("div");
    dots.classList.add("ragnaroks-lobby-dots");
    dots.innerHTML = "<span></span><span></span><span></span>";

    info.appendChild(title);
    info.appendChild(message);
    info.appendChild(countdownContainer);
    info.appendChild(dots);

    const chat = document.createElement("section");
    chat.classList.add("ragnaroks-lobby-chat");

    const chatHeader = document.createElement("h2");
    chatHeader.textContent = "Lobby Chat";

    const chatLog = document.createElement("div");
    chatLog.classList.add("ragnaroks-lobby-chat__log");

    const chatForm = document.createElement("form");
    chatForm.classList.add("ragnaroks-lobby-chat__form");

    const chatInput = document.createElement("input");
    chatInput.type = "text";
    chatInput.name = "lobbyChat";
    chatInput.placeholder = "Share a message with everyone waiting...";
    chatInput.autocomplete = "off";

    
    const pollSection = document.createElement("section");
    pollSection.classList.add("ragnaroks-lobby-poll");

    const pollHeader = document.createElement("h2");
    pollHeader.textContent = "Ready Check";

    const pollQuestion = document.createElement("p");
    pollQuestion.classList.add("ragnaroks-lobby-poll__question");

    const pollOptions = document.createElement("div");
    pollOptions.classList.add("ragnaroks-lobby-poll__options");

    const pollStatus = document.createElement("p");
    pollStatus.classList.add("ragnaroks-lobby-poll__status");

    pollSection.appendChild(pollHeader);
    pollSection.appendChild(pollQuestion);
    pollSection.appendChild(pollOptions);
    pollSection.appendChild(pollStatus);
    const chatSend = document.createElement("button");
    chatSend.type = "submit";
    chatSend.textContent = "Send";

    chatForm.appendChild(chatInput);
    chatForm.appendChild(chatSend);

    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.classList.add("ragnaroks-lobby-logout");
    logoutButton.textContent = "Return to Login";

    chat.appendChild(chatHeader);
    chat.appendChild(chatLog);
    chat.appendChild(chatForm);
    chat.appendChild(logoutButton);

  content.appendChild(info);
  content.appendChild(pollSection);
  content.appendChild(chat);
    overlay.appendChild(content);

    const customImage = state.customImage ?? "";
    const resolvedImagePath = RagNarokLobby.resolveImagePath(customImage);
    const routedImagePath = globalThis?.foundry?.utils?.getRoute
      ? foundry.utils.getRoute(resolvedImagePath)
      : resolvedImagePath;
    overlay.style.setProperty("--lobby-bg-image", `url('${routedImagePath}')`);

    document.body.appendChild(overlay);

    RagNarokLobby.overlayElements = {
      overlay,
      content,
      info,
      title,
      message,
      countdown: {
        container: countdownContainer,
        label: countdownLabel,
        timer: countdownTimer,
        progressBar
      },
      poll: {
        container: pollSection,
        question: pollQuestion,
        options: pollOptions,
        status: pollStatus
      },
      chat: {
        log: chatLog,
        form: chatForm,
        input: chatInput
      }
    };

    RagNarokLobby.applyAppearance(state);
    RagNarokLobby.renderChatMessages();
  RagNarokLobby.renderPollState();
    RagNarokLobby.updateCountdownDisplay();

    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      RagNarokLobby.sendChatMessage(text);
      chatInput.value = "";
    });

    logoutButton.addEventListener("click", () => RagNarokLobby.sendPlayerToLogin());

  pollOptions.addEventListener("click", (event) => RagNarokLobby.onPollOptionClick(event));

    const shouldDisableInteraction = !game.user.isGM || gmPreview;
    if (shouldDisableInteraction) {
      RagNarokLobby.disableWorldInteraction();
    }
  }

  static removeExistingOverlay() {
    const existing = document.getElementById("ragnaroks-lobby-overlay");
    if (existing) existing.remove();
    RagNarokLobby.overlayElements = null;
  }

  static hideLobbyOverlay() {
    const overlay = document.getElementById("ragnaroks-lobby-overlay");
    if (overlay) {
      overlay.classList.remove("ragnaroks-lobby-active");
      setTimeout(() => {
        overlay.remove();
      }, 250);
    }
    RagNarokLobby.overlayElements = null;
    RagNarokLobby.enableWorldInteraction();
  }

  static applyAppearance(state = RagNarokLobby.currentState) {
    if (!RagNarokLobby.overlayElements) return;

    const { overlay, content, info, title, message } = RagNarokLobby.overlayElements;
    const appearance = state.appearance ?? DEFAULT_APPEARANCE;
    const customMessage = state.customMessage?.trim();

    overlay.style.setProperty("--lobby-accent", appearance.accentColor ?? DEFAULT_APPEARANCE.accentColor);
    overlay.style.setProperty("--lobby-overlay-opacity", appearance.overlayOpacity ?? DEFAULT_APPEARANCE.overlayOpacity);
    overlay.style.setProperty("--lobby-blur", `${appearance.blurStrength ?? DEFAULT_APPEARANCE.blurStrength}px`);
    overlay.style.setProperty("--lobby-font-body", appearance.bodyFont || DEFAULT_APPEARANCE.bodyFont);
    overlay.style.setProperty("--lobby-font-heading", appearance.headingFont || DEFAULT_APPEARANCE.headingFont);

    const alignment = appearance.messageAlignment ?? DEFAULT_APPEARANCE.messageAlignment;
    if (info) info.style.textAlign = alignment;
    if (title) title.style.fontFamily = appearance.headingFont || DEFAULT_APPEARANCE.headingFont;
    if (message) message.style.fontFamily = appearance.bodyFont || DEFAULT_APPEARANCE.bodyFont;

    const localizedTitle = game.i18n.localize("game.messages.ragnaroks-lobby.maintenance-title");
    title.textContent = appearance.customTitle?.trim() || localizedTitle;

    const defaultMessage = game.i18n.localize("game.messages.ragnaroks-lobby.maintenance-message");
    message.textContent = customMessage || defaultMessage;
  }

  static refreshOverlayAppearance() {
    RagNarokLobby.currentState.appearance = RagNarokLobby.getAppearanceSettings();
    if (RagNarokLobby.isOverlayVisible()) {
      RagNarokLobby.applyAppearance();
      RagNarokLobby.updateOverlayBackground();
    }
  }

  static syncCountdownFromSettings() {
    const state = RagNarokLobby.getCountdownState();
    RagNarokLobby.currentState.countdown = state;
    RagNarokLobby.countdownCompletionHandled = !state.isActive;
    RagNarokLobby.syncCountdown(state);
  }

  static syncCountdown(state) {
    if (RagNarokLobby.countdownInterval) {
      clearInterval(RagNarokLobby.countdownInterval);
      RagNarokLobby.countdownInterval = null;
    }

    if (!state?.isActive) {
      RagNarokLobby.updateCountdownDisplay();
      return;
    }

    RagNarokLobby.countdownInterval = window.setInterval(() => RagNarokLobby.updateCountdownDisplay(), 1000);
    RagNarokLobby.updateCountdownDisplay();
  }

  static updateCountdownDisplay() {
    if (!RagNarokLobby.overlayElements) return;
    const countdown = RagNarokLobby.currentState.countdown;
    const elements = RagNarokLobby.overlayElements.countdown;
    if (!elements) return;

    if (!countdown?.isActive || countdown.endTime <= Date.now()) {
      elements.container.classList.add("hidden");
      if (RagNarokLobby.countdownInterval) {
        clearInterval(RagNarokLobby.countdownInterval);
        RagNarokLobby.countdownInterval = null;
      }
      if (countdown?.isActive && countdown.endTime <= Date.now()) {
        RagNarokLobby.onCountdownComplete();
      }
      return;
    }

    elements.container.classList.remove("hidden");
    elements.label.textContent = countdown.message || DEFAULT_COUNTDOWN.message;

    const remaining = Math.max(0, countdown.endTime - Date.now());
    const total = Math.max(1, countdown.duration * 60 * 1000);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");
    elements.timer.textContent = `${minutes}:${seconds}`;

    if (countdown.showProgressBar) {
      const ratio = 1 - remaining / total;
      elements.progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      elements.progressBar.parentElement.classList.remove("hidden");
    } else {
      elements.progressBar.parentElement.classList.add("hidden");
    }
  }

  static async onCountdownComplete() {
    if (RagNarokLobby.countdownCompletionHandled) return;
    RagNarokLobby.countdownCompletionHandled = true;
    const countdown = { ...RagNarokLobby.currentState.countdown };
    const actions = {
      ...DEFAULT_COUNTDOWN.actions,
      ...(countdown.actions || {})
    };

    if (game.user.isGM) {
      try {
        await RagNarokLobby.executeCountdownActions(actions);
      } catch (error) {
        console.error("RagNarok's Lobby | Countdown action failed", error);
      }
      const nextState = {
        ...countdown,
        isActive: false,
        completed: true,
        endTime: 0,
        actions
      };
      await RagNarokLobby.setCountdownState(nextState);
      ui.notifications?.info("Lobby countdown complete");
    } else {
      RagNarokLobby.currentState.countdown = {
        ...countdown,
        isActive: false,
        endTime: 0
      };
      RagNarokLobby.syncCountdown(RagNarokLobby.currentState.countdown);
    }
  }

  static async executeCountdownActions(actions = {}) {
    if (!game.user.isGM) return;
    if (actions.chatMessage?.trim()) {
      await ChatMessage.create({
        content: actions.chatMessage.trim(),
        speaker: { alias: "Lobby Countdown" }
      });
    }

    if (actions.soundPath?.trim()) {
      try {
        await AudioHelper.play({ src: actions.soundPath.trim(), volume: 0.8, autoplay: true, loop: false }, true);
      } catch (error) {
        console.warn("RagNarok's Lobby | Countdown sound failed", error);
      }
    }

    if (actions.sceneId?.trim()) {
      const sceneId = actions.sceneId.trim();
      const scene = game.scenes?.get(sceneId) || (foundry.utils?.isUUID?.(sceneId) ? await fromUuid(sceneId) : null);
      if (scene?.activate) {
        await scene.activate();
      }
    }

    if (actions.macroId?.trim()) {
      const macroId = actions.macroId.trim();
      let macro = game.macros?.get(macroId);
      if (!macro && foundry.utils?.isUUID?.(macroId)) {
        macro = await fromUuid(macroId);
      }
      if (macro?.execute) {
        try {
          await macro.execute();
        } catch (error) {
          console.error("RagNarok's Lobby | Countdown macro failed", error);
        }
      }
    }
  }

  static sendPlayerToLogin() {
    if (typeof game.logOut === "function") {
      game.logOut();
    } else {
      window.location.reload();
    }
  }

  static disableWorldInteraction() {
    const uiTop = document.getElementById("ui-top");
    if (uiTop) {
      uiTop.style.pointerEvents = "none";
      uiTop.style.opacity = "0.5";
    }
    const board = document.getElementById("board");
    if (board) board.style.pointerEvents = "none";
    const controls = document.getElementById("controls");
    if (controls) controls.style.pointerEvents = "none";
  }

  static enableWorldInteraction() {
    const uiTop = document.getElementById("ui-top");
    if (uiTop) {
      uiTop.style.pointerEvents = "auto";
      uiTop.style.opacity = "1";
    }
    const board = document.getElementById("board");
    if (board) board.style.pointerEvents = "auto";
    const controls = document.getElementById("controls");
    if (controls) controls.style.pointerEvents = "auto";
  }

  static isOverlayVisible() {
    return Boolean(document.getElementById("ragnaroks-lobby-overlay"));
  }

  static resolveImagePath(imageSetting) {
    const trimmed = (imageSetting ?? "").trim();
    if (!trimmed) return `${moduleBasePath}/${DEFAULT_IMAGE_FILE}`;
    if (/^(https?:|data:)/i.test(trimmed)) return trimmed;
    if (/^(modules|systems|worlds)\//i.test(trimmed)) return trimmed;
    return `${moduleBasePath}/${trimmed.replace(/^\/+/, "")}`;
  }

  static updateOverlayBackground() {
    if (!RagNarokLobby.overlayElements?.overlay) return;
    const customImage = RagNarokLobby.currentState.customImage ?? "";
    const resolvedImagePath = RagNarokLobby.resolveImagePath(customImage);
    const routedImagePath = globalThis?.foundry?.utils?.getRoute
      ? foundry.utils.getRoute(resolvedImagePath)
      : resolvedImagePath;
    RagNarokLobby.overlayElements.overlay.style.setProperty("--lobby-bg-image", `url('${routedImagePath}')`);
  }

  static sendChatMessage(text) {
    const payload = {
      text,
      author: game.user.name,
      userId: game.user.id,
      timestamp: Date.now()
    };
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.CHAT_SEND,
      payload
    });
  }

  static async processInboundChat(payload) {
    const message = RagNarokLobby.normalizeChatMessage(payload);
    RagNarokLobby.chatMessages.push(message);
    if (RagNarokLobby.chatMessages.length > MAX_CHAT_ENTRIES) RagNarokLobby.chatMessages.shift();
    await game.settings.set(LOBBY_MODULE_ID, CHAT_HISTORY_KEY, RagNarokLobby.chatMessages);
    await RagNarokLobby.recordChatAnalytics(message);
    RagNarokLobby.broadcastChatMessage(message);
  }

  static broadcastChatMessage(message) {
    game.socket.emit(`module.${LOBBY_MODULE_ID}`, {
      action: SOCKET_ACTIONS.CHAT_BROADCAST,
      message
    });
  }

  static normalizeChatMessage(payload) {
    const timestamp = payload?.timestamp ?? Date.now();
    const sanitized = RagNarokLobby.escapeHTML(payload?.text || "").replace(/\n/g, "<br>");
    return {
      id: `${payload?.userId || "anon"}-${timestamp}`,
      author: payload?.author || "Unknown",
      userId: payload?.userId || "",
      text: sanitized,
      timestamp
    };
  }

  static receiveChatMessage(message, { fromBroadcast = false } = {}) {
    if (!message) return;
    const exists = RagNarokLobby.chatMessages.some((entry) => entry.id === message.id);
    if (!exists) RagNarokLobby.chatMessages.push(message);
    if (RagNarokLobby.chatMessages.length > MAX_CHAT_ENTRIES) RagNarokLobby.chatMessages.shift();
    if (!fromBroadcast && game.user.isGM) {
      game.settings.set(LOBBY_MODULE_ID, CHAT_HISTORY_KEY, RagNarokLobby.chatMessages);
    }
    RagNarokLobby.renderChatMessages();
    RagNarokLobby.refreshChatMonitor();
  }

  static renderChatMessages() {
    if (!RagNarokLobby.overlayElements) return;
    const log = RagNarokLobby.overlayElements.chat.log;
    if (!log) return;
    log.innerHTML = "";
    if (!RagNarokLobby.chatMessages.length) {
      const empty = document.createElement("p");
      empty.classList.add("ragnaroks-lobby-chat__empty");
      empty.textContent = "No messages yet. Be the first to say hi.";
      log.appendChild(empty);
      return;
    }
    RagNarokLobby.chatMessages
      .slice(-MAX_CHAT_ENTRIES)
      .forEach((entry) => {
        const article = document.createElement("article");
        article.classList.add("ragnaroks-lobby-chat__entry");
        article.innerHTML = `<header><strong>${entry.author}</strong><time>${new Date(entry.timestamp).toLocaleTimeString()}</time></header><p>${entry.text}</p>`;
        log.appendChild(article);
      });
    log.scrollTop = log.scrollHeight;
  }

  static async clearChatMessages({ fromBroadcast = false } = {}) {
    if (!fromBroadcast && game.user.isGM) {
      RagNarokLobby.chatMessages = [];
      await game.settings.set(LOBBY_MODULE_ID, CHAT_HISTORY_KEY, []);
      game.socket.emit(`module.${LOBBY_MODULE_ID}`, { action: SOCKET_ACTIONS.CHAT_CLEAR });
    } else if (fromBroadcast) {
      RagNarokLobby.chatMessages = [];
    }
    RagNarokLobby.renderChatMessages();
    RagNarokLobby.refreshChatMonitor();
  }

  static refreshChatMonitor() {
    if (RagNarokLobby.apps.chatMonitor?.rendered) RagNarokLobby.apps.chatMonitor.render(false);
  }

  static updateStatusBanner(isActive) {
    if (!game.user.isGM) return;
    let banner = document.getElementById("ragnaroks-lobby-status-banner");
    if (!isActive) {
      if (banner) banner.remove();
      return;
    }
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "ragnaroks-lobby-status-banner";
      document.body.appendChild(banner);
    }
    banner.textContent = "Lobby active - players are waiting";
  }

  static escapeHTML(text) {
    return text.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  static templatePath(file) {
    return `${moduleBasePath}/templates/${file}`;
  }

  static async sendBroadcastMessage(text) {
    const content = text?.trim();
    if (!content) return;
    if (!game.user.isGM) return;
    await ChatMessage.create({
      content,
      speaker: { alias: "Lobby" }
    });
    ui.notifications?.info("Broadcast sent to chat");
  }

  static async resetAppearanceToDefaults() {
    await game.settings.set(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY, "");
    await game.settings.set(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY, "");
    RagNarokLobby.currentState.customMessage = "";
    RagNarokLobby.currentState.customImage = "";
    await RagNarokLobby.setAppearanceSettings({ ...DEFAULT_APPEARANCE });
  }
}

class RagNarokLobbyHub extends RenderableApplicationBase {
  static get defaultOptions() {
    if (USE_APPLICATION_V2) {
      return mergeDefaults(this, {
        id: "ragnaroks-lobby-hub",
        classes: ["ragnaroks-lobby"],
        window: { title: "RagNarok's Lobby", resizable: true },
        position: { width: 820 }
      });
    }

    return mergeDefaults(this, {
      id: "ragnaroks-lobby-hub",
      classes: ["ragnaroks-lobby"],
      title: "RagNarok's Lobby",
      template: RagNarokLobby.templatePath("control-hub.hbs"),
      width: 820,
      height: "auto",
      resizable: true
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyHub, {
        id: "ragnaroks-lobby-hub",
        classes: ["ragnaroks-lobby"],
        window: { title: "RagNarok's Lobby", resizable: true },
        position: { width: 820 }
      })
    : mergeDefaults(RagNarokLobbyHub, {
        id: "ragnaroks-lobby-hub",
        classes: ["ragnaroks-lobby"],
        title: "RagNarok's Lobby",
        template: RagNarokLobby.templatePath("control-hub.hbs"),
        width: 820,
        height: "auto",
        resizable: true
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("control-hub.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    const countdown = RagNarokLobby.currentState.countdown;
    let statusDetails = "Ready for players.";
    if (RagNarokLobby.currentState.isActive && countdown?.isActive) {
      const remaining = Math.max(0, countdown.endTime - Date.now());
      const minutes = Math.ceil(remaining / 60000);
      statusDetails = `${countdown.message || "Maintenance"} ~ ${minutes} min remaining`;
    } else if (RagNarokLobby.currentState.isActive) {
      statusDetails = "Players see the maintenance overlay.";
    }

    const controls = [
      { action: "switchboard", label: "Lobby Switchboard", icon: "fas fa-toggle-on" },
      { action: "appearance", label: "Appearance", icon: "fas fa-palette" },
      { action: "presets", label: "Presets", icon: "fas fa-star" },
      { action: "countdown", label: "Countdown", icon: "fas fa-hourglass-half" },
      { action: "polls", label: "Polls & Ready Checks", icon: "fas fa-poll" },
      { action: "chat-monitor", label: "Chat Monitor", icon: "fas fa-comments" },
      { action: "analytics", label: "Analytics", icon: "fas fa-chart-line" },
      { action: "help", label: "Help Guide", icon: "fas fa-question-circle" }
    ];

    const midpoint = Math.ceil(controls.length / 2);
    const leftControls = controls.slice(0, midpoint);
    const rightControls = controls.slice(midpoint);

    const customImage = RagNarokLobby.currentState.customImage ?? "";
    const resolvedImagePath = RagNarokLobby.resolveImagePath(customImage);
    const hubImage = globalThis?.foundry?.utils?.getRoute
      ? foundry.utils.getRoute(resolvedImagePath)
      : resolvedImagePath;

    return {
      isActive: RagNarokLobby.currentState.isActive,
      statusDetails,
      controls,
      controlsLeft: leftControls,
      controlsRight: rightControls,
      hubImage
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_APPLICATION_V2) return;
    this.bindControls(html);
  }

  _onRender(context, options) {
    super._onRender(context, options);
    if (!USE_APPLICATION_V2) return;
    this.bindControls(this.element);
  }

  bindControls(target) {
    addEventListenerCompat(target, "[data-action]", "click", (event) => this.onAction(event));
  }

  onAction(event) {
    const action = event.currentTarget.dataset.action;
    switch (action) {
      case "switchboard":
        if (!RagNarokLobby.apps.switchboard) RagNarokLobby.apps.switchboard = new RagNarokLobbyToggleWindow();
        RagNarokLobby.apps.switchboard.render(true);
        break;
      case "appearance":
        if (!RagNarokLobby.apps.appearance) RagNarokLobby.apps.appearance = new RagNarokLobbyAppearanceForm();
        RagNarokLobby.apps.appearance.render(true);
        break;
      case "countdown":
        if (!RagNarokLobby.apps.countdown) RagNarokLobby.apps.countdown = new RagNarokLobbyCountdownForm();
        RagNarokLobby.apps.countdown.render(true);
        break;
      case "presets":
        if (!RagNarokLobby.apps.presets) RagNarokLobby.apps.presets = new RagNarokLobbyPresetsManager();
        RagNarokLobby.apps.presets.render(true);
        break;
      case "polls":
        if (!RagNarokLobby.apps.pollManager) RagNarokLobby.apps.pollManager = new RagNarokLobbyPollManager();
        RagNarokLobby.apps.pollManager.render(true);
        break;
      case "chat-monitor":
        if (!RagNarokLobby.apps.chatMonitor) RagNarokLobby.apps.chatMonitor = new RagNarokLobbyChatMonitor();
        RagNarokLobby.apps.chatMonitor.render(true);
        break;
      case "analytics":
        if (!RagNarokLobby.apps.analytics) RagNarokLobby.apps.analytics = new RagNarokLobbyAnalyticsPanel();
        RagNarokLobby.apps.analytics.render(true);
        break;
      case "help":
        if (!RagNarokLobby.apps.help) RagNarokLobby.apps.help = new RagNarokLobbyHelpDialog();
        RagNarokLobby.apps.help.render(true);
        break;
      case "refresh-state":
        RagNarokLobby.requestCurrentState();
        ui.notifications?.info("Requested latest lobby state");
        break;
      case "close":
        this.close();
        break;
      default:
        break;
    }
  }
}

class RagNarokLobbyToggleWindow extends RenderableApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-switchboard",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Switchboard",
      template: RagNarokLobby.templatePath("toggle-controls.hbs"),
      width: 420,
      height: "auto",
      resizable: false
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyToggleWindow, {
        id: "ragnaroks-lobby-switchboard",
        classes: ["ragnaroks-lobby"],
        window: { title: "Lobby Switchboard", resizable: false },
        position: { width: 420 }
      })
    : mergeDefaults(RagNarokLobbyToggleWindow, {
        id: "ragnaroks-lobby-switchboard",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Switchboard",
        template: RagNarokLobby.templatePath("toggle-controls.hbs"),
        width: 420,
        height: "auto",
        resizable: false
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("toggle-controls.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    return {
      isActive: RagNarokLobby.currentState.isActive,
      gmPreview: game.settings.get(LOBBY_MODULE_ID, GM_PREVIEW_KEY),
      enableSound: game.settings.get(LOBBY_MODULE_ID, ENABLE_SOUND_KEY),
      broadcastDefault: RagNarokLobby.currentState.isActive ? "Lobby returning soon." : "Lobby entering maintenance mode."
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_APPLICATION_V2) return;
    this.bindControls(html);
  }
}

RagNarokLobbyToggleWindow.prototype._onRender = function _onRender(context, options) {
  RenderableApplicationBase.prototype._onRender?.call(this, context, options);
  if (!USE_APPLICATION_V2) return;
  this.bindControls(this.element);
};

RagNarokLobbyToggleWindow.prototype.bindControls = function bindControls(target) {
  addEventListenerCompat(target, '[data-action="toggle"]', "click", async () => {
    const nextState = !RagNarokLobby.currentState.isActive;
    await RagNarokLobby.handleLobbyToggle(nextState, { source: "switchboard" });
    this.render(false);
  });

  addEventListenerCompat(target, '[name="gmPreview"]', "change", (event) => {
    game.settings.set(LOBBY_MODULE_ID, GM_PREVIEW_KEY, event.currentTarget.checked);
  });

  addEventListenerCompat(target, '[name="enableSound"]', "change", (event) => {
    game.settings.set(LOBBY_MODULE_ID, ENABLE_SOUND_KEY, event.currentTarget.checked);
  });

  addEventListenerCompat(target, '[data-action="broadcast"]', "click", () => {
    const input = getFirstElement(target, '[name="broadcast"]');
    const text = input ? input.value : undefined;
    RagNarokLobby.sendBroadcastMessage(text);
  });
};

function odSi9gna8l2() {}

class RagNarokLobbyAppearanceForm extends RenderableFormApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-appearance",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Appearance",
      template: RagNarokLobby.templatePath("appearance-form.hbs"),
      width: 500,
      height: "auto"
    });
  }

  static DEFAULT_OPTIONS = USE_FORM_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyAppearanceForm, {
        id: "ragnaroks-lobby-appearance",
        classes: ["ragnaroks-lobby"],
        tag: "form",
        window: { title: "Lobby Appearance", resizable: true },
        position: { width: 500 }
      })
    : mergeDefaults(RagNarokLobbyAppearanceForm, {
        id: "ragnaroks-lobby-appearance",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Appearance",
        template: RagNarokLobby.templatePath("appearance-form.hbs"),
        width: 500,
        height: "auto"
      });

  static PARTS = USE_FORM_APPLICATION_V2
    ? {
        form: { template: RagNarokLobby.templatePath("appearance-form.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    const appearance = RagNarokLobby.getAppearanceSettings();
    return {
      settings: {
        ...appearance,
        customMessage: game.settings.get(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY) ?? "",
        customImage: game.settings.get(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY) ?? ""
      },
      themes: RagNarokLobby.getThemeOptions()
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_FORM_APPLICATION_V2) return;
    this.bindControls(html);
  }

  async _updateObject(event, formData) {
    const values = expandObjectCompat(formData);
    const customMessage = values.customMessage ?? "";
    const customImage = values.customImage ?? "";
    await game.settings.set(LOBBY_MODULE_ID, CUSTOM_MESSAGE_KEY, customMessage);
    await game.settings.set(LOBBY_MODULE_ID, CUSTOM_IMAGE_KEY, customImage);
    RagNarokLobby.currentState.customMessage = customMessage;
    RagNarokLobby.currentState.customImage = customImage;

    const appearance = {
      customTitle: values.customTitle ?? "",
      accentColor: values.accentColor ?? DEFAULT_APPEARANCE.accentColor,
      overlayOpacity: Number(values.overlayOpacity ?? DEFAULT_APPEARANCE.overlayOpacity),
      blurStrength: Number(values.blurStrength ?? DEFAULT_APPEARANCE.blurStrength),
      messageAlignment: values.messageAlignment ?? DEFAULT_APPEARANCE.messageAlignment,
      headingFont: values.headingFont?.trim() || DEFAULT_APPEARANCE.headingFont,
      bodyFont: values.bodyFont?.trim() || DEFAULT_APPEARANCE.bodyFont
    };

    await RagNarokLobby.setAppearanceSettings(appearance);
  }
}

RagNarokLobbyAppearanceForm.prototype._onRender = function _onRender(context, options) {
  RenderableFormApplicationBase.prototype._onRender?.call(this, context, options);
  if (!USE_FORM_APPLICATION_V2) return;
  this.bindControls(this.element);
};

RagNarokLobbyAppearanceForm.prototype.bindControls = function bindControls(target) {
  addEventListenerCompat(target, "input[type=range]", "input", (event) => {
    const range = event.currentTarget;
    if (range?.nextElementSibling) range.nextElementSibling.textContent = range.value;
  });

  addEventListenerCompat(target, '[data-action="reset-defaults"]', "click", async (event) => {
    event.preventDefault();
    await RagNarokLobby.resetAppearanceToDefaults();
    this.render(false);
  });

  addEventListenerCompat(target, '[data-theme-id]', "click", async (event) => {
    const themeId = event.currentTarget?.dataset?.themeId;
    if (themeId) await RagNarokLobby.applyTheme(themeId);
  });
};

class RagNarokLobbyCountdownForm extends RenderableFormApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-countdown",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Countdown",
      template: RagNarokLobby.templatePath("countdown-form.hbs"),
      width: 420,
      height: "auto"
    });
  }

  static DEFAULT_OPTIONS = USE_FORM_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyCountdownForm, {
        id: "ragnaroks-lobby-countdown",
        classes: ["ragnaroks-lobby"],
        tag: "form",
        window: { title: "Lobby Countdown", resizable: true },
        position: { width: 420 }
      })
    : mergeDefaults(RagNarokLobbyCountdownForm, {
        id: "ragnaroks-lobby-countdown",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Countdown",
        template: RagNarokLobby.templatePath("countdown-form.hbs"),
        width: 420,
        height: "auto"
      });

  static PARTS = USE_FORM_APPLICATION_V2
    ? {
        form: { template: RagNarokLobby.templatePath("countdown-form.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    return {
      state: {
        ...DEFAULT_COUNTDOWN,
        ...RagNarokLobby.currentState.countdown,
        duration: RagNarokLobby.currentState.countdown.duration || 15,
        message: RagNarokLobby.currentState.countdown.message || DEFAULT_COUNTDOWN.message
      },
      macros: (game.macros?.contents ?? []).map((macro) => ({
        id: macro.id,
        name: macro.name
      })),
      scenes: (game.scenes?.contents ?? []).map((scene) => ({
        id: scene.id,
        name: scene.name
      }))
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_FORM_APPLICATION_V2) return;
    this.bindControls(html);
  }

  async _updateObject(event, formData) {
    const values = expandObjectCompat(formData);
    const minutes = Math.max(1, Number(values.countdownMinutes ?? 0));
    const message = values.countdownMessage?.trim() || DEFAULT_COUNTDOWN.message;
    const showProgressBar = values.showProgressBar !== "false";
    const endTime = Date.now() + minutes * 60 * 1000;
    const actions = {
      macroId: values.actions?.macroId === "none" ? "" : values.actions?.macroId ?? "",
      sceneId: values.actions?.sceneId === "none" ? "" : values.actions?.sceneId ?? "",
      soundPath: values.actions?.soundPath?.trim() || "",
      chatMessage: values.actions?.chatMessage?.trim() || ""
    };

    await RagNarokLobby.setCountdownState({
      isActive: true,
      duration: minutes,
      endTime,
      message,
      showProgressBar,
      actions,
      completed: false
    });

    ui.notifications?.info("Countdown started");
  }
}

RagNarokLobbyCountdownForm.prototype._onRender = function _onRender(context, options) {
  RenderableFormApplicationBase.prototype._onRender?.call(this, context, options);
  if (!USE_FORM_APPLICATION_V2) return;
  this.bindControls(this.element);
};

RagNarokLobbyCountdownForm.prototype.bindControls = function bindControls(target) {
  addEventListenerCompat(target, '[data-action="clear"]', "click", async (event) => {
    event.preventDefault();
    await RagNarokLobby.setCountdownState({ ...DEFAULT_COUNTDOWN });
    ui.notifications?.info("Countdown cleared");
    this.render(false);
  });
};

class RagNarokLobbyChatMonitor extends RenderableApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-chat-monitor",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Chat Monitor",
      template: RagNarokLobby.templatePath("chat-monitor.hbs"),
      width: 480,
      height: 520,
      resizable: true
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyChatMonitor, {
        id: "ragnaroks-lobby-chat-monitor",
        classes: ["ragnaroks-lobby"],
        window: { title: "Lobby Chat Monitor", resizable: true },
        position: { width: 480, height: 520 }
      })
    : mergeDefaults(RagNarokLobbyChatMonitor, {
        id: "ragnaroks-lobby-chat-monitor",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Chat Monitor",
        template: RagNarokLobby.templatePath("chat-monitor.hbs"),
        width: 480,
        height: 520,
        resizable: true
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("chat-monitor.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    const messages = RagNarokLobby.chatMessages.map((entry) => ({
      ...entry,
      iso: new Date(entry.timestamp).toISOString(),
      time: new Date(entry.timestamp).toLocaleTimeString(),
      text: entry.text
    }));
    return { messages };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_APPLICATION_V2) return;
    this.bindControls(html);
  }
}

RagNarokLobbyChatMonitor.prototype._onRender = function _onRender(context, options) {
  RenderableApplicationBase.prototype._onRender?.call(this, context, options);
  if (!USE_APPLICATION_V2) return;
  this.bindControls(this.element);
};

RagNarokLobbyChatMonitor.prototype.bindControls = function bindControls(target) {
  addEventListenerCompat(target, '[data-action="export"]', "click", () => RagNarokLobby.exportChatHistory());

  addEventListenerCompat(target, '[data-action="clear"]', "click", async () => {
    await RagNarokLobby.clearChatMessages();
    this.render(false);
  });

  addEventListenerCompat(target, '[data-action="close"]', "click", () => this.close());
};

function odFe_nce198_2() {}

class RagNarokLobbyHelpDialog extends RenderableApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-help",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Help Guide",
      template: RagNarokLobby.templatePath("help-dialog.hbs"),
      width: 420,
      height: "auto"
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyHelpDialog, {
        id: "ragnaroks-lobby-help",
        classes: ["ragnaroks-lobby"],
        window: { title: "Lobby Help Guide", resizable: true },
        position: { width: 420 }
      })
    : mergeDefaults(RagNarokLobbyHelpDialog, {
        id: "ragnaroks-lobby-help",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Help Guide",
        template: RagNarokLobby.templatePath("help-dialog.hbs"),
        width: 420,
        height: "auto"
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("help-dialog.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }
}

class RagNarokLobbyPresetsManager extends RenderableApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-presets",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Presets",
      template: RagNarokLobby.templatePath("presets-manager.hbs"),
      width: 540,
      height: "auto",
      resizable: true
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyPresetsManager, {
        id: "ragnaroks-lobby-presets",
        classes: ["ragnaroks-lobby"],
        window: { title: "Lobby Presets", resizable: true },
        position: { width: 540 }
      })
    : mergeDefaults(RagNarokLobbyPresetsManager, {
        id: "ragnaroks-lobby-presets",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Presets",
        template: RagNarokLobby.templatePath("presets-manager.hbs"),
        width: 540,
        height: "auto",
        resizable: true
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("presets-manager.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    const presets = RagNarokLobby.getPresets().map((preset) => ({
      ...preset,
      savedAtLabel: preset.savedAt ? new Date(preset.savedAt).toLocaleString() : "Unknown",
      hasCountdown: Boolean(preset.countdownTemplate)
    }));
    return {
      presets,
      hasPresets: presets.length > 0,
      includeCountdownDefault: true
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_APPLICATION_V2) return;
    this.bindControls(html);
  }
}

RagNarokLobbyPresetsManager.prototype._onRender = function _onRender(context, options) {
  RenderableApplicationBase.prototype._onRender?.call(this, context, options);
  if (!USE_APPLICATION_V2) return;
  this.bindControls(this.element);
};

RagNarokLobbyPresetsManager.prototype.bindControls = function bindControls(target) {
  addEventListenerCompat(target, 'form[data-form="new-preset"]', "submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("presetName");
    const includeCountdown = formData.get("includeCountdown") === "on";
    await RagNarokLobby.savePreset(name, { includeCountdown });
    form.reset();
    this.render(false);
  });

  addEventListenerCompat(target, '[data-action="apply-preset"]', "click", async (event) => {
    const id = event.currentTarget.dataset.id;
    await RagNarokLobby.applyPreset(id);
  });

  addEventListenerCompat(target, '[data-action="delete-preset"]', "click", async (event) => {
    const id = event.currentTarget.dataset.id;
    const preset = RagNarokLobby.getPresets().find((entry) => entry.id === id);
    if (!preset) return;
    const safeName = RagNarokLobby.escapeHTML(preset.name);
    const confirmed = await Dialog.confirm({
      title: "Delete Preset",
      content: `<p>Are you sure you want to delete <strong>${safeName}</strong>?</p>`
    });
    if (!confirmed) return;
    await RagNarokLobby.deletePreset(id);
    this.render(false);
  });
};

class RagNarokLobbyPollManager extends RenderableApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-poll-manager",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Polls & Ready Checks",
      template: RagNarokLobby.templatePath("poll-manager.hbs"),
      width: 520,
      height: "auto",
      resizable: true
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyPollManager, {
        id: "ragnaroks-lobby-poll-manager",
        classes: ["ragnaroks-lobby"],
        window: { title: "Lobby Polls & Ready Checks", resizable: true },
        position: { width: 520 }
      })
    : mergeDefaults(RagNarokLobbyPollManager, {
        id: "ragnaroks-lobby-poll-manager",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Polls & Ready Checks",
        template: RagNarokLobby.templatePath("poll-manager.hbs"),
        width: 520,
        height: "auto",
        resizable: true
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("poll-manager.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    const poll = RagNarokLobby.pollState;
    const tallies = RagNarokLobby.computePollTallies(poll);
    const totalVotes = Object.values(tallies).reduce((sum, count) => sum + count, 0);
    const options = (poll.options || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
      votes: tallies[opt.id] ?? 0,
      percentage: totalVotes ? Math.round(((tallies[opt.id] ?? 0) / totalVotes) * 100) : 0
    }));

    const history = (RagNarokLobby.analytics.pollHistory || [])
      .slice()
      .reverse()
      .slice(0, 8)
      .map((entry) => ({
        ...entry,
        closedAtLabel: entry.closedAt ? new Date(entry.closedAt).toLocaleString() : "Unknown",
        options: entry.options?.map((opt) => ({
          text: opt.text,
          votes: opt.votes,
          percentage: entry.totalVotes ? Math.round((opt.votes / entry.totalVotes) * 100) : 0
        })) ?? [],
        totalVotes: entry.totalVotes ?? 0
      }));

    return {
      poll,
      options,
      totalVotes,
      hasActivePoll: poll.active,
      history
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (USE_APPLICATION_V2) return;
    this.bindControls(html);
  }
}

RagNarokLobbyPollManager.prototype._onRender = function _onRender(context, options) {
  RenderableApplicationBase.prototype._onRender?.call(this, context, options);
  if (!USE_APPLICATION_V2) return;
  this.bindControls(this.element);
};

RagNarokLobbyPollManager.prototype.bindControls = function bindControls(target) {
  addEventListenerCompat(target, 'form[data-form="create-poll"]', "submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const question = formData.get("question");
    const optionsInput = (formData.get("options") || "").toString();
    const options = optionsInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const created = await RagNarokLobby.createPoll({ question, options });
    if (created) {
      form.reset();
      this.render(false);
    }
  });

  addEventListenerCompat(target, '[data-action="close-poll"]', "click", async () => {
    await RagNarokLobby.closePoll();
    this.render(false);
  });

  addEventListenerCompat(target, '[data-action="refresh-poll"]', "click", () => this.render(false));
};

class RagNarokLobbyAnalyticsPanel extends RenderableApplicationBase {
  static get defaultOptions() {
    return mergeDefaults(this, {
      id: "ragnaroks-lobby-analytics",
      classes: ["ragnaroks-lobby"],
      title: "Lobby Analytics",
      template: RagNarokLobby.templatePath("analytics-panel.hbs"),
      width: 600,
      height: 620,
      resizable: true
    });
  }

  static DEFAULT_OPTIONS = USE_APPLICATION_V2
    ? mergeDefaults(RagNarokLobbyAnalyticsPanel, {
        id: "ragnaroks-lobby-analytics",
        classes: ["ragnaroks-lobby"],
        window: { title: "Lobby Analytics", resizable: true },
        position: { width: 600, height: 620 }
      })
    : mergeDefaults(RagNarokLobbyAnalyticsPanel, {
        id: "ragnaroks-lobby-analytics",
        classes: ["ragnaroks-lobby"],
        title: "Lobby Analytics",
        template: RagNarokLobby.templatePath("analytics-panel.hbs"),
        width: 600,
        height: 620,
        resizable: true
      });

  static PARTS = USE_APPLICATION_V2
    ? {
        body: { template: RagNarokLobby.templatePath("analytics-panel.hbs") }
      }
    : undefined;

  async _prepareContext(options) {
    const base = typeof super._prepareContext === "function" ? await super._prepareContext(options) : {};
    const data = await this.getData(options);
    return mergeContexts(base, data);
  }

  getData() {
    const analytics = RagNarokLobby.analytics;
    const totalMs = Number(analytics.totalActiveMs || 0);
    const totalMinutes = Math.round(totalMs / 60000);
    const activeNowMs = RagNarokLobby.currentState.isActive && analytics.lastActivatedAt
      ? Date.now() - analytics.lastActivatedAt
      : 0;

    const sessions = (analytics.sessions || [])
      .slice()
      .reverse()
      .slice(0, 10)
      .map((session) => ({
        startedAtLabel: session.startedAt ? new Date(session.startedAt).toLocaleString() : "Unknown",
        endedAtLabel: session.endedAt ? new Date(session.endedAt).toLocaleString() : "In progress",
        durationMinutes: Math.round(Number(session.duration || 0) / 60000)
      }));

    const chatLeaders = Object.values(analytics.chatStats || {})
      .map((entry) => ({
        name: entry.name,
        count: entry.count,
        lastMessageAt: entry.lastMessageAt ? new Date(entry.lastMessageAt).toLocaleString() : null
      }))
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 7);

    const pollHistory = (analytics.pollHistory || [])
      .slice()
      .reverse()
      .slice(0, 6)
      .map((entry) => ({
        question: entry.question,
        closedAtLabel: entry.closedAt ? new Date(entry.closedAt).toLocaleString() : "Unknown",
        totalVotes: entry.totalVotes ?? 0,
        topOption: entry.options?.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0))[0] || null
      }));

    return {
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      activeNowMinutes: Math.round(activeNowMs / 60000),
      countdownUses: analytics.countdownUses || 0,
      sessions,
      chatLeaders,
      pollHistory,
      hasData: totalMinutes > 0 || sessions.length > 0 || chatLeaders.length > 0
    };
  }
}

function odShi9el82() {}

RagNarokLobby.exportChatHistory = async function exportChatHistory() {
  const text = RagNarokLobby.chatMessages
    .map((entry) => `[${new Date(entry.timestamp).toLocaleString()}] ${entry.author}: ${entry.text}`)
    .join("\n");

  try {
    await navigator.clipboard.writeText(text);
    ui.notifications?.info("Lobby chat copied to clipboard");
  } catch (error) {
    console.warn("RagNarok's Lobby | Clipboard export failed", error);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lobby-chat.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }
};

// Initialize module
Hooks.on("init", () => RagNarokLobby.init());
Hooks.on("ready", () => RagNarokLobby.ready());

// Export for external access if needed
window.RagNarokLobby = RagNarokLobby;
