import React from 'react'
import ContactUs from './_components/contact-us-form'
import Header from '@/components/home/Header'

export default function ContactUsPage() {
  return (

    <div className="container mx-auto p-4">
      <div className='mb-40'>
      <Header isTransparent={false} />
      </div>
      <div>
      <ContactUs />
      </div>
    </div>
  )
}
