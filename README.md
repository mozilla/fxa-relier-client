# fxa-relier-client

Client JS library for FxA reliers

## Integration Prerequisites
An OAuth client id is needed. Go get one from the folks in the #fxa IRC channel on irc.mozilla.org.

## Installation

### bower
1. Add an `fxa-relier-client` entry to the `dependencies` section of `bower.json`.

```json
{
  ...
  "dependencies": {
    "fxa-relier-client": "https://github.com/mozilla/fxa-relier-client.git#<latest_version>"
  }
}
```

### Roll your own from the repo
1. Clone the https://github.com/mozilla/fxa-relier-client.git repo locally.
2. Ensure `grunt-cli` is installed - `npm install -g grunt-cli`
3. `grunt build`
4. Copy `./build/fxa-relier-client.min.js` to a location it can be served by your web server.

## Include the script in your HTML
In your HTML, include a script tag pointing to fxa-relier-client.js
```html
  <script src="<location_of_relier_library>/fxa-relier-client.min.js"></script>
```

## API docs
API docs for the current released version of the library are available at http://mozilla.github.io/fxa-relier-client/. Docs for the development version can be generated with the `grunt doc` command.

## Development Prerequisites

* npm
* Grunt (`npm install -g grunt-cli`)

## Grunt Commands

[Grunt](http://gruntjs.com/) is used to run common tasks to build, test, and run local servers.

Tasks can be run from the command line by typing `grunt <task>`.

| TASK | DESCRIPTION |
|------|-------------|
| `build` | build production resources. See [task source](https://github.com/mozilla/fxa-relier-client/blob/edbfb4acc1bb7977af679bd7fa7db6b164d09767/Gruntfile.js#L21) for more documentation |
| `clean` | remove any built production resources. |
| `dev` | watch for changes to source files, run unit tests on changes. |
| `doc` | generate API docs from [YUIDoc](http://yui.github.io/yuidoc/) tags embedded in source. |
| `lint` | run [JSHint](http://jshint.com/docs/), [JSONLint](http://jsonlint.com/), and [JSCS](https://www.npmjs.com/package/jscs) (code style checker) on client side and testing JavaScript. |
| `test` | run local Intern tests. |
| `release` | create a new release. creates a `release` branch with current code, creates a new tag, updates the CHANGELOG.md, pushes updates to GitHub. |

## License

MPL 2.0
