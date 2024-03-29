import React, {Component} from "react";
import PropTypes from "prop-types";
import "components/utils/PersonImage.css";

class PersonImage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.fallback = () => {
      if (this.props.fallbackSrc) {
        this.setState({failed: true});
      }
    };
  }

  render() {
    if (this.state.failed) {
      return <img src={this.props.fallbackSrc} />;
    }
    else {
      return <img src={this.props.src} onError={this.fallback} />;
    }
  }

}

PersonImage.propTypes = {
  fallbackSrc: PropTypes.string,
  src: PropTypes.string.isRequired
};

PersonImage.defaultProps = {
  fallbackSrc: ""
};

export default PersonImage;
