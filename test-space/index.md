This is the index page of the test space.

Press this {[Sync: Now]} to sync the plug after copying it into [[_plug]].

Quick list:
- [[SETTINGS]]
- {[External Libraries: Update]}
- {[Tree View: Toggle]}

## Libraries Files
${query[[
    from p = index.tag "page"
    where p.name:startsWith("Library/")
    select p.name
]]}
