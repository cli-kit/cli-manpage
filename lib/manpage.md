$0
==

Man page generation tool.

## Options

* `output: -o, --output=[dir]`: Output directory for generated man pages.
* `standalone: -s, --standalone`: Generate a single standalone man page.
* `err: -e, --error`: Use the program stderr stream.
* `argument: -a, --argument=[name]`: Argument used to print help output.
* `section: --section=[1-8]`: Man page section.

## Examples

Generate man pages for all `prg` commands:

```
$0 ${opt_output_long} ./doc/man prg
```

Generate a standalone man page for `prg`:

```
$0 ${opt_standalone_short} ${opt_output_long} ./doc/man prg
```

Print the man page for `prg`:

```
$0 prg
```
