var exampleOutput = function(id, content) {
  var outputDiv = document.getElementById(id);

  if (outputDiv && outputDiv.childNodes && outputDiv.childNodes[0]) {
    outputDiv.replaceChild(document.createTextNode(content), outputDiv.childNodes[0]);
  } else {
    outputDiv.appendChild(document.createTextNode(content));
  }

};

module.exports = exampleOutput;
