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
  const [open, setOpen] = useState(-1);

  return (
    <section style={{
      background: '#F7F4EF',
      padding: '64px 40px',
      fontFamily: "'Inter', sans-serif",
      borderTop: '1px solid #EDE0D4',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .faq-item {
          border-bottom: 1px solid #EDE0D4;
          position: relative;
          cursor: pointer;
          transition: background 0.2s, border-left 0.2s;
        }
        .faq-item:first-child { border-top: 1px solid #EDE0D4; }

        .faq-item.is-open {
          background: #fff;
          border-left: 3px solid ${ORANGE};
          padding-left: 16px;
        }

        .faq-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
        }

        .faq-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #0d0d0d;
          min-width: 26px;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .faq-item.is-open .faq-num { color: ${ORANGE}; }

        .faq-q {
          flex: 1;
          font-size: 15px;
          font-weight: 700;
          color: #1A1209;
          line-height: 1.4;
          margin: 0;
          transition: color 0.2s;
        }
        .faq-item.is-open .faq-q { color: ${ORANGE}; }

        .faq-toggle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1.5px solid #080808;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #F7F4EF;
          transition: background 0.2s, border-color 0.2s;
        }
        .faq-item.is-open .faq-toggle {
          background: ${ORANGE};
          border-color: ${ORANGE};
        }
        .faq-toggle svg { transition: transform 0.3s ease; }
        .faq-item.is-open .faq-toggle svg { transform: rotate(45deg); }

        .faq-answer {
          padding: 0 0 20px 42px;
          font-size: 14px;
          color: #6B6055;
          line-height: 1.8;
          animation: answerSlide 0.2s ease both;
        }

        @keyframes answerSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .contact-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1.5px solid #EDE0D4;
          background: #F7F4EF;
          flex: 1;
          transition: all 0.2s;
          cursor: pointer;
        }
      
        .contact-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          section { padding: 48px 20px !important; }
          h2.faq-heading { font-size: 1.8rem !important; }
          .contact-inner { flex-direction: column !important; align-items: flex-start !important; }
          .faq-divider { display: none !important; }
          .contact-btns { flex-wrap: nowrap !important; }
          .contact-btn { padding: 10px 12px !important; gap: 8px !important; min-width: 0 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: ORANGE, fontWeight: 700, marginBottom: 14,
          }}>
            <span>Have Questions</span>
            <span style={{ display: 'inline-block', width: 32, height: 2, background: ORANGE, borderRadius: 2 }} />
          </div>

          <h2 className="faq-heading" style={{
            fontSize: '2.4rem', fontWeight: 600, color: '#1A1209',
            lineHeight: 1.1, margin: '0 0 10px',
          }}>
            Frequently Asked{' '}
            <em style={{ fontWeight: 400, fontStyle: 'italic', color: ORANGE }}>Questions</em>
          </h2>
          <p style={{ margin: 0, color: '#6B6055', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: 400 }}>
            Everything you need to know about buying and selling
            premium pre-owned vehicles through Syed Cars.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ marginBottom: 24 }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`faq-item${isOpen ? ' is-open' : ''}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div className="faq-row">
                  <span className="faq-num">{String(i + 1).padStart(1, '0')}</span>
                  <p className="faq-q">{faq.question}</p>
                  <div className="faq-toggle">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <line x1="6" y1="1" x2="6" y2="11" stroke={isOpen ? '#fff' : '#050505'} strokeWidth="1.8" strokeLinecap="round"/>
                      <line x1="1" y1="6" x2="11" y2="6" stroke={isOpen ? '#fff' : '#0a0a0a'} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                {isOpen && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div style={{
          border: '1.5px solid #EDE0D4', borderRadius: 14,
          padding: '24px 28px', background: '#F7F4EF',
        }}>
          <div className="contact-inner" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#FFF2EC', border: '2px solid #F0D0BA',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 700, color: '#1A1209' }}>Still have questions?</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#565454' }}>Our team is happy to help.</p>
              </div>
            </div>

            <div className="faq-divider" style={{ width: 1, height: 48, background: '#EDE0D4', flexShrink: 0 }} />

            <div className="contact-btns" style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>

              <div className="contact-btn">
                <div className="contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={ORANGE}>
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: '0 0 1px', fontSize: '0.75rem', fontWeight: 600, color: '#1A1209' }}>Call Us</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: ORANGE }}>+91 91234 56789</p>
                </div>
              </div>

              <div className="contact-btn">
                <div className="contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={ORANGE}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: '0 0 1px', fontSize: '0.75rem', fontWeight: 600, color: '#1A1209' }}>Chat on WhatsApp</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#292828' }}>Get instant support</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}