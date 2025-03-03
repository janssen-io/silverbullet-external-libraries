
# SilverBullet Plug: External Libraries

Download SilverBullet Libraries from other sources than federated spaces.

- [x] GitHub repositories
- [ ] GitHub releases
- [x] http(s)

## Build
To build this plug, make sure you have [SilverBullet installed with Deno](https://silverbullet.md/Install/Deno). Then, build the plug with:

```shell
# debug
deno task build

# production
deno task prod
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js ./test-space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug, just watch the logs (browser and server) to see when this happens.

## Installation
If you would like to install this plug straight from Github, make sure you have the `.js` file committed to the repo and simply add

```yaml
- github:janssen-io/silverbullet-external-libraries/external-libraries.plug.js
```

to your `PLUGS` file, run `Plugs: Update` command and off you go!

Then add the following to your SETTINGS:
```yaml
externalLibraries:
- "gh://<user>/<repo>/Library/<library>"
```

For example:
```yaml
externalLibraries:
- "gh://janssen-io/silverbullet-libraries/Library/LogseqDarkTheme"
```

And run the `External Libraries: Update` command in your SilverBullet space.

### External Library requirements
The repository must contain an `index.json` in the root of the repository with 
the following structure for all files of the library that are to be downloaded:
```json
[
    { "name": "Library/<library>/<file>" },
    // ...
]
```

for example:
```json
[
    { "name": "Library/LogseqDarkTheme/theme.md" },
    { "name": "Library/LogseqDarkTheme/theme/tree.md" }
]
```

An example can be found here: https://github.com/janssen-io/silverbullet-libraries
