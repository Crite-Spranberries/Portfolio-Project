import ContactForm from "../components/ContactForm";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <ContactForm
        idPrefix="contact-page"
        headingLevel="h1"
        accessKey={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY_CONTACT}
      />
    </div>
  );
}

export default Contact;
