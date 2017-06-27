import React from "react";
import "css/components/profile/footer";

const Team = () => {
  return (
    <div>
      <h1>The Pantheon Team</h1>
      <p>Pantheon is a project by the <span>Collective Learning</span> group at the MIT Media Lab. The Pantheon visualization engine is a collaboration between Collective Learning and Datawheel.</p>
      <p><a href="http://www.macroconnections.media.mit.edu/">Collective Learning</a> is a research group at the MIT Media Lab focused on studying collective learning—the learning that happens at the group level, such as organizations, regions, countries, and the global community. We are a team of designers, engineers, and scientists that deploy our diverse set of skills to gain a better understanding of the world. Follow us on Twitter <a href="https://twitter.com/macromit">@MacroMIT</a>.</p>
      <p><a href="http://www.datawheel.us">Datawheel</a> is a small but mighty crew of programmers and designers who are here to make sense of the world’s vast amount of data. They know how to turn any client’s raw data into an interactive interface that is clear, accessible, and beautiful.</p>
      <p>Pantheon is made possible by the generous support of the <a href="https://www.media.mit.edu/sponsorship/sponsor-list">Media Lab Consortia</a> and the <a href="http://www.knowledgelab.org/">Metaknowledge Network</a> at the University of Chicago.</p>
      <div className="p2-authors">
        <ul className="footer-carousel-container">
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about cesar"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>César A. Hidalgo</a>
            </h4>
            <p>Principal Investigator, Associate Professor, Head of Collective Learning</p>
            <p>Concept, Data, Design</p>
            <p>Summer 2012 - Present</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about cristian"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Cristian Ignacio Jara Figueroa</a>
            </h4>
            <p>Lead Researcher, Collective Learning PhD Candidate</p>
            <p>Concept, Data, Design</p>
            <p>Summer 2016 - Present</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about dw"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Datawheel LLC</a>
            </h4>
            <p>Development Team</p>
            <p>Design, Data, Development</p>
            <p>Summer 2016 - Present</p>
          </li>
        </ul>
      </div>
      <div className="p1-authors">
        <h4 className="footer-title">Pantheon 1.0 Team</h4>
        <ul className="footer-carousel-container">
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about amy"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Amy Zhao Yu</a>
            </h4>
            <p>Viacom</p>
            <p>Lead Researcher</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about kevin"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Kevin Zeng Hu</a>
            </h4>
            <p>PhD Candidate</p>
            <p>Graduate Researcher</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about shahar"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Shahar Ronen</a>
            </h4>
            <p>Graduate Alumnus</p>
            <p>Graduate Researcher</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about deepak"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Deepak Jagdish</a>
            </h4>
            <p>Graduate Alumnus</p>
            <p>Graduate Researcher</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about defne"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Defne Gurel</a>
            </h4>
            <p>Undergraduate</p>
            <p>Undergraduate Researcher</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about tiffany"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Tiffany Lu</a>
            </h4>
            <p>Undergraduate</p>
            <p>Undergraduate Researcher</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about ali"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Ali Almossawi</a>
            </h4>
            <p>Mozilla Corporation</p>
            <p>External Collaborators</p>
          </li>
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a className="error-photo about andrew"></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a>Andrew Mao</a>
            </h4>
            <p>Graduate Student at Harvard</p>
            <p>External Collaborators</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Team;
