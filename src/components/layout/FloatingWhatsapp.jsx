import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsapp() {
  return (
    <>
      <a
        href="https://wa.me/919177565639"
        target="_blank"
        rel="noreferrer"
        className="floating-wa"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>

      <style>{`
        .floating-wa{
          position:fixed;
          right:18px;
          bottom:18px;

          width:62px;
          height:62px;

          background:#25D366;
          color:white;

          border-radius:999px;

          display:flex;
          align-items:center;
          justify-content:center;

          text-decoration:none;

          box-shadow:
            0 12px 28px rgba(37,211,102,.35),
            0 8px 16px rgba(0,0,0,.15);

          z-index:9999;

          transition:.25s;
        }

        .floating-wa:hover{
          transform:scale(1.08);
        }

        @media(max-width:768px){
          .floating-wa{
            width:56px;
            height:56px;
            right:14px;
            bottom:14px;
          }
        }
      `}</style>
    </>
  );
}