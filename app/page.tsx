'use client';

import { useState } from 'react';

type FormField = 'firstName' | 'phone' | 'email';
type Variant = 'desktop' | 'mobile';

const BACKGROUND = "url('/office-background.png')";

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
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errors[field]}
        </p>
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
        <div>
          <label
              htmlFor={id}
              className={isDesktop ? 'mb-1.5 block text-sm font-medium text-white/85' : 'sr-only'}
          >
            {label}
          </label>
          <input
              id={id}
              name={field}
              type={type}
              value={formData[field]}
              placeholder={isDesktop ? placeholder : label}
              autoComplete={autoComplete}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors[field])}
              className={`w-full rounded-lg border bg-black/40 px-4 text-sm text-white transition-colors duration-150 focus:border-yellow-400/70 focus:outline-none ${
                  isDesktop ? 'py-3 placeholder-white/40' : 'py-2.5 placeholder-white/60'
              } ${errors[field] ? 'border-red-500' : 'border-white/10'}`}
          />
          {renderError(field)}
        </div>
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

  const renderButton = (className: string) => (
      <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          aria-busy={isLoading}
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-yellow-400 font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-70 ${className}`}
      >
        {isLoading ? (
            <>
              {Spinner}
              SENDING…
            </>
        ) : 'GET STARTED'}
      </button>
  );

  const renderThanks = (className: string) => (
      <div className={`w-full rounded-3xl border border-white/20 bg-white/10 p-10 text-center backdrop-blur-md ${className}`}>
        <h2 className="mb-4 text-3xl font-bold text-yellow-400">Thank You!</h2>
        <p className="text-white">We have received your request and will contact you shortly.</p>
      </div>
  );

  const panelStyle = {
    background: 'rgba(136,136,136,0.12)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { font-family: 'Montserrat', sans-serif; box-sizing: border-box; }
      `}</style>

        {/* ── Desktop: imagen a pantalla completa ── */}
        <div className="hidden min-h-screen min-[1400px]:block">
          <div
              className="relative isolate flex min-h-screen overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: BACKGROUND }}
          >
            {/* Backdrop oscuro sobre toda la foto */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />

            {/* Columna derecha: logo, título y formulario */}
            <div className="relative z-10 flex w-full justify-end pr-[10%]">
              <div className="flex w-full max-w-[32rem] flex-col items-center justify-center py-12">
                <img src="/vcm_logo.webp" alt="VCM" className="h-8 w-auto" />

                {isSubmitted ? (
                    renderThanks('mt-24')
                ) : (
                    <>
                      <h1 className="mt-14 whitespace-nowrap text-center text-[3rem] font-semibold leading-tight text-white">
                        Let&apos;s get to <span className="text-yellow-400">know you</span>
                      </h1>

                      <p className="mt-3 text-center text-base text-white/90">
                        We&apos;ll use these details to schedule your free strategy call.
                      </p>

                      <div className="mt-10 w-full space-y-5 rounded-2xl p-6 shadow-2xl" style={panelStyle}>
                        {renderFields('desktop')}
                      </div>

                      {/* Botón centrado, no full width */}
                      {renderButton('mt-8 min-w-[16rem] px-16 py-3.5 text-base')}
                    </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile + Tablet: misma foto, encuadrada en los dos de la izquierda ── */}
        <div
            className="relative isolate flex min-h-svh flex-col overflow-hidden bg-cover min-[1400px]:hidden"
            style={{ backgroundImage: BACKGROUND, backgroundPosition: '18% center' }}
        >
          {/* Backdrop oscuro sobre toda la foto */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />

          {/* Bloque algo por encima del centro: deja ver a las dos personas abajo */}
          <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-[18vh] pt-16">
            <img src="/vcm_logo.webp" alt="VCM" className="h-7 w-auto" />

            {isSubmitted ? (
                renderThanks('mt-12')
            ) : (
                <>
                  <h1 className="mt-10 text-center text-[2rem] font-semibold leading-tight text-white sm:text-[2.5rem]">
                    Let&apos;s get to <span className="text-yellow-400">know you</span>
                  </h1>

                  <p className="mt-2 max-w-[28ch] text-center text-sm text-white/90">
                    We&apos;ll use these details to schedule your free strategy call.
                  </p>

                  <div className="mt-8 w-full space-y-4 rounded-2xl p-5 shadow-2xl" style={panelStyle}>
                    {renderFields('mobile')}
                  </div>

                  {/* Botón centrado, no full width */}
                  {renderButton('mt-6 min-w-[13rem] px-10 py-3 text-sm')}
                </>
            )}
          </div>
        </div>
      </>
  );
}