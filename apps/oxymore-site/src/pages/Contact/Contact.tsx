import React from "react";
import { OXMButton, OXMGlowOrb } from "@oxymore/ui";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import "./Contact.scss";

const Contact = () => {
  return (
    <>
      <OXMGlowOrb top="10%" left="-15%" size="600px" color="rgba(80,12,173,0.25)" />
      <section className="contact-page">
        <h1>Contact Us</h1>
        <p>
          Have a question, issue, or just want to say hi? We're here to help you
          with anything related to Oxymore and our tournaments.
        </p>

        <div className="contact__content">
          <div className="contact__form">
            <h3>Send Us a Message</h3>
            <form>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter Name" />

              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter Email" />

              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Type here"></textarea>

              <OXMButton>Submit</OXMButton>
            </form>
          </div>

          {/* Infos de contact */}
          <div className="contact__info">
            <div className="contact__box">
              <h3>Support & Community Channels</h3>
              <p>
                Support Email:{" "}
                <a href="mailto:support@oxymore.gg">support@oxymore.gg</a>
              </p>
              <p>
                Join Our Discord:{" "}
                <a
                  href="https://discord.gg/your-discord-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Join Discord Link]
                </a>
              </p>
            </div>

            <div className="contact__box">
              <h3>Follow Us on Socials:</h3>
              <div className="socials">
                <a href="#" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="#" aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a href="#" aria-label="YouTube">
                  <YouTubeIcon />
                </a>
                <a href="#" aria-label="Twitch">
                  <SportsEsportsIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <OXMGlowOrb top="500px" right="-20%" size="900px" color="rgba(21,147,206,0.18)" />
    </>
  );
};

export default Contact;
