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

Print the man page for `prg`:

```
$0 prg
```

Generate a single man page for a program:

```
$0 ${opt_standalone_long} ${opt_output_long} ./doc/man
```

Generate a man pages for all program commands:

```
$0 ${opt_output_long} ./doc/man
```
