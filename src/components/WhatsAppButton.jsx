import './WhatsAppButton.css';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/TUNUMERO?text=Hola%20quiero%20consultar%20sobre%20Loopify"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/whatsapp-icon.svg" alt="WhatsApp" />
    </a>
  );
};

export default WhatsAppButton;
