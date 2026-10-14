'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
  });
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const { firstName, phone, email } = formData;

    const sanitized = {
      firstName: firstName.trim().replace(/<[^>]*>?/gm, ''),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
    };

    const newErrors = {
      firstName: '',
      phone: '',
      email: '',
    };

    // ── Nombre completo ──
    if (!sanitized.firstName || sanitized.firstName.length < 2) {
      newErrors.firstName = 'Please enter a valid name.';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+\$/.test(sanitized.firstName)) {
      newErrors.firstName = 'Name must contain only letters.';
    } else if (sanitized.firstName.length > 60) {
      newErrors.firstName = 'Name is too long (max 60 characters).';
    }

    // ── Teléfono ──
    const rawPhone = sanitized.phone.replace(/\D/g, '');
    if (!rawPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (rawPhone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits.';
    } else if (rawPhone.length > 15) {
      newErrors.phone = 'Phone number is too long.';
    }

    // ── Email ──
    if (!sanitized.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+\$/.test(sanitized.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return null;
    }

    return sanitized;
  };

  const handleSubmit = async () => {
    const cleanData = validateForm();
    if (!cleanData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) throw new Error('Error en el envío');
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('There was an error sending the form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    {
      stars: 5,
      title: 'They came out quickly and did a great job.',
      body: '"We have used them in the past for larger projects, and have always been pleased."',
      author: '- Darrell T.',
    },
    {
      stars: 5,
      title: 'Would definitely recommend them.',
      body: '"They finished the work in one day, and the new roof looks great!"',
      author: '- Melinda T.',
    },
    {
      stars: 5,
      title: "Can't thank you enough!",
      body: '"Peter helped me through the whole process and was able to replace my entire roof!"',
      author: '- Yawar K.',
    },
  ];

  const inputClass = (field: keyof typeof errors) =>
      `w-full p-3 rounded-lg text-white placeholder-white border ${
          errors[field] ? 'border-red-500' : 'border-white/10'
      } bg-black/30 focus:outline-none focus:border-yellow-400/70 transition-colors duration-150`;

  const renderError = (field: keyof typeof errors) => {
    if (!errors[field]) return null;
    return (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errors[field]}
        </p>
    );
  };

  const StarRow = ({ count }: { count: number }) => (
      <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, s) => (
            <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FACC15">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ))}
      </div>
  );

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { font-family: 'Montserrat', sans-serif; box-sizing: border-box; }
        .carousel-track {
            display: flex;
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

        {/* ── Desktop background ── */}
        <div
            className="relative min-h-screen bg-cover bg-center flex flex-col hidden min-[1400px]:flex"
            style={{ backgroundImage: "url('/contact-desktop-background.webp')" }}
        >
          <nav className="relative z-30 w-full py-6 px-6">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <div className="flex justify-start">
                  <img src="/vcm_logo.webp" alt="Advanced Logo" className="h-10 w-auto" />
                </div>
              </div>
            </div>
          </nav>

          <main className="relative z-10 flex-grow flex flex-col">
            <div className="flex flex-grow max-w-[1500px] mx-auto w-full px-6 pt-4 gap-8 items-stretch">
              {/* LEFT — Testimonials */}
              <div className="flex-1 flex flex-col justify-end pb-10">
                <div className="flex items-end gap-4 mb-[30px]">
                  {testimonials.map((t, i) => (
                      <div
                          key={i}
                          className="w-52 rounded-xl p-4 flex flex-col h-[220px] flex-shrink-0"
                          style={{ background: 'rgba(81,81,81,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <StarRow count={t.stars} />
                        <p className="text-white font-bold text-sm leading-snug mt-3 mb-3">{t.title}</p>
                        <p className="text-white text-xs leading-relaxed flex-grow">{t.body}</p>
                        <p className="text-[#F3C200] text-xs font-semibold mt-3">{t.author}</p>
                      </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Headline + Form */}
              <div className="flex flex-col gap-5 w-full max-w-[676px] ml-auto pt-2 pb-10">
                {isSubmitted ? (
                    <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center border border-white/20">
                      <h2 className="text-yellow-400 text-3xl font-bold mb-4">Thank You!</h2>
                      <p className="text-white">We have received your request and will contact you shortly.</p>
                    </div>
                ) : (
                    <>
                      <h1
                          className="text-white font-semibold text-center leading-tight tracking-[0.08em]"
                          style={{ fontSize: 'clamp(2.3rem, 4.4vw, 3.4rem)', lineHeight: '1.1' }}
                      >
                        Schedule your <span className="text-yellow-400">FREE</span>
                        <br />
                        <span className="text-yellow-400">INSPECTION</span> now!
                      </h1>

                      <div className="w-full rounded-3xl p-6 space-y-4 shadow-2xl" style={{ background: 'rgba(136,136,136,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                          <input name="firstName" placeholder="Full name" onChange={handleInputChange} className={inputClass('firstName')} />
                          {renderError('firstName')}
                        </div>
                        <div>
                          <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className={inputClass('email')} />
                          {renderError('email')}
                        </div>
                        <div>
                          <input name="phone" placeholder="Phone number" onChange={handleInputChange} className={inputClass('phone')} />
                          {renderError('phone')}
                        </div>
                      </div>

                      <button
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="bg-yellow-400 cursor-pointer hover:bg-yellow-300 text-black font-bold text-base uppercase tracking-widest px-10 py-3 rounded-full transition-all shadow-lg w-full flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : "GET STARTED"}
                      </button>

                      <div className="flex flex-col items-center gap-3 mt-2">
                        <motion.a
                            href="tel:8478924878"
                            className="flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-all"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(15px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-white/90 font-medium text-lg">Or call us</span>
                          <motion.div
                              animate={{ rotate: [0, -15, 15, -15, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                          >
                            <Phone size={18} className="text-yellow-400 fill-yellow-400" />
                          </motion.div>
                          <span className="text-white font-bold tracking-wide text-lg">847-892-4878</span>
                        </motion.a>
                      </div>
                    </>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* ── Mobile + Tablet background ── */}
        <div
            className="relative min-h-screen bg-cover bg-center flex flex-col min-[1400px]:hidden"
            style={{ backgroundImage: "url('/contact-mobile-background.webp')" }}
        >
          <nav className="relative z-30 w-full py-4 px-5">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-center mt-5">
                  <img src="/vcm_logo.webp" alt="Advanced Logo" className="h-9 w-auto" />
                </div>
              </div>
            </div>
          </nav>

          <main className="relative z-10 flex-grow flex flex-col">
            <div className="flex flex-col w-full max-w-lg mx-auto px-5 pt-2 pb-8 gap-5">
              {isSubmitted ? (
                  <div className="bg-white/10 backdrop-blur-sm p-10 rounded-3xl text-center border border-white/20">
                    <h2 className="text-yellow-400 text-3xl font-bold mb-4">Thank You!</h2>
                    <p className="text-white">We have received your request and will contact you shortly.</p>
                  </div>
              ) : (
                  <>
                    <h1 className="text-white mt-4 font-semibold text-center" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', lineHeight: '1.15' }}>
                      Schedule your <span className="text-yellow-400">FREE</span>
                      <br />
                      <span className="text-yellow-400">INSPECTION</span> now!
                    </h1>

                    <div
                        className="w-full rounded-3xl p-5 space-y-3 shadow-2xl"
                        style={{ background: 'rgba(136,136,136,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div>
                        <input name="firstName" placeholder="Full name" onChange={handleInputChange} className={inputClass('firstName')} />
                        {renderError('firstName')}
                      </div>
                      <div>
                        <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className={inputClass('email')} />
                        {renderError('email')}
                      </div>
                      <div>
                        <input name="phone" placeholder="Phone number" onChange={handleInputChange} className={inputClass('phone')} />
                        {renderError('phone')}
                      </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-yellow-400 cursor-pointer hover:bg-yellow-300 text-black font-semibold text-md uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-lg w-full flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                      ) : "GET STARTED"}
                    </button>

                    <div className="flex flex-col items-center gap-3 mt-2">
                      <motion.a
                          href="tel:8478924878"
                          className="flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-all"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-white/90 font-medium text-md">Or call us</span>
                        <motion.div
                            animate={{ rotate: [0, -15, 15, -15, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                        >
                          <Phone size={18} className="text-yellow-400 fill-yellow-400" />
                        </motion.div>
                        <span className="text-white font-bold tracking-wide text-md">847-892-4878</span>
                      </motion.a>
                    </div>
                  </>
              )}

              {/* Testimonials carousel */}
              <div className="w-full mt-2">
                <div className="overflow-hidden rounded-2xl">
                  <div
                      className="carousel-track"
                      style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="min-w-full p-5 flex flex-col gap-3"
                            style={{
                              background: 'rgba(81,81,81,0.12)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '1rem',
                            }}
                        >
                          <StarRow count={t.stars} />
                          <p className="text-white font-bold text-sm leading-snug">{t.title}</p>
                          <p className="text-white/80 text-xs leading-relaxed">{t.body}</p>
                          <p className="text-[#F3C200] text-xs font-semibold">{t.author}</p>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                      onClick={() => setActiveSlide((p) => Math.max(0, p - 1))}
                      className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
                      disabled={activeSlide === 0}
                      aria-label="Previous"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSlide(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                              width: activeSlide === i ? '24px' : '8px',
                              height: '8px',
                              background: activeSlide === i ? '#FACC15' : 'rgba(255,255,255,0.35)',
                            }}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                  </div>

                  <button
                      onClick={() => setActiveSlide((p) => Math.min(testimonials.length - 1, p + 1))}
                      className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
                      disabled={activeSlide === testimonials.length - 1}
                      aria-label="Next"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
  );
}