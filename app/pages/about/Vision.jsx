import React from "react";

const Vision = () =>
  <div className="long-text">
    <div className="big-wave" />
    <h1>About</h1>
    <p className="intro">
      Pantheon is a project that aims to create a data driven view of history based on the biographies of the people that have been important enough to be recorded as part of our cultural memory. This visualization tool is part of a much larger project that contemplates the compilation, analysis, and visualization of data to understand historical process by identifying global trends and patterns that might be hidden in narrative descriptions of history. Dive in, visualize, and enjoy.
    </p>
    <h2>Vision</h2>
    <p>Pantheon is a project by the MIT Media Lab Macro Connection's group that makes available data on memorable biographies through thousands of interactive visualizations. The Pantheon dataset aims to provide a quantitative understanding of our species collective memory. Because of the changing nature of our historical records, Pantheon will always be—by construction—an incomplete resource. This incompleteness, however, is the fuel that drives our team to continue compiling, refining, analyzing, and visualizing new sources of data.</p>
    <p>Even though Albert Einstein is long gone, physicist use his ideas almost every day. Whenever someone writes the gravitational field equation, or talks about a photon, they are building on top of Einstein’s ideas, and as long as these ideas are passed on, the ghost of Albert Einstein will still be around. In fact, our world is full of ghosts. Newton lives in his theories, Elvis lives in his songs, Picasso lives in his paintings, etc. The goal of Pantheon is to capture these ghosts, and through them, quantify the information that has been able to break the barriers of space, time, and language.</p>
    <p>What was the most “creative” city in 1400? How has that “creativity” evolved in the past 500 years? What is the role of media? How does memorability correlate with accomplishment? Who was the first physicist? All of these are questions that can be potentially addressed using Pantheon.</p>
    <p>Pantheon is a live dataset that we are continuously expanding. We appreciate any comments and suggestions you might have to help us improve the value of this resource. You can direct your questions, comments and suggestions to <a href="mailto:pantheon@media.mit.edu">our email address</a>.</p>
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
