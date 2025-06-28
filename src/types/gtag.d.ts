// export {};

// declare global {
//   interface Window {
//     gtag: Gtag.Gtag;
//   }
// }

// declare namespace Gtag {
//   type ControlParams = {
//     groups?: string;
//   };

//   type EventParams = Record<string, unknown>;

//   type Gtag = 
//     | ((command: 'js', config: Date) => void)
//     | ((command: 'config', targetId: string, config?: ControlParams | EventParams) => void)
//     | ((command: 'event', eventName: string, params?: EventParams) => void)
//     | ((command: 'consent', subCommand: 'default' | 'update', params: Record<string, string>) => void);
// }

// src/types/gtag.d.ts
export { };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: Gtag;
  }

  type Gtag = {
    (command: 'js', config: Date | string): void;
    (command: 'config', targetId: string, config?: Record<string, unknown>): void;
    (command: 'consent', subCommand: 'default' | 'update', consentParams: {
      ad_storage?: 'granted' | 'denied';
      analytics_storage?: 'granted' | 'denied';
      ad_user_data?: 'granted' | 'denied';
      ad_personalization?: 'granted' | 'denied';
    }): void;
    (command: 'event', eventName: string, params?: Record<string, unknown>): void;
  };
}