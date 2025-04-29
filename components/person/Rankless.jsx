import "./Rankless.css";

export default function Rankless({person, ranklessUrl}) {
  return (
    <div className="rankless-container">
      <h2>{person.name} is on Rankless!</h2>

      <a href={ranklessUrl} className="rankless-button">
        View Rankless Profile
        <svg height="20px" width="20px" viewBox="0 0 20 20">
          <path
            d="M5.5 5.6 C5.5,10.1,8.3,10.1,8.3,14.6 v 4.4 h 11 v -4.4 C19.3,10.1,6.1,10.1,6.1,5.6 v -4.6 h -0.6z"
            fill="white"
            strokeWidth="0.2"
            stroke="white"
          />
          <path
            d="M4 5.6 C4,10.1,1,10.1,1,14.6 v 4.4 h 4.5 v -4.4 C5.5,10.1,4.7,10.1,4.7,5.6 v -4.6 h -0.7z"
            fill="none"
            stroke-width="0.3"
            stroke="white"
          />
          <path
            d="M7 5.6 C7,10.1,2.2,10.1,2.2,14.6 v 4.4 h 3.3 v -4.4 C5.5,10.1,8,10.1,8,5.6 v -4.6 h -1z"
            fill="none"
            stroke-width="0.2"
            stroke="#4f4f4f"
          />
        </svg>
      </a>
    </div>
  );
}
