"use client";
import { SITE_TITLE } from "@/lib/constants";
import {
  Footer,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import Logo from "../Logo";
import styles from "./Footer.module.scss";
import clsx from "clsx";

export default function FooterCom() {
  return (
    <Footer
      container
      className={clsx(styles.footer, "border-t-8 border-teal-500")}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 ">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-6">
            <div>
              <FooterTitle title="Navigation" />
              <FooterLinkGroup col>
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/contact">Contact Us</FooterLink>
              </FooterLinkGroup>
            </div>

            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink href="/privacy-policy">
                  Privacy&nbsp;&amp;&nbsp;Cookies
                </FooterLink>

                <FooterLink href="/terms-conditions">
                  Terms&nbsp;&amp;&nbsp;Conditions
                </FooterLink>

                <FooterLink href="/privacy-controls">
                  Do&nbsp;Not&nbsp;Share&nbsp;My&nbsp;Info
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>

        <FooterDivider className="my-8 opacity-50" />

        <div className="text-center text-xs text-gray-400 leading-relaxed">
          <div>
            © {new Date().getFullYear()} {SITE_TITLE}.
          </div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </Footer>
  );
}
