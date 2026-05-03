"use client";

import CookieConsent from "react-cookie-consent";
import styles from "./CookieBanner.module.scss";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      cookieName="cookie_consent"
      sameSite="lax"
      buttonText="Accept all"
      declineButtonText="Reject"
      enableDeclineButton
      containerClasses={styles["cookie-banner"]}
      contentClasses={styles["cookie-banner__content"]}
      buttonClasses={styles["cookie-banner__button"]}
      declineButtonClasses={styles["cookie-banner__button--secondary"]}
      expires={365}
      onAccept={() => {
        document.cookie =
          "cookie_consent=full; Max-Age=31536000; path=/; SameSite=Lax";

        window.gtag?.("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
      }}
      onDecline={() => {
        document.cookie =
          "cookie_consent=necessary; Max-Age=31536000; path=/; SameSite=Lax";

        window.gtag?.("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }}
    >
      <div className={styles["cookie-banner__text"]}>
        <strong>Cookies & analytics</strong>
        <span>
          We use cookies to understand site usage and improve Pixel Tech. You
          can reject non-essential cookies.
        </span>
        <a href="/privacy-policy" className={styles["cookie-banner__link"]}>
          Learn more
        </a>
      </div>
    </CookieConsent>
  );
}
