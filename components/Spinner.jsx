const Spinner = () => (
  <div className="spinner">
    <p className="spinner-text">
      {" "}
      Loading data
      <span className="spinner-dot">.</span>
      <span className="spinner-dot">.</span>
      <span className="spinner-dot">.</span>
    </p>
    <div className="spinner-img" />
    <div className="spinner-img-cover" />
  </div>
);

export default Spinner;
