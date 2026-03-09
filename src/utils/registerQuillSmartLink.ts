"use client";

type LinkConstructor = {
  new (...args: never[]): {
    domNode?: HTMLElement;
  };
  sanitize(url: string): string;
  create(value: string): HTMLAnchorElement;
};

let isRegistered = false;

export async function registerQuillSmartLink() {
  if (isRegistered || typeof window === "undefined") return;

  const QuillModule = await import("quill");
  const Quill = QuillModule.default;

  const Link = Quill.import("formats/link") as LinkConstructor;

  class SmartLink extends Link  {
    static sanitize(url: string) {
      if (!url) return url;

      const trimmed = url.trim();

      if (
        trimmed.startsWith("/") ||
        trimmed.startsWith("#") ||
        trimmed.startsWith("./") ||
        trimmed.startsWith("../")
      ) {
        return trimmed;
      }

      if (/^(https?:)?\/\//i.test(trimmed)) {
        return trimmed;
      }

      return `https://${trimmed}`;
    }

    static create(value: string) {
      const normalized = this.sanitize(value);
      const node = super.create(normalized) as HTMLAnchorElement;

      node.setAttribute("href", normalized);

      const isInternal =
        normalized.startsWith("/") ||
        normalized.startsWith("#") ||
        normalized.startsWith("./") ||
        normalized.startsWith("../");

      if (!isInternal) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      } else {
        node.removeAttribute("target");
        node.removeAttribute("rel");
      }

      return node;
    }
  }

  Quill.register("formats/link", SmartLink, true);
  isRegistered = true;
}
