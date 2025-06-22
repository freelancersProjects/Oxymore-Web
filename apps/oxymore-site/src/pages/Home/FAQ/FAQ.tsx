import React from "react";
import "./FAQ.scss";
import { OXMCategorie, OXMAccordion } from "@oxymore/ui";


const FAQ = () => {
  const faqs = [
    {
      question: "How do I join a tournament?",
      answer:
        "Create an account, head to the Tournaments section, and click “Join” on any active event. You can play solo or with your squad.",
    },
    {
      question: "Is it free to participate?",
      answer: "Yes! Participation is free for all registered users.",
    },
    {
      question: "Can I track my stats and performance?",
      answer:
        "Absolutely! Our platform provides detailed stats and performance tracking.",
    },
    {
      question: "How are teams ranked?",
      answer:
        "Teams are ranked based on their Elo score, match results, and activity.",
    },
    {
      question: "What happens if my team doesn’t show up?",
      answer:
        "If your team doesn’t show up for a match, it may result in an automatic forfeit or penalty.",
    },
  ];

  return (
    <section className="faq">
      <OXMCategorie label="FAQ" />
      <h1>Frequently Asked Question</h1>
      <div className="faq__list">
        {faqs.map((item, index) => (
          <OXMAccordion
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
