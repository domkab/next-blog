export {};

declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

declare namespace Gtag {
  type ControlParams = {
    groups?: string;
  };

  type EventParams = Record<string, unknown>;

  type Gtag = (
    command: 'config' | 'set' | 'js' | 'event',
    targetId: string,
    config?: ControlParams | EventParams
  ) => void;
}