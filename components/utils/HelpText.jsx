import React, {Component} from "react";
import "css/components/utils/helptext";
import Link from "next/link";

class HelpText extends Component {
  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  handleMouseIn() {
    this.setState({hover: true});
  }

  handleMouseOut(event) {
    const {parent} = this.refs;

    let e = event.toElement || event.relatedTarget;
    while (e && e.parentNode && e.parentNode !== window) {
      if (e.parentNode === parent || e === parent) {
        if (e.preventDefault) e.preventDefault();
        return;
      }
      e = e.parentNode;
    }

    this.setState({hover: false});
  }

  render() {
    const {text, msg, link, linkTitle} = this.props;
    const {hover} = this.state;

    return (
      <span
        ref="parent"
        className="help-txt-box"
        onMouseEnter={this.handleMouseIn.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
      >
        <a className={`help-text ${hover ? "hover" : ""}`} title={msg}>
          {text}
        </a>
        {hover ? (
          <span className="help-modal">
            <span className="help-modal-body">
              {msg ? msg : null}
              {link ? (
                <span className="help-modal-deeplink">
                  Go to{" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deep-link"
                  >
                    {linkTitle}
                  </a>
                </span>
              ) : (
                <span className="help-modal-deeplink">
                  For details, see{" "}
                  <Link href="/about/methods" className="deep-link">
                    Methods
                  </Link>
                </span>
              )}
            </span>
          </span>
        ) : null}
      </span>
    );
  }
}

export default HelpText;
