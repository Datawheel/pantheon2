import React from "react";

const Vision = () =>
  <div className="long-text">
    <div className="big-wave" />
    <h1>About</h1>
    <p className="Vision">
      <h2>History</h2>Pantheon is a project that compiles and distributes data on human collective memory. This is the second iteration of Pantheon. It includes data on more than 70,000 biographies (up from less than 12,000 in Pantheon 1.0), organized by geography and occupational domain.
  Pantheon 1.0 was created at the MIT Media Lab in team composed by Amy Yu, Shahar Ronen, Kevin Hu, and lead by Cesar A. Hidalgo. The team also got the design support of Ali Almossawi and Deepak Jagdish.
  Pantheon 2.0 data is based on a compilation effort started by Cristian Jara Figueroa, at MIT's Collective Learning group, and completed by Marcio Porto at Datawheel. Marcio created the data ingestion pipeline and the backend.The Pantheon's site and front end are the work of Alex Simoes. also from Datawheel. The visual design of Pantheon was done by Melissa Teng, during her time at Datahweel. Pantheon 2.0 was lead and supervised by Cesar A. Hidalgo.
    </p>
    <h2>Vision</h2>
    <p>Pantheon makes available data on memorable biographies through thousands of interactive visualizations. This data can be used to support research on collective memory, success, knowldge diffusion, and fame.
      Patheon distributes the data through a data visualiztion engine that facilitates querying and exploring the data.</p>
    {/* <h2>Updates</h2>
    <p>Pantheon is a live dataset that we are continuously expanding. We plan to update Pantheon every six months </p>
    <h3>Update Table</h3>
    <p>Pantheon last update: XXXXX LINK TO VERSION</p>
    <p>Pantheon nextupdate update: XXXXX</p> */}


    <h2>Videos</h2>
    <p>Here are some videos from Pantheon 1.0 describingthe original idea of Pantheon</p>
    <h2 className="obj-title">The Ghosts of Information</h2>
    <div className="video-wrapper">
      <iframe src="https://player.vimeo.com/video/89016128" width="100%" height="100%" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
    </div>
    <h2 className="obj-title">Mapping Global Cultural Production</h2>
    <div className="video-wrapper">
      <iframe src="https://player.vimeo.com/video/89015710?color=222222&title=0&byline=0&portrait=0" width="100%" height="100%" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
    </div>
  </div>;

export default Vision;
