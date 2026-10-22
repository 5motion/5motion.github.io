# Activities

[← Overview](./)

Activities are what gives XP. They live in `Config.Activities` in `config.lua`.

```lua
running = { enabled = true, skill = 'athletics', unit = 'm', xp = 40, every = 1000, minSpeed = 2.5, maxRate = 12.0 },
```

Read it as: **`xp` XP for every `every` `unit`s**, so 40 XP per 1000 m of running. Partial progress counts,
500 m gives 20 XP.

| Field | Meaning |
|---|---|
| `enabled` | `false` = gives no XP |
| `skill` | tree that gets the XP. Change it to move the activity to another skill |
| `unit` | what is counted. The text in the menu comes from `ui.units.<unit>` in the locale files |
| `xp`, `every` | XP for every N units |
| `maxRate` | most units per second the server accepts (anti-cheat, see below) |
| `minSpeed` | ignored below this speed (m/s on foot and on bikes, km/h in cars and boats) |
| `custom = true` | the game doesn't count it, your scripts give it (see [Hooking other scripts](#hooking-other-scripts)) |
| `label`, `unitLabel` | texts for your own activities: `{ en = 'Mining a rock' }`, `{ en = '{n} rocks' }` |

## Built-in activities

| Activity | Skill | Counts | Extra settings |
|---|---|---|---|
| `running` | athletics | metres run or sprinted on foot | `minSpeed` m/s |
| `cycling` | athletics | metres on a bicycle | `minSpeed` m/s |
| `swimming` | swimming | metres swum on the surface | |
| `diving` | swimming | seconds under water | |
| `driving` | driving | metres as a driver of a land vehicle | `minSpeed` km/h |
| `speeding` | driving | metres above `minSpeed` km/h, on top of `driving` | `minSpeed` km/h |
| `boating` | driving | metres as a boat driver | `minSpeed` km/h |
| `flying` | flying | metres as a pilot | |
| `shots` | shooting | shots fired with a firearm | |
| `hits` | shooting | bullets that hit a person | `players = false` = NPCs only |
| `melee` | strength | punches and melee hits on a person | `players = false` = NPCs only |
| `hiking` | survival | metres on foot at least `roadDistance` m from any road | `minSpeed` m/s, `roadDistance` |
| `enduring` | survival | health lost and survived | |
| `paychecks` | career | paychecks ([Configuration → Paychecks](configuration.md#paychecks)) | |
| `sneaking` | stealth | metres moved while sneaking | `minSpeed` m/s, `stateBags` |
| `hunting` | hunting | animals killed (each one once) | |
| `fishing` | fishing | your fishing script | `custom = true` |
| `repairs` | mechanics | your mechanic script | `custom = true` |
| `trading` | trade | your shop / selling scripts | `custom = true` |
| `crafting` | crafting | your crafting script | `custom = true` |

**Sneaking:** GTA's own stealth mode counts out of the box. If your server has a crouch script, put the
state bag it sets on the player into `stateBags`, e.g. `stateBags = { 'crouching' }`. The `stealthSpeed` bonus
uses the same check.

## Tuning the speed of levelling

- Everything at once: `Config.Progression.multiplier` (`0.5` = half as fast), or a slower curve with `growth`.
- One activity: lower `xp` or raise `every`.
- One skill: `xpMultiplier = 0.5` on the skill in `skills.lua`.
- Weekends / evenings / VIPs: `Config.Progression.boosts` and `groups`.

With the defaults a player who drives 10 km gets about 180 XP, enough for level 2 of Driving.
Level 10 needs about 2 000 XP in total, level 30 about 37 700 XP.

## Anti-cheat

- The game counts progress on the player's PC and sends it every `Config.ReportInterval` ms. The server never
  accepts more than `maxRate × seconds since the last report` for an activity, so a modified client can't send
  huge numbers. Raise `maxRate` only if real players hit the limit (fast cars on `driving`, for example).
- `Config.Progression.hourlyCap` limits XP per skill per hour from activities, against AFK farming.
  The `xpCap` bonus raises it. XP from exports ignores the cap unless the caller asks for it.
- `custom` activities can't be sent from the player's PC, unless you add `clientEvents` (see below).

## Hooking other scripts

The four work skills (fishing, mechanics, trade, crafting) and your own skills need XP from your scripts.
There are three ways, pick whichever fits.

### 1. An event the script already fires (no code)

Most scripts trigger an event when something happens. List it in the activity:

```lua
fishing = { enabled = true, custom = true, skill = 'fishing', unit = 'fish', xp = 20, every = 1,
            serverEvents = { 'fishing:server:caughtFish' }, maxRate = 0.5 },
```

| Field | Meaning |
|---|---|
| `serverEvents` | server events. The player is the one who triggered a net event (`source`), or the first argument of a local `TriggerEvent` |
| `playerArg = N` | the player id is argument number N instead |
| `amountArg = N` | argument N is the amount (for example the number of crafted items). Default: 1 per event |
| `maxRate` | most events per second per player, extra ones are ignored |
| `clientEvents` | events on the player's PC (a local `TriggerEvent` or `TriggerClientEvent` from the server). They are added up and sent with the normal reports, so `maxRate` is the limit (default 1 per second) |

To find the event name, look in the other script for `TriggerEvent(`, `TriggerServerEvent(` or
`TriggerClientEvent(` where it finishes the action. Prefer **server** events: anything that happens only on the
player's PC can be faked by a cheater, which is why client events are always rate limited.

Example, a crafting script that fires `crafting:server:crafted(source, item, amount)`:

```lua
crafting = { enabled = true, custom = true, skill = 'crafting', unit = 'items', xp = 10, every = 1,
             serverEvents = { 'crafting:server:crafted' }, amountArg = 3, maxRate = 2.0 },
```

> A net event fired by the client with `TriggerServerEvent` is something the player can send by hand.
> Keep `maxRate` low for those, or use a way below.

### 2. One export

Add one line where the other script gives the reward, on the server:

```lua
exports['5motion_skills']:AddActivity(source, 'fishing', 1)
```

`AddActivity` uses the `xp` / `every` of the activity and respects the hourly cap. It returns the XP really added.

### 3. Plain XP

```lua
exports['5motion_skills']:AddXP(source, 'crafting', 25, 'crafted a lockpick')
exports['5motion_skills']:AddXP(source, 'crafting', 25, 'quest', { cap = true, multipliers = false })
```

`cap = true` counts it toward the hourly cap (default: no), `multipliers = false` skips boosts and `xp` perks.

## Your own activity

```lua
mining = { enabled = true, custom = true, skill = 'mining', unit = 'rocks', xp = 5, every = 1,
           label = { en = 'Mining a rock', pl = 'Wydobycie skały' },
           unitLabel = { en = '{n} rocks', pl = '{n} skał' } },
```

Then give it with an event or `AddActivity`, as above. It is listed in the menu under "How to level up" of its
skill. See [Skills and perks → Adding your own skill](skills.md#adding-your-own-skill) for the full example.
