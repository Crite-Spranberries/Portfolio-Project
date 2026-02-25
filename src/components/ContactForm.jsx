import { useState } from "react";
import MailIcon from "../assets/vectors/mail-icon.svg";
import "./ContactForm.css";

const CONTACT_EMAIL = "s22bchua@gmail.com";
// Default key used when accessKey prop is not provided (e.g. single form site)
const DEFAULT_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
  "da987a2d-0541-41b8-9f86-e8b4d133edf6";

const CONTACT_INTRO = {
  paragraph1:
    "Have a project in mind or want to work together? Fill out the form or reach me via email. I aim to reply within 24–48 hours during weekdays.",
  paragraph2:
    "For anything from a quick question to a full site redesign, send a message and I'll get back to you. I'm typically active from Mon.-Fri., 9:00AM – 5:00PM PT.",
};

function ContactForm({
  idPrefix = "contact",
  onSubmit,
  headingLevel = "h2",
  accessKey,
}) {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const web3Key = accessKey ?? DEFAULT_ACCESS_KEY;

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
      formData.append("access_key", web3Key);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        console.warn("[ContactForm] Response was not JSON. Status:", response.status, "Body:", raw?.slice(0, 200));
        setResult("error");
        return;
      }

      if (data.success) {
        setResult("success");
      } else {
        setResult("error");
        console.warn("[ContactForm] Web3Forms error:", data.body?.message ?? data.message ?? data.error ?? data);
      }
    } catch (err) {
      console.warn("[ContactForm] Network or request failed:", err.message ?? err);
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
          <h1 className="contact-form-heading contact-form-heading--hero">
            Contact Me
          </h1>
          <HeadingTag className="contact-form-heading">
            Reach out anytime.
          </HeadingTag>
          <p className="contact-form-text">{CONTACT_INTRO.paragraph1}</p>
          <p className="contact-form-text">{CONTACT_INTRO.paragraph2}</p>
          <ul className="contact-form-details">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-form-link">
                <img src={MailIcon} alt="" width="20" height="20" aria-hidden />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </li>
          </ul>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
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
          {result === "error" && (
            <p className="contact-form-fallback">
              Connection failed (e.g. network or firewall). You can{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>email directly</a> instead.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
