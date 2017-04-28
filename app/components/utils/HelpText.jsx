import React, {Component} from "react";
import "css/components/utils/helptext";
import {Link} from "react-router";

class HelpText extends Component {

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  handleMouseIn() {
    this.setState({hover: true});
  }

  handleMouseOut() {
    this.setState({hover: false});
  }

  render() {
    const {text, msg, link, linkTitle} = this.props;

    return (
      <span className="help-txt-box">
        <a className="help-text" title={msg} onMouseEnter={this.handleMouseIn.bind(this)}>{text}</a>
        { this.state.hover
        ? <span className="help-modal" onMouseEnter={this.handleMouseIn.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
            <span className="help-modal-body">
              { msg ? msg : null }
              { link
                ? <span className="help-modal-deeplink" onMouseEnter={this.handleMouseIn.bind(this)}>Go to <a href={link} target="_blank" className="deep-link">{linkTitle}</a></span>
                : <span className="help-modal-deeplink">For details, see <Link to="/about/methods" className="deep-link">Methods</Link></span>
              }
            </span>
          </span>
        : null
        }
      </span>
    );
  }
}

export default HelpText;
