#meta

This page contains some configuration overrides for SilverBullet. A list of configs and their documentation [[!silverbullet.md/SETTINGS|can be found here]].

To update the [[!silverbullet.md/Libraries|libraries]] specified below, run {[Libraries: Update]}
To update the external libraries, run : {[External Libraries: Update]}

```yaml
indexPage: "[[index]]"
libraries:
- import: "[[!silverbullet.md/Library/Core/*]]"

externalLibraries:
- "gh://janssen-io/silverbullet-libraries/Library/LogseqDarkTheme"
- "https://janssen-io.github.io/silverbullet-libraries/Library/Test"
```
