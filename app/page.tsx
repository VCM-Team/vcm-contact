'use client';

import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion, type Variants } from 'framer-motion';

type FormField = 'firstName' | 'phone' | 'email';
type Variant = 'desktop' | 'mobile';

const BACKGROUND = "url('/vcm-background.webp')";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Variantes ─────────────────────────────── */

// Columna principal: escalona logo y formulario
const column: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
};

// Logo: baja mientras se enfoca
const logoIn: Variants = {
  hidden: { opacity: 0, y: -12, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

// Grupo del formulario: escalona título, subtítulo, panel y botón; sale con un desenfoque
const formGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
  exit: { opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.35, ease: 'easeIn' } },
};

// Título: escalona sus palabras
const title: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// Cada palabra sube desde detrás de su máscara
const word: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.85, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Panel: crece mientras aparece y escalona sus campos
const panel: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE, staggerChildren: 0.1, delayChildren: 0.25 },
  },
};

// Campo: primero el label, luego el input
const fieldGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const labelIn: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const inputIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Botón: rebote de entrada
const buttonIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
};

// Título dividido en palabras; las del final van en amarillo
const TITLE_WORDS = [
  { text: "Let's", accent: false },
  { text: 'get', accent: false },
  { text: 'to', accent: false },
  { text: 'know', accent: true },
  { text: 'you', accent: true },
];

