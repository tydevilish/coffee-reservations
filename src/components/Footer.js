import Link from 'next/link';
import { FiCoffee, FiMapPin, FiPhone, FiClock, FiMail, FiSettings } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-coffee-800 text-coffee-100 coffee-pattern">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <FiCoffee className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Bean<span className="text-coffee-300">Bliss</span>
              </span>
            </div>
            <p className="text-coffee-300 text-sm leading-relaxed">
              สัมผัสกาแฟที่ดีที่สุดในบรรยากาศสุดพิเศษ
              <br />
              ร้านกาแฟมินิมอลที่ใส่ใจทุกรายละเอียด
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">ติดต่อเรา</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-coffee-300">
                <FiMapPin className="text-accent flex-shrink-0" />
                <span>123 ถ.กาแฟสุข แขวงเมล็ดกาแฟ เขตลาเต้ กรุงเทพฯ 10110</span>
              </div>
              <div className="flex items-center gap-3 text-coffee-300">
                <FiPhone className="text-accent flex-shrink-0" />
                <span>02-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-coffee-300">
                <FiMail className="text-accent flex-shrink-0" />
                <span>hello@beanbliss.co.th</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">เวลาเปิด-ปิด</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-coffee-300">
                <FiClock className="text-accent flex-shrink-0" />
                <div>
                  <p>จันทร์ - ศุกร์: 07:00 - 21:00</p>
                  <p>เสาร์ - อาทิตย์: 08:00 - 22:00</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/reservation" className="btn-primary text-sm">
                จองโต๊ะเลย
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-coffee-700 mt-12 pt-8 flex items-center justify-between">
          <p className="text-coffee-400 text-sm">© 2026 BeanBliss Coffee. สงวนลิขสิทธิ์ทุกประการ</p>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-coffee-500 hover:text-coffee-300 text-sm transition-colors"
          >
            <FiSettings className="text-xs" />
            <span>สำหรับผู้ดูแลระบบ</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
