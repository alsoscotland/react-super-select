#! /usr/bin/env sh

echo 'copying docco css from docs/docco.css to src_docs/stylesheets/docco.css'
cp ./docs/docco.css ./src_docs/stylesheets/docco.css

echo 'copying annotated src html file from docs/react-super-select.html to src_docs/annotated-source.html'
cp ./docs/react-super-select.html ./src_docs/annotated-source.html
