import "./FAQ.scss";
import { OXMCategorie, OXMAccordion } from "@oxymore/ui";
import { useLanguage } from "../../../context/LanguageContext";

const FAQ = () => {
  const { t, translations } = useLanguage();
  const faqs = ((translations.home?.faq as any)?.items ?? []) as { question: string; answer: string }[];

  return (
    <section className="faq">
      <OXMCategorie label="FAQ" />
      <h1>{t('home.faq.title')}</h1>
      <div className="faq__list">
        {faqs.length > 0 ? faqs.map((item, index) => (
          <OXMAccordion
            key={index}
            question={item.question}
            answer={item.answer}
          />
        )) : <p>No FAQ available.</p>}
      </div>
    </section>
  );
};

export default FAQ;
