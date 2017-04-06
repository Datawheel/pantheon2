import React from 'react';

const Faq = () => {
  return (
    <div className="data-faq-container">
      <h1>Frequently Asked Questions</h1>
      <p>This section contain bullet point answers for some of the most frequent questions. For a more thorough answer see the <a href="/about/methods">Methods</a> section.</p>
      <h2>What is culture?</h2>
      <p>Culture is all information that is transmitted through non-genetic means. Culture ranges from the shared norms and beliefs of societies, to the knowledge and information that leads to the development of modern science and technology. It is the information that is transmitted orally, in texts, or in artifacts. Our measures of culture do not capture this definition of culture in its full extent, but a small subset of it. Namely, the one associated with accomplishments or historical periods that have a strong association with single individuals (see data).</p>

      <h2>What is global culture?</h2>
      <p>Global culture encompasses the cultural expressions that have broken many linguistic barriers--as compared to local culture, which is information that is contained within a few language groups.</p>

      <h2>How are individuals attributed to countries? Does the data take immigration into account?</h2>
      <p>Currently, we attribute individuals by their country of birth--based on current political maps. This means that Albert Einstein is an export of Germany (since he was born in Ulm) and that individuals born in the ancient city of Babylon were assigned to Iraq.</p>

      <h2>What about the inherent biases within Wikipedia?</h2>
      <p>Wikipedia data is rife with biases and limitations. Yet, these do not render it useless in absence of other comprehensive sources that can compete with Wikipedia in its coverage in both topics and number of languages included. A detailed description of these and other biases is available on the <a href="/about/methods">Methods</a> page.</p>

      <h2>This is awesome! How can I contribute to the effort?</h2>
      <p>We’d love your feedback! Help us improve by <a href="http://mitpantheon.wufoo.com/forms/z183ba951ur6oei/">letting us know</a> if anything is missing or incorrect. And of course, feel free to spread the word and share the stories that you discover!</p>
    </div>
  );
};

export default Faq;
