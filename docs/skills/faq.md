# FAQ

[← Overview](./)

**Does it need ox_lib, a framework or a database?**
No. ox_lib is never used. Without a framework, skills are saved per FiveM license. Without oxmysql, they are
saved in the server's KVP store.

**How do I make levelling faster or slower?**
`Config.Progression.multiplier` for everything, `xp` / `every` of one activity, or `xpMultiplier` of one skill.
See [Activities → Tuning](activities.md#tuning-the-speed-of-levelling).

**Can players finish a whole tree?**
Not with the defaults: a tree costs 38 points and a level 30 skill gives 30. That is on purpose, so players pick
a direction. Raise `Config.Progression.pointsPerLevel` or lower `Config.Tree.costs` in `skills.lua` to change it.

**I don't have fishing / mechanic / shop / crafting scripts. What about those trees?**
Set `enabled = false` on the skill in `skills.lua` and it disappears. If you do have such scripts, hook them up
with an event or one export: [Activities → Hooking other scripts](activities.md#hooking-other-scripts).

**A bonus fights with another script (damage, recoil, carry weight…).**
Add it to `Config.Bonuses.disabled`. The list of usual conflicts is in
[Bonuses → Conflicts](bonuses.md#conflicts-with-other-scripts).

**Some bonuses (shop prices, crafting speed…) do nothing.**
They are values for your scripts. Read them with `GetEffect`: [Bonuses → Reading a bonus](bonuses.md#reading-a-bonus-in-your-scripts).

**I changed a tree. Do players have to reset?**
No. When a player loads in, a tree that no longer fits their unlocked perks is reset for free and they get a
message. XP and levels stay. See [Skills and perks → Changing a tree](skills.md#changing-a-tree).

**Can I hide a skill without losing players' progress?**
Yes, `enabled = false` keeps saved XP and perks. They come back when you turn it on.

**How do I give double XP on weekends?**
`Config.Progression.boosts = { { days = { 'sat', 'sun' }, multiplier = 2.0 } }`.

**How do I give VIPs more XP?**
`Config.Progression.groups = { { ace = 'skills.vip', multiplier = 1.25 } }` and
`add_ace group.vip skills.vip allow` in `server.cfg`.

**Can a perk be only for the police / only for VIPs / cost money?**
Yes: `jobs = { police = 2 }`, `ace = 'skills.vip'`, `price = 5000` on the perk.
See [Skills and perks → Perk fields](skills.md#perk-fields).

**The radial entry doesn't show up.**
Check that your radial resource starts **before** `5motion_skills`, or at least that it is running (the entry is
added again when the radial starts later). For a radial that isn't supported, use `system = 'custom'`:
[Integration → Radial menu](integration.md#radial-menu).

**I only want the radial, no command and no key.**
`Config.Menu.command = false`, `Config.Menu.key = false`. If you turn all three off, the console warns you and
the menu can only be opened with `exports['5motion_skills']:OpenMenu()`.

**Players already bound K to something else.**
They can rebind it in *Settings → Key Bindings → FiveM*. Changing `Config.Menu.key` only changes the default for
players who never bound it.

**How do I translate it?**
Copy `locales/en.lua` to a new file, change `Locales['en']`, translate and set `Config.Locale`. Missing texts
fall back to English.

**How do I reset a player?**
`/skillsadmin <id> all reset`, or `/skillsadmin <id> <skill> reset` for one skill. Works from the console too.

**Do skills disappear when a character is deleted?**
Only if you add a foreign key from `5motion_skills.identifier` to your characters table with `ON DELETE CASCADE`.
Otherwise the row just stays unused.
