var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react'),
    ReactSuperSelect = require('../src/react-super-select');

var allExamples = require('./all-examples');

var RSSExamples = React.createClass({

  _renderExampleLinks: function() {
    var exampleLinks = _.map(allExamples, function(example, index) {
      var href = '#' + example.nameAttr;
      return (<li key={index}><a href={href}> {example.displayName} </a></li>);
    });

    return( <div className="example-links">
              <h1>React-Super-Select Live Examples</h1>
              <h2> Quick Links: </h2>
              <nav className="api">
               <ul>
                 {exampleLinks}
               </ul>
              </nav>
            </div>);
  },

  _renderExampleSections: function() {
    var exampleSections = _.map(allExamples, function(example, index) {
      var superSelect = React.createElement(ReactSuperSelect, example.props),
          outputId = example.nameAttr + '_output';

      return( <li key={index} className="example-sections">
              <article className="api-item">
                <h3 className="api-link">
                  <a name={example.nameAttr}> {example.displayName} </a>
                </h3>
                <div className="rss-live-example">
                  {superSelect}
                </div>
                <div className="rss-output-example">onChange Output</div>
                <pre className="example-output" id={outputId}>
                </pre>
                <div>
                  <aside className="rss-example-markdown" dangerouslySetInnerHTML={{__html: example.renderString}} />
                </div>
                <a className="top-return" href="#top">Back to Top</a>
              </article>
            </li>);
    });

    return(<ul className="live-examples-list">
        {exampleSections}
      </ul>);
  },

  render: function() {
    return (<div>
      <a name="top"> </a>
      {this._renderExampleLinks()}
      {this._renderExampleSections()}
    </div>);
  }
});

React.render(<RSSExamples />, document.getElementById('examples'));
