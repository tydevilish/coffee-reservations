import Link from 'next/link';
import { FiCoffee, FiMapPin, FiPhone, FiClock, FiMail, FiSettings, FiInstagram, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-coffee-900 text-coffee-100 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <FiCoffee className="text-white text-lg" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight block leading-none">
                  Bean<span className="text-coffee-300">Bliss</span>
                </span>
                <span className="heading-en text-[9px] tracking-[0.2em] uppercase text-coffee-500 leading-none">
                  coffee house
                </span>
              </div>
            </div>
            <p className="text-coffee-400 text-sm leading-relaxed mb-5">
              สัมผัสกาแฟที่ดีที่สุด ในบรรยากาศมินิมอลสุดพิเศษ
            </p>
            <p className="font-serif-en text-coffee-500 text-sm">
              &ldquo;Life begins after coffee&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading-en text-accent text-xs tracking-[0.2em] uppercase mb-5">Quick Links</h3>
            <div className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Our Menu' },
                { href: '/reservation', label: 'Reservation' },
                { href: '/reservation/status', label: 'Check Status' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-coffee-400 hover:text-accent text-sm transition-colors heading-en tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="heading-en text-accent text-xs tracking-[0.2em] uppercase mb-5">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-coffee-400">
                <FiMapPin className="text-accent flex-shrink-0 mt-1" />
                <span>123 ถ.กาแฟสุข แขวงเมล็ดกาแฟ เขตลาเต้ กรุงเทพฯ 10110</span>
              </div>
              <div className="flex items-center gap-3 text-coffee-400">
                <FiPhone className="text-accent flex-shrink-0" />
                <span>02-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-coffee-400">
                <FiMail className="text-accent flex-shrink-0" />
                <span>hello@beanbliss.co.th</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="heading-en text-accent text-xs tracking-[0.2em] uppercase mb-5">Opening Hours</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-coffee-400">
                <FiClock className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p>จันทร์ - ศุกร์: 07:00 - 21:00</p>
                  <p>เสาร์ - อาทิตย์: 08:00 - 22:00</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/reservation" className="btn-primary text-sm py-2.5">
                Reserve a Table <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-coffee-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-coffee-600 text-xs heading-en tracking-wider">
            &copy; 2026 BeanBliss Coffee. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-coffee-600 hover:text-coffee-400 text-xs transition-colors heading-en tracking-wider"
          >
            <FiSettings className="text-[10px]" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