export default function LandingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const { firstName, phone, email } = formData;

    const sanitized = {
      firstName: firstName.trim().replace(/<[^>]*>?/gm, ''),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
    };

    const newErrors = { firstName: '', phone: '', email: '' };

    // ── Nombre completo ──
    if (!sanitized.firstName || sanitized.firstName.length < 2) {
      newErrors.firstName = 'Please enter a valid name.';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(sanitized.firstName)) {
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email)) {
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

  const renderError = (field: FormField) => {
    if (!errors[field]) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-1 flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errors[field]}
        </motion.p>
    );
  };

  // Campo común a desktop y móvil.
  // Desktop: label visible encima. Móvil: label solo para lectores de pantalla; se ve el placeholder.
  // Es una función (no un componente) para que el input no se remonte y pierda el foco al escribir.
  const renderField = (
      variant: Variant,
      field: FormField,
      label: string,
      placeholder: string,
      type: string,
      autoComplete: string
  ) => {
    const id = `${variant}-${field}`;
    const isDesktop = variant === 'desktop';

    return (
        <motion.div variants={fieldGroup}>
          {isDesktop ? (
              <motion.label variants={labelIn} htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/85">
                {label}
              </motion.label>
          ) : (
              <label htmlFor={id} className="sr-only">
                {label}
              </label>
          )}

          <motion.input
              variants={inputIn}
              id={id}
              name={field}
              type={type}
              value={formData[field]}
              placeholder={isDesktop ? placeholder : label}
              autoComplete={autoComplete}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors[field])}
              className={`w-full rounded-lg border bg-black/40 px-4 text-sm text-white transition-[border-color,box-shadow] duration-200 focus:border-yellow-400/80 focus:shadow-[0_0_0_4px_rgba(250,204,21,0.15)] focus:outline-none ${
                  isDesktop ? 'py-3 placeholder-white/40' : 'py-2.5 placeholder-white/60'
              } ${errors[field] ? 'border-red-500' : 'border-white/10'}`}
          />
          {renderError(field)}
        </motion.div>
    );
  };

  const renderFields = (variant: Variant) => (
      <>
        {renderField(variant, 'firstName', 'Full name', 'John Doe', 'text', 'name')}
        {renderField(variant, 'phone', 'Phone number', '(555) 000-0000', 'tel', 'tel')}
        {renderField(variant, 'email', 'Email', 'john@company.com', 'email', 'email')}
      </>
  );

  const Spinner = (
      <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
  );

  const renderTitle = (className: string) => (
      <motion.h1 variants={title} className={className}>
        {TITLE_WORDS.map(({ text, accent }, i) => (
            <span key={text}>
              {/* Máscara: la palabra sube desde detrás de su borde inferior */}
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span variants={word} className={`inline-block ${accent ? 'text-yellow-400' : ''}`}>
                  {text}
                </motion.span>
              </span>
              {i < TITLE_WORDS.length - 1 && ' '}
            </span>
        ))}
      </motion.h1>
  );

  const renderButton = (className: string) => (
      <motion.button
          variants={buttonIn}
          whileHover={isLoading ? undefined : { y: -2 }}
          whileTap={isLoading ? undefined : { scale: 0.97 }}
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          aria-busy={isLoading}
          className={`relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-yellow-400 font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-70 ${className}`}
      >
        {/* Brillo: cruza el botón una vez, después de que aparece */}
        <motion.span
            aria-hidden
            initial={{ x: '-150%' }}
            animate={{ x: '250%' }}
            transition={{ delay: 2.2, duration: 1.1, ease: EASE }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
        <span className="relative inline-flex items-center gap-2">
          {isLoading ? (
              <>
                {Spinner}
                SENDING…
              </>
          ) : 'GET STARTED'}
        </span>
      </motion.button>
  );

  // Agradecimiento: la tarjeta aparece y el check se dibuja como un trazo
  const renderThanks = (className: string) => (
      <motion.div
          key="thanks"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`w-full rounded-3xl border border-white/20 bg-white/10 p-10 text-center backdrop-blur-md ${className}`}
      >
        <svg viewBox="0 0 52 52" className="mx-auto mb-5 size-14 text-yellow-400" fill="none" aria-hidden>
          <motion.circle
              cx="26"
              cy="26"
              r="24"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          />
          <motion.path
              d="M15 27l7 7 15-15"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
          />
        </svg>
        <h2 className="mb-4 text-3xl font-bold text-yellow-400">Thank You!</h2>
        <p className="text-white">We have received your request and will contact you shortly.</p>
      </motion.div>
  );

  const panelStyle = {
    background: 'rgba(136,136,136,0.12)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  // Fondo: zoom lento de cámara; la capa oscura se va abriendo
  const renderBackground = (backgroundPosition: string) => (
      <>
        <motion.div
            aria-hidden
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: EASE }}
            className="pointer-events-none absolute inset-0 bg-cover"
            style={{ backgroundImage: BACKGROUND, backgroundPosition }}
        />
        <motion.div
            aria-hidden
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2, ease: EASE, delay: 0.2 }}
            className="pointer-events-none absolute inset-0 bg-black"
        />
      </>
  );

  return (
      // reducedMotion="user": respeta la opción de movimiento reducido del sistema
      <MotionConfig reducedMotion="user">
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { font-family: 'Montserrat', sans-serif; box-sizing: border-box; }
      `}</style>

        {/* ── Desktop: imagen a pantalla completa ── */}
        <div className="hidden min-h-screen min-[1400px]:block">
          <div className="relative isolate flex min-h-screen overflow-hidden bg-black">
            {renderBackground('center')}

            {/* Columna derecha: logo, título y formulario */}
            <div className="relative z-10 flex w-full justify-end pr-[10%]">
              <motion.div
                  variants={column}
                  initial="hidden"
                  animate="visible"
                  className="flex w-full max-w-[32rem] flex-col items-center justify-center py-12"
              >
                <motion.img variants={logoIn} src="/vcm_logo.webp" alt="VCM" className="h-8 w-auto" />

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                      renderThanks('mt-24')
                  ) : (
                      <motion.div key="form" variants={formGroup} exit="exit" className="flex w-full flex-col items-center">
                        {renderTitle('mt-14 whitespace-nowrap text-center text-[3rem] font-semibold leading-tight text-white')}

                        <motion.p variants={fadeUp} className="mt-3 text-center text-base text-white/90">
                          We&apos;ll use these details to schedule your free strategy call.
                        </motion.p>

                        <motion.div variants={panel} className="mt-10 w-full space-y-5 rounded-2xl p-6 shadow-2xl" style={panelStyle}>
                          {renderFields('desktop')}
                        </motion.div>

                        {/* Botón centrado, no full width */}
                        {renderButton('mt-8 min-w-[16rem] px-16 py-3.5 text-base')}
                      </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Mobile + Tablet: misma foto, encuadrada en los dos de la izquierda ── */}
        <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-black min-[1400px]:hidden">
          {renderBackground('18% center')}

          {/* Bloque algo por encima del centro: deja ver a las dos personas abajo */}
          <motion.div
              variants={column}
              initial="hidden"
              animate="visible"
              className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-[18vh] pt-16"
          >
            <motion.img variants={logoIn} src="/vcm_logo.webp" alt="VCM" className="h-7 w-auto" />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                  renderThanks('mt-12')
              ) : (
                  <motion.div key="form" variants={formGroup} exit="exit" className="flex w-full flex-col items-center">
                    {renderTitle('mt-10 text-center text-[2rem] font-semibold leading-tight text-white sm:text-[2.5rem]')}

                    <motion.p variants={fadeUp} className="mt-2 max-w-[28ch] text-center text-sm text-white/90">
                      We&apos;ll use these details to schedule your free strategy call.
                    </motion.p>

                    <motion.div variants={panel} className="mt-8 w-full space-y-4 rounded-2xl p-5 shadow-2xl" style={panelStyle}>
                      {renderFields('mobile')}
                    </motion.div>

                    {/* Botón centrado, no full width */}
                    {renderButton('mt-6 min-w-[13rem] px-10 py-3 text-sm')}
                  </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </MotionConfig>
  );
}