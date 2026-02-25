import { useState } from "react";
import MailIcon from "../assets/vectors/mail-icon.svg";
import "./ContactForm.css";

const CONTACT_EMAIL = "s22bchua@gmail.com";
const WEB3FORMS_ACCESS_KEY = "21f0e6b0-beb6-4965-bd5a-b2fff0140582";

const CONTACT_INTRO = {
  paragraph1:
    "Have a project in mind or want to work together? Fill out the form or reach me via email. I aim to reply within 24–48 hours during weekdays.",
  paragraph2:
    "For anything from a quick question to a full site redesign, send a message and I'll get back to you. I'm typically active from Mon.-Fri., 9:00AM – 5:00PM PT.",
};

function ContactForm({ idPrefix = "contact", onSubmit, headingLevel = "h2" }) {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (onSubmit) {
      onSubmit(e);
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    try {
      const formData = new FormData(e.target);
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.success ? "success" : "error");
    } catch {
      setResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const HeadingTag = headingLevel;

  return (
    <div className="contact-form-section">
      <div className="contact-form-inner">
        <div className="contact-form-info">
          <h1 className="contact-form-heading contact-form-heading--hero">Contact Me</h1>
          <HeadingTag className="contact-form-heading">
            Reach out anytime.
          </HeadingTag>
          <p className="contact-form-text">{CONTACT_INTRO.paragraph1}</p>
          <p className="contact-form-text">{CONTACT_INTRO.paragraph2}</p>
          <ul className="contact-form-details">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="contact-form-link"
              >
                <img
                  src={MailIcon}
                  alt=""
                  width="20"
                  height="20"
                  aria-hidden
                />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </li>
          </ul>
        </div>
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="contact-form-label" htmlFor={`${idPrefix}-name`}>
            *Name
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            name="name"
            placeholder="Name"
            className="contact-form-input"
            required
          />
          <label className="contact-form-label" htmlFor={`${idPrefix}-email`}>
            *Email
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            name="email"
            placeholder="Email"
            className="contact-form-input"
            required
          />
          <label className="contact-form-label" htmlFor={`${idPrefix}-phone`}>
            Phone Number (optional)
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            name="phone"
            placeholder="Phone Number (optional)"
            className="contact-form-input"
          />
          <label className="contact-form-label" htmlFor={`${idPrefix}-topic`}>
            *Select your topic
          </label>
          <select
            id={`${idPrefix}-topic`}
            name="topic"
            className="contact-form-input contact-form-select"
            required
          >
            <option value="">Select your topic</option>
            <option value="project">Project Inquiry</option>
            <option value="collab">Collaboration</option>
            <option value="other">Other</option>
          </select>
          <label className="contact-form-label" htmlFor={`${idPrefix}-message`}>
            *Message
          </label>
          <textarea
            id={`${idPrefix}-message`}
            name="message"
            placeholder="Message"
            className="contact-form-input contact-form-textarea"
            rows={4}
            required
          />
          <button
            type="submit"
            className={`contact-form-submit${
              result ? ` contact-form-submit--${result}` : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Sending…"
              : result === "success"
              ? "Message sent"
              : result === "error"
              ? "Message failed"
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
