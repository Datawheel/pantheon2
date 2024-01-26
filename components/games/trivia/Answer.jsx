const Answer = ({ answer, letter, selected, setCurrentAnswer }) => {
  const classes = ["answer"];

  const handleClick = (e) => {
    // props.dispatch({
    //   type: SET_CURRENT_ANSWER,
    //   currentAnswer: e.target.value,
    // });
    // props.dispatch({ type: SET_ERROR, error: "" });
    setCurrentAnswer(e.target.value);
  };

  if (selected) {
    classes.push("selected");
  }
  return (
    <button value={letter} className={classes.join(" ")} onClick={handleClick}>
      <span className="letter">{letter}.</span> {answer}
    </button>
  );
};

export default Answer;
