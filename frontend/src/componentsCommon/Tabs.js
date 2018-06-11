import React, {Component} from 'react';

export default class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 0
    };

  };

  onClick(index) {
    this.setState({
      visible: index
    });
  }

  static setClass(type, active) {
    let className = `tabs__${type}`;
    if (active) className += ` ${className}--active`;
    return className;
  }

  renderHeader(tab, index) {
    return (
      <React.Fragment key={index}>
        <div className={Tabs.setClass('header', index === this.state.visible)} onClick={() => this.onClick(index)}>
          {tab.title}
        </div>
        <div className={Tabs.setClass('content', index === this.state.visible)}>
          {tab.content}
        </div>
      </React.Fragment>
    )
  }

  render() {
    if (this.state.error) {
      return (
        <div>Unable to display tabular view</div>
      );
    } else {
      return (
        <section className="tabs">
          {this.props.tabs.map((tab, index) => this.renderHeader(tab, index))}
        </section>
      );
    }
  }
}
