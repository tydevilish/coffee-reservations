'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiArrowLeft, FiStar, FiUsers, FiCoffee, FiHeart, FiClock, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const carouselSlides = [
  {
    tag: 'Specialty Coffee & Bakery',
    titleEn: 'Morning\nRitual',
    desc: 'เริ่มต้นวันใหม่กับกาแฟอาราบิก้าแท้ คัดสรรจากไร่บนดอย คั่วสดใหม่ทุกวัน พร้อมเสิร์ฟด้วยความใส่ใจ',
    cta: { label: 'View Menu →', href: '/menu' },
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1200&fit=crop',
  },
  {
    tag: 'Book Your Table',
    titleEn: 'Reserve\nYour Spot',
    desc: 'จองโต๊ะล่วงหน้าง่ายๆ ผ่านระบบออนไลน์ เลือกโซนที่ชอบ มั่นใจว่ามีที่นั่งรอคุณเสมอ',
    cta: { label: 'Reserve Now →', href: '/reservation' },
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&h=1200&fit=crop',
  },
  {
    tag: 'Handcrafted With Love',
    titleEn: 'A Moment\nof Bliss',
    desc: 'ผ่อนคลายในบรรยากาศมินิมอล ดื่มด่ำกาแฟที่ชงอย่างพิถีพิถัน ประสบการณ์ที่คุณจะหลงรัก',
    cta: { label: 'View Menu →', href: '/menu' },
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1000&h=1200&fit=crop',
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
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  }

  const slide = carouselSlides[currentSlide];

  return (
    <>
      {/* ===== Hero — Split Layout ===== */}
      <section className="relative min-h-screen lg:h-screen flex flex-col lg:flex-row">
        {/* Left Side — Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 xl:px-28 pt-28 pb-12 lg:pt-24 lg:pb-20 bg-background relative z-10">
          {/* Tag */}
          <div
            key={`tag-${currentSlide}`}
            className="animate-fade-in-up"
          >
            <span className="inline-block heading-en text-[11px] tracking-[0.25em] uppercase text-white bg-coffee-800 px-4 py-2 rounded-full mb-8">
              {slide.tag}
            </span>
          </div>

          {/* Title — Large serif */}
          <h1
            key={`title-${currentSlide}`}
            className="heading-en text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-coffee-900 leading-[0.95] mb-8 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            {slide.titleEn.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p
            key={`desc-${currentSlide}`}
            className="text-coffee-500 text-sm md:text-base leading-relaxed max-w-md mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {slide.desc}
          </p>

          {/* CTA Button */}
          <div
            key={`cta-${currentSlide}`}
            className="animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-2 bg-coffee-900 text-white heading-en text-sm tracking-wider px-8 py-4 rounded-full hover:bg-coffee-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              {slide.cta.label}
            </Link>
          </div>

          {/* Bottom controls — only on desktop */}
          <div className="hidden lg:flex absolute bottom-10 left-8 md:left-16 lg:left-20 xl:left-28 items-center gap-6">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-500 rounded-full ${index === currentSlide
                      ? 'w-8 h-2 bg-coffee-800'
                      : 'w-2 h-2 bg-coffee-300 hover:bg-coffee-400'
                    }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side — Image (desktop: side, mobile: below text) */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden">
          {carouselSlides.map((s, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
                }`}
            >
              <img
                src={s.image}
                alt={s.titleEn}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-10 flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all bg-black/20 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all bg-black/20 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <FiChevronRight size={18} />
            </button>
          </div>

          {/* Mobile dots overlay */}
          <div className="lg:hidden absolute bottom-6 left-6 z-10 flex items-center gap-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 rounded-full ${index === currentSlide
                    ? 'w-7 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/5 pointer-events-none hidden lg:block" />
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
            <Link href="/reservation/status" className="bg-coffee-400 rounded-full transition duration-500 text-white border-white/30 hover:bg-coffee-500 text-lg px-10 py-4 hover:scale-105 hover:shadow-sm">
              เช็คสถานะจอง
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
