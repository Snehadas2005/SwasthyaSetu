import { useState } from "react";
import "./ContentPage.css";

function ContentPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const articles = [
    {
      title: "Healthy Living Tips",
      summary: "Discover easy ways to maintain a balanced diet and stay active every day.",
      details:
        "A balanced diet includes fruits, vegetables, whole grains, lean protein, and healthy fats. Regular exercise (30 minutes a day) can help maintain body weight, boost energy, and reduce the risk of chronic diseases."
    },
    {
      title: "Managing Chronic Illness",
      summary: "Guidelines for patients with diabetes, hypertension, and other chronic conditions.",
      details:
        "Chronic illness management requires consistent medication, regular health checkups, lifestyle adjustments, and a support system. Telemedicine can provide easy monitoring and doctor consultations for continuous care."
    },
    {
      title: "Telemedicine Benefits",
      summary: "Learn how remote consultations can save time, costs, and improve access to healthcare.",
      details:
        "Telemedicine reduces travel costs, saves time, and provides access to doctors from remote locations. It also allows for better follow-ups, digital prescriptions, and timely interventions, especially in rural areas."
    },
    {
      title: "Preventive Care",
      summary: "Preventive health measures to avoid illnesses before they start.",
      details:
        "Preventive care includes vaccinations, routine screenings, healthy eating, and regular exercise. Early detection of conditions through screenings can reduce healthcare costs and improve long-term health outcomes."
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="content-page">
      <div className="content-hero">
        <h1>Health Articles & Resources</h1>
        <p>Informative guides, tips, and medical articles for better health</p>
      </div>

      <div className="articles-grid">
        {articles.map((article, index) => (
          <div className="article-card" key={index}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>

            {expandedIndex === index && (
              <p className="article-details">{article.details}</p>
            )}

            <button onClick={() => toggleExpand(index)}>
              {expandedIndex === index ? "Show Less" : "Read More"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentPage;
