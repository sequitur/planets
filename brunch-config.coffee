module.exports = config:
  npm:
    enabled: true
  files:
    javascripts:
      joinTo:
        'app.js': /^(?!texture).+js/
    stylesheets: joinTo: 'app.css'
