'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Header({ isTransparent = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const menuItems = [
    { name: 'TICKETS', url: '/tickets' },
    { name: 'SCHEDULE', url: '/schedule' },
    { name: 'NEWS', url: '/news' },
    { name: 'TEAM', url: '/team' },
    { name: 'SHOP', url: 'https://www.chicagohounds.com/shop/' },
    { name: 'CONTACT', url: '/contact' }
  ]

  const socialIcons = [
    { Icon: Facebook, url: 'https://web.facebook.com/ChicagoHoundsRugby', label: 'Facebook' },
    { Icon: Twitter, url: 'https://x.com/HoundsChicago', label: 'Twitter' },
    { Icon: Instagram, url: 'https://www.instagram.com/chicagohoundsrugby', label: 'Instagram' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerBackground = isTransparent
    ? isScrolled ? 'bg-secondary/60 backdrop-blur-md' : 'bg-transparent'
    : 'bg-secondary/90 backdrop-blur-md'

  const textColor = isTransparent && !isScrolled
    ? 'text-primary-foreground'
    : 'text-primary-foreground'

  return (
    <div className='mb-10'>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBackground}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/01/WebLogo.png"
              alt="Chicago Hounds Logo"
              width={60}
              height={60}
              className="rounded-full bg-white p-1"
            />
            <span className={`text-2xl font-bold tracking-tighter hidden sm:inline ${textColor}`}>
              Chicago Hounds
            </span>
          </Link>
          <nav className="hidden md:flex items-center">
            <div className="flex space-x-1">
              {menuItems.map((item) => (
                <Link href={item.url} key={item.name}>
                  <Button
                    variant="ghost"
                    className={`text-lg font-medium ${textColor} hover:text-primary hover:bg-primary-foreground/10`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`ml-2 ${textColor} hover:text-primary hover:bg-primary-foreground/10`}
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Separator orientation="vertical" className="mx-4 h-6 bg-primary-foreground/20" />
            <div className="flex space-x-2">
              {socialIcons.map(({ Icon, url, label }) => (
                <Link href={url} key={label} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-accent/10 text-accent hover:bg-accent/20 hover:text-accent"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${textColor} hover:text-primary hover:bg-primary-foreground/10`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-primary/90 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-2 flex flex-col">
            {menuItems.map((item) => (
              <Link href={item.url} key={item.name}>
                <Button
                  variant="ghost"
                  className="justify-start text-primary-foreground hover:text-primary hover:bg-primary-foreground w-full"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <Link href="/cart">
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:text-primary hover:bg-primary-foreground w-full"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Cart</span>
              </Button>
            </Link>
            <Separator className="my-4 bg-primary-foreground/20" />
            <div className="flex justify-center space-x-4">
              {socialIcons.map(({ Icon, url, label }) => (
                <Link href={url} key={label} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-accent/10 text-accent hover:bg-accent/20 hover:text-accent"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
    </div>
  )
}