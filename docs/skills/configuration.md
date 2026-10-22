# Configuration

[← Overview](./)

Everything below is in `config.lua`. Skills and perks are in `skills.lua` ([Skills and perks](skills.md)),
bonuses in `effects.lua` ([Bonuses](bonuses.md)).

- [General](#general)
- [Notifications](#notifications)
- [Colours](#colours)
- [XP popup](#xp-popup)
- [Menu](#menu)
- [UI options](#ui-options)
- [Storage](#storage)
- [Progression](#progression)
- [Activities](#activities)
- [Game stats](#game-stats)
- [Bonuses](#bonuses)
- [Unlocking](#unlocking)
- [Tree reset](#tree-reset)
- [Level rewards](#level-rewards)
- [XP loss on death](#xp-loss-on-death)
- [Paychecks](#paychecks)
- [Admin](#admin)

## General

```lua
Config.Locale = 'en'        -- file name from locales/
Config.Framework = 'auto'   -- 'auto', 'qbx', 'qb', 'esx', 'nd', 'ox' or 'standalone'
```

To add a language, copy `locales/en.lua` to `locales/de.lua`, change `Locales['en']` to `Locales['de']`,
translate it and set `Config.Locale = 'de'`. Any missing text falls back to English.

## Notifications

```lua
Config.Notify = {
    enabled = true,
    system = 'auto',
    position = 'top-center',
    duration = 4200
}
```

| Option | Values |
|---|---|
| `enabled` | `false` hides notifications while the menu is closed. Results of clicks inside the open menu are still shown |
| `system` | `'auto'` (5motion_hud when it runs, otherwise built-in), `'builtin'`, `'ox_lib'`, `'framework'`, `'5motion_hud'` |
| `position` | built-in only: `'top-left'`, `'top-center'`, `'top-right'`, `'left-center'`, `'right-center'`, `'bottom-center'`, `'bottom-right'` |
| `duration` | built-in only, in ms |

Another notification script: replace the body of `notify(text, kind)` in `bridge/client.lua`.

## Colours

```lua
Config.Theme = {
    source = 'auto',       -- 'config', 'hud' or 'auto'
    accent = '#8b5cf6',
    skillColors = true,
    opacity = 0.86
}
```

| Option | Meaning |
|---|---|
| `source` | `'config'` uses `accent`. `'hud'` uses the accent the player picked in 5motion_hud and follows it live. `'auto'` uses the HUD when it runs, otherwise `accent` |
| `accent` | main colour (hex) |
| `skillColors` | `true` gives every tree its own `color` from `skills.lua`. `false` paints everything in the accent |
| `opacity` | panel opacity 0.5–1.0. Ignored when the colour comes from the HUD, because the HUD's glass setting is used then |

## XP popup

```lua
Config.Popup = {
    enabled = true,
    hud = true,
    position = 'top-right',
    duration = 3500,
    minimum = 1
}
```

| Option | Meaning |
|---|---|
| `enabled` | `false` = no "+XP" popups. Level ups still show a notification |
| `hud` | with 5motion_hud running, popups are sent as HUD notifications (gains of one skill add up in one notification) |
| `position` | built-in popup, same positions as notifications |
| `duration` | ms. Level-up popups stay twice as long |
| `minimum` | smaller gains are not shown, but they still count |

## Menu

```lua
Config.Menu = {
    command = 'skills',
    aliases = {},
    key = 'K',
    radial = {
        system = 'auto',
        icon = 'ranking-star',
        parent = false
    },
    closeEvents = {}
}
```

| Option | Meaning |
|---|---|
| `command` | chat command. `false` = no command |
| `aliases` | extra commands, e.g. `{ 'umiejetnosci', 'perks' }` |
| `key` | default key ([key names](https://docs.fivem.net/docs/game-references/input-mapper-parameter-ids/keyboard/)). Players can rebind it. `false` = no key |
| `radial.system` | `'auto'` (first running of 5motion_hud, ox_lib, qb-radialmenu, qbx_radialmenu), one of those names, `'custom'` or `false` |
| `radial.icon` | Font Awesome 6 icon name (all supported radials use Font Awesome) |
| `radial.parent` | id of a radial sub menu to put the entry in (ox_lib / 5motion_hud), `false` = main menu |
| `closeEvents` | local client events that close the menu, e.g. your "fix stuck UI" command |

Use any mix. For example, a radial-only server:

```lua
command = false, key = false, radial = { system = 'auto', icon = 'ranking-star', parent = false }
```

With `'custom'`, fill `addCustomRadial` / `removeCustomRadial` in `bridge/client.lua`.
See [Integration → Radial menu](integration.md#radial-menu).

## UI options

```lua
Config.Ui = {
    scale = 1.0,        -- 0.7–1.3, the menu still shrinks on small screens
    totalLevel = true,  -- "Total level" chip in the header
    summary = true,     -- "All bonuses" button in the skill bar
    activities = true,  -- "How to level up" list
    rewards = true,     -- "Level rewards" list
    rowLevels = true,   -- required level next to every tree row
    confirm = true,     -- click twice to unlock a perk / reset a tree
    currency = '$'
}
```

Players switch skills with the arrow keys. Hovering a perk shows its bonuses, and clicking it opens the details.

## Storage

See [Installation → Storage](installation.md#storage).

## Progression

```lua
Config.Progression = {
    maxLevel = 30,
    baseXp = 100,
    growth = 1.15,
    pointsPerLevel = 1,
    startingPoints = 1,
    multiplier = 1.0,
    hourlyCap = 1500,
    boosts = {},
    groups = {}
}
```

| Option | Meaning |
|---|---|
| `maxLevel` | highest level of a skill |
| `baseXp` | XP for level 2 |
| `growth` | each next level needs this much more (1.15 = +15%). With 100 / 1.15, level 10 ≈ 2 000 XP and level 30 ≈ 37 700 XP in total |
| `pointsPerLevel` | perk points per level. Points belong to the tree of the levelled skill |
| `startingPoints` | points at level 1 |
| `multiplier` | global XP multiplier (`2.0` for a double XP weekend) |
| `hourlyCap` | most XP per skill per hour from activities (anti-AFK). `false` = no cap |
| `boosts` | timed multipliers in server time |
| `groups` | XP multipliers for ACE permissions (VIP) |

```lua
boosts = {
    { days = { 'sat', 'sun' }, multiplier = 2.0 },                      -- weekends
    { from = 20, to = 23, multiplier = 1.5, skills = { 'driving' } }    -- 20:00–22:59, driving only
},
groups = {
    { ace = 'skills.vip', multiplier = 1.25 }   -- add_ace group.vip skills.vip allow
}
```

Days: `'mon'` … `'sun'` (none = every day). `to` is not included, and `22 → 2` goes over midnight.
Active boosts multiply with each other. From `groups`, only the highest matching one counts.

**Balancing the tree:** at level 30 a player has `startingPoints + 29 × pointsPerLevel` = 30 points per tree.
A full default tree costs 38 points (`Config.Tree` in `skills.lua`). Raise `pointsPerLevel` or lower the costs
if you want players to be able to finish a tree.

All of these except `multiplier`, `boosts` and `groups` can also be set per skill in `skills.lua`.

## Activities

What gives XP. See [Activities](activities.md) for every built-in activity and how to add yours.

```lua
running = { enabled = true, skill = 'athletics', unit = 'm', xp = 40, every = 1000, minSpeed = 2.5, maxRate = 12.0 },
```

Here the player gets 40 XP for every 1000 m. To slow it down, raise `every` or lower `xp`.
`skill` moves the activity to another tree.

```lua
Config.ReportInterval = 15000   -- how often the game sends progress to the server (ms)
```

## Game stats

```lua
Config.GameStats = true
```

Sets GTA's hidden stats (stamina, strength, shooting, lung capacity, wheelie, flying) from the level of the
skill that has `stat = '…'` in `skills.lua`. Turn it off if another script (a gym, for example) controls those stats.

## Bonuses

```lua
Config.Bonuses = {
    scale = 1.0,     -- power of all perks: 0.5 = half, 2.0 = double (flags excluded)
    disabled = {}    -- e.g. { 'recoil', 'carryWeight' }
}
```

`disabled` is the quick way to switch off bonuses that clash with your other scripts. Perks still unlock,
the bonus just does nothing and is hidden in the menu. Details are in [Bonuses](bonuses.md).

## Unlocking

```lua
Config.Unlock = { account = 'bank' }   -- 'bank' or 'cash'
```

A perk can cost money on top of points (`price`), or be limited to jobs (`jobs`) or an ACE permission (`ace`).
See [Skills and perks](skills.md#perk-fields).

## Tree reset

```lua
Config.Respec = {
    enabled = true,
    price = 2500,
    account = 'bank',
    cooldown = 60    -- minutes between resets of the same tree
}
```

A reset gives back all points of one tree. Levels and XP stay. The price can be lowered with the
`respecDiscount` bonus. A skill can override it with `respec = false`, `respecPrice` or `respecCooldown`.

## Level rewards

```lua
Config.Rewards = {
    enabled = true,
    account = 'bank',
    everyLevel = false,                 -- e.g. { money = 100 }
    levels = {
        [10] = { money = 1000 },
        [20] = { money = 2500 },
        [30] = { money = 5000, items = { { name = 'goldbar', count = 1 } } }
    }
}
```

Each reward is given once per character per skill. Levels set with `/skillsadmin … setlevel` do not give rewards.
A skill can add its own `rewards` in `skills.lua`. The `rewardBonus` bonus raises the money.
Items go through ox_inventory or the framework inventory.

## XP loss on death

```lua
Config.Death = {
    enabled = false,
    loss = 0.25,       -- part of the XP gained since the last level
    skills = {},       -- only these skills, empty = all
    cooldown = 120     -- seconds before the next death counts
}
```

A level is never lost. If you use an ambulance script with a "downed" state, put its check into
`isPlayerDead()` in `bridge/client.lua`.

## Paychecks

```lua
Config.Paycheck = { reasons = { 'paycheck' } }
```

The `paychecks` activity and the `paycheck` bonus need to know when a player is paid.

- **Qbox / QBCore**: money added with one of these `reason`s counts as a paycheck. Add your job script's reason here.
- **Other frameworks**: call `exports['5motion_skills']:Paycheck(source, amount, account)` where your server pays salaries.

The `paycheck` bonus pays the extra percent on top of every paycheck.

## Admin

```lua
Config.Admin = {
    command = 'skillsadmin',
    ace = { 'group.admin', 'skills.admin' },
    groups = { 'admin', 'superadmin', 'god' }
}
```

```
/skillsadmin <player id> <skill|all> addxp <amount>
/skillsadmin <player id> <skill|all> setlevel <level>
/skillsadmin <player id> <skill|all> reset
```

One match is enough: an ACE permission or a framework group. The command works from the server console too.
