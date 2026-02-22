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
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid w-full md:justify-between sm:flex md:grid-cols-1">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-6">
            <div>
              <FooterTitle title="Blog" />
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
        <FooterDivider />
        <div className="footer__copyright w-full sm:flex sm:items-center sm:justify-between text-center">
          <div className="w-full text-center text-sm text-gray-400 leading-relaxed">
            <span className="block sm:inline">
              © {new Date().getFullYear()} {SITE_TITLE}.
            </span>
            <span className="block sm:inline sm:ml-1">
              All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </Footer>
  );
}
