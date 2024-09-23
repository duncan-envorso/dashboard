// /src/components/Header.tsx

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const menuItems = ['TICKETS', 'SCHEDULE', 'NEWS', 'TEAM', 'SHOP', 'CONTACT']

  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-primary text-2xl font-bold">
          <Image
            src="https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/01/WebLogo.png"
            alt="Chicago Hounds Logo"
            width={100}
            height={100}
          />
        </Link>
        <ul className="flex space-x-5 items-center">
          {menuItems.map((item) => (
            <li key={item}>
                          <Link
                href="#"
                className="variant='linkHover1' text-primary-foreground backdrop-blur-md bg-white/30 hover:text-primary transition-colors duration-200 uppercase font-industry font-semibold text-lg px-4 py-3 rounded-3xl hover:bg-white/40"
              >
                {item}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#"
              className="text-primary-foreground hover:text-secondary transition-colors duration-200 px-3 py-2 rounded-md bg-transparent hover:bg-primary/10"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}