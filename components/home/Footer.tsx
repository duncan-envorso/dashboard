import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Rugby Team</h3>
            <p>Passionate about rugby and community</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-green">Home</Link></li>
              <li><Link href="#" className="hover:text-green">About</Link></li>
              <li><Link href="#" className="hover:text-green">Team</Link></li>
              <li><Link href="#" className="hover:text-green">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green">Facebook</a>
              <a href="#" className="hover:text-green">Twitter</a>
              <a href="#" className="hover:text-green">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Rugby Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}