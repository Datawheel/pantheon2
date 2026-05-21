import PersonImage from "@/components/utils/PersonImage";

const PERSON_CDN = "https://static.pantheon.world/profile/people";

function personImgUrl(id) {
  return `${PERSON_CDN}/${id}.jpg`;
}

const QuestionCard = ({question, children}) => {
  const {questionText, imageUrl, personImages, personId} = question;

  const isMultiPhoto = personImages && personImages.length > 0;
  const isExternalImage = imageUrl && imageUrl.startsWith("http");

  // Determine the single-photo src
  let singleSrc = null;
  if (!isMultiPhoto) {
    if (isExternalImage) {
      singleSrc = imageUrl;
    } else if (personId) {
      singleSrc = personImgUrl(personId);
    }
  }

  const hasPhotos = isMultiPhoto || singleSrc;

  return (
    <div className="question-card">
      <h2 className="question-text">{questionText}</h2>

      <div className={`question-content-row${hasPhotos ? " has-photos" : ""}`}>
        {isMultiPhoto ? (
          <div className="question-photos-grid">
            {personImages.map((p, i) => (
              <div key={i} className="question-photo-mini">
                <PersonImage
                  person={p}
                  src={personImgUrl(p.id)}
                  alt={p.name}
                  wrap={false}
                />
                <span className="photo-label">{p.name}</span>
              </div>
            ))}
          </div>
        ) : singleSrc ? (
          <div className="question-photo">
            <PersonImage
              person={question}
              src={singleSrc}
              alt="Question"
              wrap={false}
            />
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
};

export default QuestionCard;
