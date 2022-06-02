# Interactive GUI

Beam includes an interactive GUI (or 'TUI', Terminal User Interface) for exploring the results of the Lighthouse audit reports generated. If you would prefer that a simple table of results is displayed instead of the GUI then you can run Beam with the `no-gui` flag as follows:

```bash
beam --no-gui
```

## Keys

The gui is controlled via the following set of keys:

<table>
    <thead>
        <tr>
            <th>Key</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>h</code></td>
            <td>Show / hide the list of keyboard actions.</td>
        </tr>
        <tr>
            <td><code>tab</code> / <code>shift</code>+<code>tab</code></td>
            <td>Change tab.</td>
        </tr>
        <tr>
            <td><code>up</code> / <code>down</code></td>
            <td>Change item highlighted / selected</td>
        </tr>
        <tr>
            <td><code>enter</code></td>
            <td>Open report in browser.</td>
        </tr>
        <tr>
            <td><code>-</code> / <code>=</code></td>
            <td>Change sort order (ascending / descending).</td>
        </tr>
        <tr>
            <td><code>s</code></td>
            <td>Change sort category.</td>
        </tr>
        <tr>
            <td><code>[</code> / <code>]</code></td>
            <td>Previous / next sort category.</td>
        </tr>
    </tbody>
</table>
