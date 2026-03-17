'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiStar, FiUsers, FiCoffee, FiHeart, FiClock, FiMapPin } from 'react-icons/fi';

const carouselSlides = [
  {
    titleEn: 'Crafted with Love',
    titleTh: 'ใส่ใจทุกแก้ว',
    subtitle: 'From handpicked beans to your perfect cup',
    image: 'https://perfectdailygrind.com/wp-content/uploads/2019/02/coffee-bar-1.jpg',
  },
  {
    titleEn: 'A Moment of Bliss',
    titleTh: 'ช่วงเวลาแห่งความสุข',
    subtitle: 'Relax in our minimalist atmosphere',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&h=900&fit=crop',
  },
  {
    titleEn: 'Reserve Your Spot',
    titleTh: 'จองโต๊ะล่วงหน้า',
    subtitle: 'Secure your favorite seat online',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600&h=900&fit=crop',
  },
];

const features = [
  {
    icon: <FiCoffee />,
    titleEn: 'Premium Coffee',
    titleTh: 'กาแฟพรีเมียม',
    desc: 'คัดสรรเมล็ดกาแฟอาราบิก้าแท้ คั่วสดใหม่ทุกวัน',
    color: 'from-accent to-accent-dark',
  },
  {
    icon: <FiHeart />,
    titleEn: 'Made with Care',
    titleTh: 'ใส่ใจทุกแก้ว',
    desc: 'บาริสต้ามืออาชีพ พร้อมใส่ใจทุกรายละเอียดในการชง',
    color: 'from-coffee-600 to-coffee-700',
  },
  {
    icon: <FiUsers />,
    titleEn: 'Book Online',
    titleTh: 'จองออนไลน์',
    desc: 'จองที่นั่งล่วงหน้าง่ายๆ มั่นใจว่ามีที่นั่งรอคุณ',
    color: 'from-coffee-500 to-coffee-600',
  },
  {
    icon: <FiStar />,
    titleEn: 'Unique Experience',
    titleTh: 'ประสบการณ์พิเศษ',
    desc: 'บรรยากาศมินิมอลอบอุ่น เหมาะทั้งทำงานและพักผ่อน',
    color: 'from-coffee-400 to-coffee-500',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ===== Hero Carousel ===== */}
      <section className="relative h-screen overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-110'
              }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.titleEn}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/60 via-coffee-900/40 to-coffee-900/80" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            {/* English title - Georgia */}
            <p
              key={`en-${currentSlide}`}
              className="heading-en text-accent text-lg md:text-2xl mb-3 animate-fade-in-up tracking-widest"
            >
              {carouselSlides[currentSlide].titleEn}
            </p>

            {/* Thai title */}
            <h1
              key={`title-${currentSlide}`}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 animate-fade-in-up"
              style={{ animationDelay: '0.15s' }}
            >
              {carouselSlides[currentSlide].titleTh}
            </h1>

            {/* Subtitle - English, serif */}
            <p
              key={`sub-${currentSlide}`}
              className="font-serif-en text-coffee-200 text-base md:text-xl mb-10 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {carouselSlides[currentSlide].subtitle}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: '0.45s' }}
            >
              <Link href="/reservation" className="btn-primary text-lg px-8 py-4">
                จองโต๊ะเลย <FiArrowRight />
              </Link>
              <Link href="/menu" className="btn-secondary text-lg px-8 py-4 text-white border-white/30 hover:bg-white/10">
                ดูเมนู
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${index === currentSlide
                  ? 'w-10 h-2.5 bg-accent'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 right-8 z-10 text-white/30 text-xs hidden md:flex items-center gap-3">
          <div className="w-px h-10 bg-white/20" />
          <span className="heading-en tracking-widest" style={{ writingMode: 'vertical-rl' }}>
            scroll
          </span>
        </div>
      </section>

      {/* ===== Marquee Strip ===== */}
      <div className="bg-coffee-800 py-3 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8 text-coffee-300 text-sm">
              <span className="heading-en tracking-wider">Arabica Beans</span>
              <span className="text-accent">•</span>
              <span>กาแฟสดใหม่ทุกวัน</span>
              <span className="text-accent">•</span>
              <span className="heading-en tracking-wider">Handcrafted</span>
              <span className="text-accent">•</span>
              <span>มินิมอลคาเฟ่</span>
              <span className="text-accent">•</span>
              <span className="heading-en tracking-wider">Since 2020</span>
              <span className="text-accent">•</span>
              <span>จองโต๊ะออนไลน์</span>
              <span className="text-accent">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== Features ===== */}
      <section className="py-28 px-6 coffee-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-coffee-800 mt-4">
              ทำไมต้อง <span className="text-gradient">BeanBliss</span>
            </h2>
            <div className="divider-accent mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group text-center p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  {feature.icon}
                </div>
                <h3 className="heading-en text-accent text-xs tracking-wider uppercase mb-1">
                  {feature.titleEn}
                </h3>
                <h4 className="text-lg font-semibold text-coffee-800 mb-2">
                  {feature.titleTh}
                </h4>
                <p className="text-coffee-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Image Break Section ===== */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&h=900&fit=crop"
          alt="Coffee brewing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/80 to-coffee-900/30" />
        <div className="relative z-10 h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-xl">
              <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-4 leading-tight">
                กาแฟดีๆ<br />
                <span className="font-serif-en text-coffee-200 text-2xl md:text-3xl">starts with passion</span>
              </h2>
              <p className="text-coffee-200 leading-relaxed mb-6 text-sm md:text-base">
                เราเชื่อว่ากาแฟดีๆ ไม่ใช่แค่เครื่องดื่ม แต่เป็นประสบการณ์ที่สมบูรณ์แบบ
                ตั้งแต่การคัดสรรเมล็ดกาแฟ ไปจนถึงการชงที่พิถีพิถัน
              </p>
              <Link href="/menu" className="btn-primary">
                Explore Menu <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== About / Stats ===== */}
      <section className="py-28 px-6 coffee-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mt-4 mb-3">
                BeanBliss Coffee
              </h2>
              <p className="font-serif-en text-coffee-400 text-lg mb-6">
                Where every cup tells a story
              </p>
              <p className="text-coffee-500 leading-relaxed mb-4">
                BeanBliss คือร้านกาแฟที่เกิดจากความหลงใหลในกาแฟแท้ๆ เราคัดสรรเมล็ดกาแฟจากไร่บนดอยทางภาคเหนือ
                คั่วด้วยความใส่ใจ ชงพิถีพิถันเพื่อให้ทุกแก้วเป็นประสบการณ์ที่ดีที่สุด
              </p>
              <p className="text-coffee-500 leading-relaxed mb-8">
                บรรยากาศมินิมอลของเราถูกออกแบบมาเพื่อให้คุณรู้สึกสบายผ่อนคลาย
                ไม่ว่าจะมาทำงาน พบเพื่อน หรือแค่นั่งดื่มกาแฟเงียบๆ
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-coffee-500">
                  <FiMapPin className="text-accent" />
                  <span className="text-sm">กรุงเทพมหานคร</span>
                </div>
                <div className="flex items-center gap-3 text-coffee-500">
                  <FiClock className="text-accent" />
                  <span className="text-sm">เปิดทุกวัน 07:00-21:00</span>
                </div>
              </div>
            </div>

            {/* Right - Stats + Image */}
            <div className="space-y-6">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden h-64 md:h-72">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop"
                  alt="BeanBliss interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: '5+', labelEn: 'Years', labelTh: 'ปี' },
                  { value: '20+', labelEn: 'Menu', labelTh: 'เมนู' },
                  { value: '15', labelEn: 'Tables', labelTh: 'โต๊ะ' },
                  { value: '4.9', labelEn: 'Rating', labelTh: 'คะแนน' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 text-center border border-coffee-100 hover:border-accent/30 transition-colors">
                    <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                    <div className="heading-en text-coffee-400 text-[10px] tracking-wider uppercase">{stat.labelEn}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="relative py-28 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=900&fit=crop"
          alt="Coffee atmosphere"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-coffee-900/70" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
            Ready for a Cup?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-3">
            พร้อมจิบกาแฟดีๆ แล้วหรือยัง?
          </h2>
          <p className="font-serif-en text-coffee-200 text-lg mb-10">
            Book your table and enjoy the perfect moment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation" className="btn-primary text-lg px-10 py-4">
              จองโต๊ะเลย <FiArrowRight />
            </Link>
            <Link href="/reservation/status" className="btn-secondary text-white border-white/30 hover:bg-white/10 text-lg px-10 py-4">
              เช็คสถานะจอง
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
