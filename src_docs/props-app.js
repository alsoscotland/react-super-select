import _ from "lodash";
import allProps from "./all-props";
import React from "react";
import ReactDOM from "react-dom";

class PropsApp extends React.Component {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      "_renderPropsLinks",
      "_renderProps"
    ]);
  }

  render() {
    return( <section className="api-docs-section">
              <a name="apiDocs"> </a>
              <h3 className="feature-heading">API documentation</h3>
              you can also view the
              <a href="annotated-source.html"> Annotated Source Code </a>
              <a name="properties_top"> </a>
              <h5>Component Property API Documentation Links:</h5>
              <nav className="api">
               <ul>
                 {this._renderPropsLinks()}
               </ul>
              </nav>

              {this._renderProps()}
            </section>);
  }

  _renderPropsLinks() {
    const sortedProps = allProps.sort(function(propA, propB) {
      return (propA.nameAttr >= propB.nameAttr) ? 1 : -1;
    });
    const propsLinks = _.map(sortedProps, function(prop, index) {
      const href = '#' + prop.nameAttr,
            key = 'prop_link_' + index;
      return (<li key={key}><a href={href}> {prop.nameAttr} </a></li>);
    });

    return propsLinks;

  }

  _renderProps() {
    const articles = _.map(allProps, function(prop, index) {
      const key = "api_prop_" + index;
      return( <article key={key} className="api-item">
                <h4 className="api-link">
                  <a name={prop.nameAttr}>{prop.nameAttr}</a>
                </h4>
                <p dangerouslySetInnerHTML={{__html: prop.renderString}} />
                <a className="top-return" href="#index_top">Back to Top</a>
                <a className="top-return" href="#properties_top">Back to API Documentation Links</a>
              </article>);
    });

    return articles;
  }
}

module.exports = PropsApp;
ReactDOM.render(<PropsApp />, document.getElementById('props_docs'));
