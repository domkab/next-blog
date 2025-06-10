'use client';

import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from 'flowbite-react';
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from 'react-icons/bs';
import Logo from './Logo';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Logo />
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <FooterTitle title='About' />
              <FooterLinkGroup col>
                <FooterLink
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Consumer&apos;s Prices
                </FooterLink>
              </FooterLinkGroup>
            </div>

            <div>
              <FooterTitle title='Contact' />
              <FooterLinkGroup col>
                <FooterLink href='/contact'>Contact Us</FooterLink>
              </FooterLinkGroup>
            </div>

            <div>
              <FooterTitle title='Legal' />
              <FooterLinkGroup col>
                <FooterLink href='/privacy-policy'>Privacy & Cookies</FooterLink>
                <FooterLink href='terms-conditions'>Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <FooterCopyright
            href='#'
            by="Consumer's Prices"
            year={new Date().getFullYear()}
          />
          <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
            <FooterIcon href='#' icon={BsFacebook} />
            <FooterIcon href='#' icon={BsInstagram} />
            <FooterIcon href='#' icon={BsTwitter} />
            <FooterIcon
              href='https://github.com/sahandghavidel'
              icon={BsGithub}
            />
            <FooterIcon href='#' icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}