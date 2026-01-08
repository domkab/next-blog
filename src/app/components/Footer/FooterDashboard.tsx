'use client';

import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from 'flowbite-react';
import Logo from '../Logo';
import { SITE_TITLE } from '@/lib/constants';

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-5xl mx-auto'>
        <div className='grid w-full md:justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Logo />
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-2 sm:gap-6'>
            <div>
              <FooterTitle title="Blog" />
              <FooterLinkGroup col>
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/contact">Contact Us</FooterLink>
              </FooterLinkGroup>
            </div>

            <div>
              <FooterTitle title='Legal' />
              <FooterLinkGroup col>
                <FooterLink href='/privacy-policy'>
                  Privacy&nbsp;&amp;&nbsp;Cookies
                </FooterLink>

                <FooterLink href='/terms-conditions'>
                  Terms&nbsp;&amp;&nbsp;Conditions
                </FooterLink>

                <FooterLink href='/privacy-controls'>
                  Do&nbsp;Not&nbsp;Share&nbsp;My&nbsp;Info
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <FooterCopyright
            href='#'
            by={`© ${SITE_TITLE}, All rights reserved`}
            year={new Date().getFullYear()}
          />
        </div>
      </div>
    </Footer>
  );
}