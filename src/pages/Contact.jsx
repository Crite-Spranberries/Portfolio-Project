import ContactForm from "../components/ContactForm";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <ContactForm idPrefix="contact-page" headingLevel="h1" />
    </div>
  );
}

export default Contact;
