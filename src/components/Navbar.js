'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiCoffee } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/reservation/status', label: 'Status' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'glass shadow-lg shadow-coffee-900/5 py-3'
          : 'bg-white/50 backdrop-blur-md py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FiCoffee className="text-white text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none text-coffee-800">
              Bean<span className="text-accent">Bliss</span>
            </span>
            <span className="heading-en text-[9px] tracking-[0.2em] uppercase leading-none mt-0.5 text-coffee-400">
              coffee house
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="heading-en text-sm tracking-wider uppercase font-normal transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full text-coffee-500 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/reservation" className="btn-primary text-sm py-2.5 px-6">
            Let's book
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-coffee-700"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="glass mx-4 mt-2 rounded-2xl p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-coffee-700 hover:text-accent hover:bg-coffee-50 rounded-xl transition-all duration-200 heading-en text-sm tracking-wider uppercase"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservation"
            onClick={() => setIsOpen(false)}
            className="block text-center btn-primary mt-2"
          >
            จองเลย
          </Link>
        </div>
      </div>
    </nav>
  );
}
