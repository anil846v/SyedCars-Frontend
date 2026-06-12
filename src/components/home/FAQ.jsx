import { useState } from 'react';

const ORANGE = '#E8631A';

const faqs = [
  {
    question: "How do I list my car for sale on Syed Cars?",
    answer: "Click 'Sell Your Car', fill in your vehicle details, upload clear photos, and our team will verify and publish your listing within 24 hours. No hidden steps.",
  },
  {
    question: "Are all listings verified before going live?",
    answer: "Yes. Every listing goes through our verification process — we check ownership documents, service history, and vehicle condition before it appears on the platform.",
  },
  {
    question: "What commission do you charge for selling a car?",
    answer: "We charge a fair, transparent commission only after your car is successfully sold. There are no upfront fees. Our team will walk you through the exact rates during onboarding.",
  },
  {
    question: "How long does it typically take to sell my car?",
    answer: "Most cars sell within 7–14 days depending on the model, condition, and price. Listings with professional photos and complete documentation tend to close faster.",
  },
  {
    question: "Can I buy a car from a different city?",
    answer: "Absolutely. We handle all documentation and can assist with inspection visits or transport arrangements for outstation buyers.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section style={{
      background: '#F7F4EF',
      padding: '88px 60px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid #EDE0D4',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        @keyframes faqFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes answerSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .faq-header { animation: faqFadeUp 0.55s ease both; }
        .faq-accordion { animation: faqFadeUp 0.55s ease 0.1s both; }
        .faq-contact { animation: faqFadeUp 0.55s ease 0.2s both; }

        .faq-item {
          border-bottom: 1px solid #EDE0D4;
          background: #F7F4EF;
          transition: background 0.25s ease;
          cursor: pointer;
          position: relative;
        }
        .faq-item:first-child {
          border-top: 1px solid #EDE0D4;
        }
        .faq-item.is-open {
          background: #FFF8F4;
        }
        .faq-item-inner {
          padding: 22px 0;
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }
        .faq-index {
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', monospace;
          letter-spacing: 0.08em;
          color: #ccc;
          padding-top: 3px;
          min-width: 28px;
          transition: color 0.25s ease;
        }
        .faq-item.is-open .faq-index {
          color: ${ORANGE};
        }
        .faq-question {
          flex: 1;
          font-size: 16px;
          font-weight: 700;
          color: #1A1209;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
          transition: color 0.25s ease;
          margin: 0;
        }
        .faq-item.is-open .faq-question {
          color: ${ORANGE};
        }
        .faq-toggle {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #EDE0D4;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F7F4EF;
        }
        .faq-item.is-open .faq-toggle {
          background: ${ORANGE};
          border-color: ${ORANGE};
        }
        .faq-toggle svg {
          transition: transform 0.3s ease;
        }
        .faq-item.is-open .faq-toggle svg {
          transform: rotate(45deg);
        }
        .faq-answer {
          padding: 0 0 22px 46px;
          font-size: 14.5px;
          color: #6B6055;
          line-height: 1.8;
          font-family: 'Inter', sans-serif;
          animation: answerSlide 0.25s ease both;
        }
        .faq-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: ${ORANGE};
          transition: width 0.4s ease;
          border-radius: 0 2px 2px 0;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-radius: 10px;
          border: 1.5px solid #EDE0D4;
          background: #F7F4EF;
          flex: 1;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .contact-btn:hover {
          border-color: ${ORANGE};
          background: #FFF8F4;
          box-shadow: 0 6px 20px rgba(232,99,26,0.10);
          transform: translateY(-2px);
        }
        .contact-btn:hover .contact-icon {
          background: ${ORANGE};
        }
        .contact-btn:hover .contact-icon svg {
          fill: #fff;
        }
        .contact-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.25s ease;
        }
        .contact-icon svg {
          transition: fill 0.25s ease;
        }

        @media (max-width: 768px) {
          section { padding: 60px 20px !important; }
          .faq-contact-inner { flex-direction: column !important; gap: 14px !important; }
          .faq-divider { display: none !important; }
        }
      `}</style>

      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: 340,
        height: 340,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,99,26,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="faq-header" style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: ORANGE,
            fontWeight: 700,
            marginBottom: 16,
            fontFamily: "'Inter', sans-serif",
          }}>
            <span>Have Questions</span>
            <span style={{ display: 'inline-block', width: 36, height: 2, background: ORANGE, borderRadius: 2 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h2 style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                color: '#1A1209',
                margin: '0 0 12px',
                lineHeight: 1.1,
                fontFamily: "'Inter', sans-serif",
              }}>
                Frequently Asked{' '}
                <span style={{ fontWeight: 400, fontStyle: 'italic', color: ORANGE }}>Questions</span>
              </h2>
              <p style={{
                margin: 0,
                color: '#6B6055',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                maxWidth: 420,
                fontFamily: "'Inter', sans-serif",
              }}>
                Everything you need to know about buying and selling
                premium pre-owned vehicles through Syed Cars.
              </p>
            </div>
          </div>
        </div>

        {/* ── Accordion ── */}
        <div className="faq-accordion" style={{ marginBottom: 28 }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`faq-item${isOpen ? ' is-open' : ''}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {/* Progress bar on open */}
                <div className="faq-progress-bar" style={{ width: isOpen ? '100%' : '0%' }} />

                <div className="faq-item-inner">
                  {/* Index */}
                  <span className="faq-index">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Question */}
                  <p className="faq-question">{faq.question}</p>

                  {/* Toggle icon */}
                  <div className="faq-toggle">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="6" y1="1" x2="6" y2="11" stroke={isOpen ? '#fff' : '#aaa'} strokeWidth="1.8" strokeLinecap="round"/>
                      <line x1="1" y1="6" x2="11" y2="6" stroke={isOpen ? '#fff' : '#aaa'} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Still have questions card ── */}
        <div className="faq-contact" style={{
          border: '1.5px solid #EDE0D4',
          borderRadius: 14,
          padding: '28px 32px',
          background: '#F7F4EF',
        }}>
          <div className="faq-contact-inner" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>

            {/* Icon + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '0 0 auto', minWidth: 200 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#FFF2EC',
                border: `2px solid #F0D0BA`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: '1rem', fontWeight: 700, color: '#1A1209', fontFamily: "'Inter', sans-serif" }}>
                  Still have questions?
                </p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#888', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                  Our team is happy to help.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="faq-divider" style={{ width: 1, height: 52, background: '#EDE0D4', flexShrink: 0 }} />

            {/* Contact buttons */}
            <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>

              {/* Call Us */}
              <div className="contact-btn">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={ORANGE}>
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontWeight: 600, color: '#1A1209', fontFamily: "'Inter', sans-serif" }}>Call Us</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: ORANGE, fontFamily: "'Inter', sans-serif" }}>+91 91234 56789</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="contact-btn">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={ORANGE}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontWeight: 600, color: '#1A1209', fontFamily: "'Inter', sans-serif" }}>Chat on WhatsApp</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#888', fontFamily: "'Inter', sans-serif" }}>Get instant support</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}