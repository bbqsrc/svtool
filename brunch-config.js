// See http://brunch.io for documentation.
exports.files = {
  javascripts: {joinTo: 'app.js'},
  stylesheets: {joinTo: 'app.css'}
};

exports.npm = {
  styles: { "materialize-css": ["dist/css/materialize.min.css"] },
  globals: { M: "materialize-css" }
};

exports.plugins = {
  babel: {presets: ['latest', 'react']}
};
