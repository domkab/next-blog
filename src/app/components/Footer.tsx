'use client';

import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
  Modal,
} from 'flowbite-react';
import Logo from './Logo';
import { BsEnvelope } from 'react-icons/bs';

import { useState } from 'react';
import EmailSubscribeModalAlone from './CallToAction/EmailSubscribeModalAlone';


export default function FooterCom() {
  const [open, setOpen] = useState(false); // State to control modal visibility

  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full md:justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Logo />
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
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
                  Do&nbsp;Not&nbsp;Sell&nbsp;/&nbsp;Share&nbsp;My&nbsp;Info
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <FooterCopyright
            href='#'
            by="© Consumer’s Prices, All rights reserved"
            year={new Date().getFullYear()}
          />
          <div className="flex items-center gap-2 mt-4 sm:mt-0 text-sm text-gray-500">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 mt-4 sm:mt-0 text-sm text-teal-600 hover:text-teal-800 transition"
            >
              <span>Join our newsletter</span>
              <BsEnvelope size={20} />
            </button>
          </div>
        </div>
      </div>
      <Modal show={open} onClose={() => setOpen(false)} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <EmailSubscribeModalAlone open={open} onClose={() => setOpen(false)} />
        </Modal.Body>
      </Modal>
    </Footer>
  );
}