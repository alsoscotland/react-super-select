import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";

const allKeys = require('./all-keys');

class KeyboardNavigationApp extends React.Component {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      "_renderKeysLinks",
      "_renderKeys"
    ]);
  }

  render() {
    return( <section className="api-docs-section">
              <a name="keyboard"> </a>
              <h3 className="feature-heading">Keyboard Navigation:</h3>
              <a name="keys_top"> </a>
              <h5>Keyboard Navigation Links By Key:</h5>
              <nav className="api">
               <ul>
                 {this._renderKeysLinks()}
               </ul>
              </nav>
              {this._renderKeys()}
            </section>);
  }

  _renderKeysLinks() {
    const propsLinks = _.map(allKeys, function(key, index) {
      const href = '#' + key.nameAttr,
            reactKey = 'key_link_' + index;
      return (<li key={reactKey}><a href={href}> {key.nameAttr} </a></li>);
    });

    return propsLinks;
  }

  _renderKeys() {
    const articles = _.map(allKeys, function(key, index) {
      const reactKey = "keyboard_" + index;
      return( <article key={reactKey} className="api-item">
                <h5 className="api-link">
                  <a name={key.nameAttr}>{key.displayName}</a>
                </h5>
                <p dangerouslySetInnerHTML={{__html: key.renderString}} />
                <a className="top-return" href="#index_top">Back to Top</a>
                <a className="top-return" href="#keys_top">Back to Keys Links</a>
              </article>);
    });

    return articles;
  }
}

module.exports = KeyboardNavigationApp;
ReactDOM.render(<KeyboardNavigationApp />, document.getElementById('keyboard_docs'));
