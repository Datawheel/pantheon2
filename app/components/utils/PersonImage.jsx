import React, {Component, PropTypes} from "react";
import defaultImage from "images/icon-person.svg";

import styles from 'css/components/utils/personImage';

class PersonImage extends Component {

  constructor(props) {
    super(props);
    this.state = {missing: false};
  }

  componentDidMount() {
    if (!this.refs.img.naturalHeight) this.error();
  }

  error() {
    this.setState({missing: true});
  }

  render() {
    const {alt, color, src} = this.props;
    const {missing} = this.state;
    if (missing) return <div className="missing-image" style={{backgroundColor: color, backgroundImage: `url("${defaultImage}")`}}></div>;
    return <img ref="img" src={src} alt={alt} onError={ this.error.bind(this) } />;
  }

};

PersonImage.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string.isRequired
};

PersonImage.defaultProps = {
  alt: ""
};

export default PersonImage;
