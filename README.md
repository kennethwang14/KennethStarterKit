### kenneth-starter-kit

A Gulp-powered starter kit that I use for my frontend web projects. It contains everything you need for a HTML/CSS/JS multi-page website. For SPAs or JavaScript-based web apps, I would recommend [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit) instead.

## Installation

[![mONcnYl.png](https://s9.postimg.org/42u59wgnj/m_ONcn_Yl.png)](https://postimg.org/image/lg4forbyj/)

Works "out of the box". Installation is as easy as getting the files and typing `gulp`.

```bash
git clone https://github.com/kennethwang14/kenneth-starter-kit newproject
cd newproject
npm install
gulp
gulp build #production
```

## Features

- This project started as a fork of Cory Simmons' [Boy](https://github.com/corysimmons/boy) and contains its many features.
  - A lightweight/2-space batch of [HTML5 Boilerplate](https://html5boilerplate.com) features
    - [index.html](index.html) (with all the fluff removed)
    - [.editorconfig](.editorconfig)
    - [.htaccess](.htaccess)
    - [crossdomain.xml](crossdomain.xml)
  - Minified and sourcemapped :rage3: [reeeset](https://github.com/corysimmons/reeeset) (opinionated [Normalize.css](https://necolas.github.io/normalize.css) for the real world)
  - Polyfills for IE8 and below a la :heart: [ie-love](https://github.com/corysimmons/ie-love)
    - Conditionally loaded so only IE8 and below users will have to download it (even though it's only 25kb uglified)
    - [html5shiv](https://github.com/aFarkas/html5shiv) (in the right place)
    - [calc-polyfill](https://github.com/closingtag/calc-polyfill)
    - [jQuery 1.x.x](https://jquery.com/download/)
    - [Selectivizr 2](https://github.com/corysimmons/selectivizr2)
    - [Respond.js](https://github.com/scottjehl/Respond)
- CSS
  - Compiles Sass files into browser-readable CSS
  - Comes with many useful Sass mixins
    - Vertical rhythm
    - Responsive text
    - Font loading helper
    - Google's Material Design color palette
    - Material Design box-shadows / depth
    - Easy centering
    - CSS-only [smart underline](https://eager.io/blog/smarter-link-underlines/)
    - Button presets
  - Autoprefixer
  - Minification using [cssnano](http://cssnano.co/)
  - Outputs into a single .css file to minimize number of requests
  - SourceMap support
- JS
  - Minification using [UglifyJS](https://github.com/mishoo/UglifyJS)
  - Concatenates into a single .js file to minimize number of requests
  - Comes with FontFaceObserver for a basic font loading strategy
  - SourceMap support
- HTML
  - HTML templating using MetalSmith. MetalSmith can be used in conjunction with any templating engine supported by [consolidate.js](https://github.com/tj/consolidate.js/). Currently set to [Handlebars](http://handlebarsjs.com/).
  - Layouts and partials
  - Minification
  - Inlined critical CSS for production
- BrowserSync for automatically refreshing pages, and synced browsers across all devices
- Image minification
- Comes with a stylized home and typography page for easy prototyping

## File Structure

Source files are located in `app`. Build files are located in `dist`. All public HTML files are located in `app/pages`. Handlebars template files are in `app/templates`.

```
├── app
│   ├── assets
│   │   ├── fonts
│   │   ├── images
│   │   ├── js
│   │   │   └── polyfill
│   │   └── scss
│   │       ├── base
│   │       ├── layout
│   │       ├── modules
│   │       └── pages
│   ├── pages
│   └── templates
│       ├── handlebar-helpers
│       ├── layouts
│       └── partials
└── dist
```

## Sass Architecture

My opinionated Sass architecture, largely inspired by Hugo Giraudel's 7-1 [Sass Boilerplate](https://github.com/HugoGiraudel/sass-boilerplate). My version aims for simplicity and comes with useful initial CSS styling.

## License

[MIT](https://github.com/kennethwang14/kenneth-starter-kit/blob/master/LICENSE)
