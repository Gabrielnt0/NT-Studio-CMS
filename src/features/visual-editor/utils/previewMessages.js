export const PREVIEW_MESSAGE_SOURCE = "portfolio-cms-visual-editor";

export const previewMessageTypes = Object.freeze({
  ping: "PREVIEW_PING",
  ready: "PREVIEW_READY",
  applySettings: "APPLY_BUILDER_SETTINGS",
  applyProfile: "APPLY_PROFILE_DRAFT",
  applyTheme: "APPLY_THEME_DRAFT",
  selectSection: "SELECT_SECTION",
  scrollToSection: "SCROLL_TO_SECTION",
  sectionSelected: "SECTION_SELECTED",
});

export function createPreviewMessage(type, payload = {}) {
  return { source: PREVIEW_MESSAGE_SOURCE, type, payload };
}

export function isPreviewMessage(event) {
  return event?.data?.source === PREVIEW_MESSAGE_SOURCE;
}
