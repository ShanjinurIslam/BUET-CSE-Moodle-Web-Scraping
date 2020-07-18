DOM T0 JSON
======
[![GitHub issues](https://img.shields.io/github/issues/sumn2u/dom-to-json.svg)](https://github.com/sumn2u/dom-to-json/issues) [![GitHub forks](https://img.shields.io/github/forks/sumn2u/dom-to-json.svg)](https://github.com/sumn2u/dom-to-json/network) [![GitHub stars](https://img.shields.io/github/stars/sumn2u/dom-to-json.svg)](https://github.com/sumn2u/dom-to-json/stargazers)
[![Build Status](https://travis-ci.org/sumn2u/dom-to-json.svg?branch=master)](https://travis-ci.org/sumn2u/dom-to-json) [![GitHub license](https://img.shields.io/github/license/sumn2u/dom-to-json.svg)](https://github.com/sumn2u/dom-to-json/blob/master/LICENSE) [![Twitter](https://img.shields.io/twitter/url/https/github.com/sumn2u/dom-to-json.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fsumn2u%2Fdom-to-json)
[![GitHub tag](https://img.shields.io/github/tag/sumn2u/dom-to-json.svg)](https://GitHub.com/sumn2u/dom-to-json/tags/)
[![GitHub release](https://img.shields.io/github/release/sumn2u/dom-to-json.svg)](https://GitHub.com/sumn2u/dom-to-json/releases/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/sumn2u/dom-to-json/graphs/commit-activity)
<a href="https://npmjs.com/package/money-cli"><img src="https://img.shields.io/npm/dt/dom-to-json.svg" alt="npm Downloads"></a> 
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsumn2u%2Fdom-to-json.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsumn2u%2Fdom-to-json?ref=badge_shield)

Convert DOM nodes into compact JSON objects, and vice versa, as fast as possible.

## Jump To
* [Description](#description)
* [Installation](#installation)
* [Demos](#demos)
* [Usage](#usage)
* [Tests](#tests)
* [Contributing](#contributing)
* [License](#license)

## Description

The primary purpose of dom-to-json is to create  comporessed json object from DOM trees and vice-versa.


## Installation

Installing dom-to-json is easy.  You can pull it from Yarn...

```
yarn add dom-to-json
```

...or grab it from NPM and manually include it as a script tag...

```
npm install dom-to-json --save
```


## Demos

Coming soon...

## Usage

Using dom-to-json is super simple: use the [`.toJSON()`](#domJSON.toJSON) method to create a JSON representation of the DOM tree:

```javascript
import { toJSON  } from 'dom-to-json'

let someDOMElement = document.getElementById('sampleId');
let jsonOutput = toJSON(someDOMElement);

```

And then rebuild the DOM Node from that JSON using [`.toDOM()`](#domJSON.toDOM):

```javascript
import { toDOM } from 'dom-to-json'

let DOMDocumentFragment = toDOM(jsonOutput);
someDOMElement.parentNode.replaceChild(someDOMElement, DOMDocumentFragment);

```



## Tests

You can run test by using following commands

```javascript
npm run test

```


## Contributing

Feel free to pull and contribute!  If you do, please make a separate branch on your Pull Request, rather than pushing your changes to the Master.  It would also be greatly appreciated if you ran the appropriate tests before submitting the request (there are three sets, listed below).


## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsumn2u%2Fdom-to-json.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsumn2u%2Fdom-to-json?ref=badge_large)
