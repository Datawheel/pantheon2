import React, {Component} from "react";
import {Dialog} from "@blueprintjs/core";
import {select} from "d3-selection";
import {saveElement} from "d3plus-export";
import {FORMATTERS} from "types/index";

class VizWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false
    };
  }

  openSave = () => {
    this.setState({popupOpen: true});
  }

  closeSave = () => {
    this.setState({popupOpen: false});
  }

  save = type => {
    const {children, component, refKey} = this.props;
    const {props: childProps} = children;
    const thisViz = component[refKey];
    if (thisViz) {
      const title = childProps.config.title || childProps.title || "pantheon-viz";
      const elem = thisViz.container || thisViz._reactInternalInstance._renderedComponent._hostNode;
      saveElement(select(elem).select("svg").node(), {filename: FORMATTERS.slugify(title), type});
    }
  }

  render() {
    const {popupOpen} = this.state;
    const {children} = this.props;

    return <div className="section-actions">
      {/* <button className="section-download" onClick={this.openSave}>
        Download <img src="/images/icons/icon-download.svg" alt="Download this visualization" />
      </button>
      <Dialog
        iconName="cloud-download"
        isOpen={popupOpen}
        onClose={this.closeSave}
        title="Save Viz"
      >
        <div className="pt-dialog-body">
          <button onClick={this.save.bind(this, "svg")} type="button" className="pt-button pt-large pt-icon-media">SVG</button>
          <button onClick={this.save.bind(this, "png")} type="button" className="pt-button pt-large pt-icon-media">PNG</button>
        </div>
      </Dialog> */}
      <div>{children}</div>
    </div>;
  }
}

export default VizWrapper;
