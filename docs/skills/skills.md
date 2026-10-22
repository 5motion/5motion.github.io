# Skills and perks

[← Overview](./)

Skills and their trees live in `skills.lua`. The texts live in `locales/*.lua` (`skills.<id>`, `perks.<id>`),
or you can write them directly in the block.

## Default skills

| Id | Skill | XP from (out of the box) | GTA stat |
|---|---|---|---|
| `shooting` | Shooting | shots fired, hits on people | shooting ability |
| `driving` | Driving | driving, speeding, boats | wheelie ability |
| `athletics` | Athletics | running, cycling | stamina |
| `strength` | Strength | melee hits | strength |
| `swimming` | Swimming | swimming, diving | lung capacity |
| `flying` | Flying | flying | flying ability |
| `survival` | Survival | hiking off-road, surviving damage | – |
| `career` | Career | paychecks | – |
| `stealth` | Stealth | sneaking | – |
| `hunting` | Hunting | killing animals | – |
| `fishing` | Fishing | **your scripts** (`fishing` activity) | – |
| `mechanics` | Mechanics | **your scripts** (`repairs` activity) | – |
| `trade` | Trade | **your scripts** (`trading` activity) | – |
| `crafting` | Crafting | **your scripts** (`crafting` activity) | – |

The last four have no XP source in GTA itself. Connect them to your fishing, mechanic, shop and crafting scripts,
either with an event (no code needed) or with one export. See [Activities](activities.md#hooking-other-scripts).
If you have no such script, hide the tree with `enabled = false`.

## How a tree is built

Every default tree has 21 perks in 7 rows:

```
row 1                 root
row 2        A1        B1        C1            three branches
row 3        A2   AB   B2   BC   C2            AB / BC = cross perks (one of two neighbours)
row 4        A3        B3        C3
row 5        A4   AB   B4   BC   C4
row 6        A5        B5        C5
row 7                 final                     needs 2 of A5 / B5 / C5
```

You don't place perks yourself. Every perk lands **one row below the perks it requires**, perks in a row are
spread evenly, and the required level and cost come from `Config.Tree` by row:

```lua
Config.Tree = {
    levels = { 1, 3, 6, 10, 15, 21, 27 },  -- skill level needed per row
    costs  = { 1, 1, 1, 2, 2, 3, 4 }       -- points per row
}
```

A full tree costs 38 points and a level 30 player has 30, so players choose. Change the costs or
`Config.Progression.pointsPerLevel` to make trees easier or harder to finish.

You can use any shape: one long line, two branches, ten perks in a row. The menu fits the width and the row
spacing to what you write.

## Perk fields

```lua
{ id = 'marksman', icon = 'crosshair', requires = { 'steady_hands' }, effects = { weaponDamage = 0.03 } },
```

| Field | Meaning |
|---|---|
| `id` | unique across **all** trees |
| `icon` | any name from [lucide.dev/icons](https://lucide.dev/icons) |
| `effects` | bonuses from `effects.lua`: `{ name = value }`. Values of the same bonus add up across perks, up to its `max` |
| `requires` | **all** of these perks first |
| `requiresAny` | **one** of these perks first |
| `requiresCount` | with `requiresAny`: how many of them are needed (`2` = two of the list) |
| `flags` | names other scripts can check: `HasPerk(source, 'name')` |
| `price` | money on top of points (`Config.Unlock.account`) |
| `jobs` | only for these jobs: `{ 'police', 'sheriff' }`, or with a minimum grade: `{ police = 2 }` |
| `ace` | only with this ACE permission, e.g. `'skills.vip'` |
| `label`, `description` | text instead of the locale file: a string or `{ en = '…', pl = '…' }` |
| `row`, `col`, `level`, `cost` | override the automatic layout (`col` can be fractional, e.g. `2.5`) |

Bonus values: percent bonuses use fractions (`0.05` = 5%), the others use plain numbers (`carryWeight = 5` = 5 kg).
The format of each one is listed in [Bonuses](bonuses.md).

## Skill fields

| Field | Meaning |
|---|---|
| `id` | unique id, also the key in `Config.Activities[...].skill` and exports |
| `icon`, `color` | lucide icon and hex colour of the tree |
| `perks` | the tree |
| `enabled = false` | hides the tree and gives no XP. Saved XP and perks stay in the database |
| `stat` | GTA stat set from the level (`MP0_STAMINA`, `MP0_STRENGTH`, `MP0_SHOOTING_ABILITY`, `MP0_LUNG_CAPACITY`, `MP0_WHEELIE_ABILITY`, `MP0_FLYING_ABILITY`) |
| `label`, `description` | text instead of the locale file |
| `maxLevel`, `baseXp`, `growth`, `pointsPerLevel`, `startingPoints`, `hourlyCap`, `xpMultiplier` | override `Config.Progression` for this skill |
| `respec = false`, `respecPrice`, `respecCooldown` | override `Config.Respec` (cooldown in minutes) |
| `rewards` | extra level rewards: `{ [10] = { money = 500, items = { { name = 'bandage', count = 5 } } } }` |

## Changing a tree

Edit perks freely: values, icons, order, requirements, even remove perks. Players don't need to do anything.
When a player loads in, the server checks every tree. If their unlocked perks no longer fit (too many points
spent, a missing requirement, a level too low), **that tree is reset for free** and the player gets a message.
XP and levels are never touched.

Removing a perk gives its points back. Renaming a perk id counts as removing the old perk and adding a new one,
so players unlock it again with the returned points. Turning a whole tree off (`enabled = false`) keeps its
saved XP and perks in the database, and they come back when you turn it on again.

## Adding your own skill

At the bottom of `skills.lua` there is a ready example of a **Mining** skill. Remove the `--[[` and `]]`
around it to try it. The short version:

```lua
Config.Skills[#Config.Skills + 1] = {
    id = 'mining',
    icon = 'pickaxe',
    color = '#c08457',
    label = { en = 'Mining', pl = 'Górnictwo' },
    description = { en = 'Dig faster and find more.', pl = 'Kop szybciej i znajduj więcej.' },
    perks = {
        { id = 'mining_basics', icon = 'pickaxe', effects = { harvestYield = 0.05 },
          label = { en = 'Basics' }, description = { en = 'You know where to hit.' } },
        { id = 'mining_prospector', icon = 'gem', requires = { 'mining_basics' }, effects = { harvestYield = 0.10 },
          label = { en = 'Prospector' }, description = { en = 'More ore from every rock.' } },
        { id = 'mining_master', icon = 'crown', requires = { 'mining_prospector' }, flags = { 'master_miner' },
          label = { en = 'Master Miner' }, description = { en = 'Rare ore shows up for you.' } }
    }
}
```

Then give it XP. Add an activity in `config.lua`:

```lua
-- Config.Activities
mining = { enabled = true, custom = true, skill = 'mining', unit = 'rocks', xp = 5, every = 1,
           label = { en = 'Mining a rock' }, unitLabel = { en = '{n} rocks' } },
```

and either call it from your mining script:

```lua
exports['5motion_skills']:AddActivity(source, 'mining', 1)
```

or, without touching that script, listen to an event it already fires
(see [Activities → Hooking other scripts](activities.md#hooking-other-scripts)):

```lua
mining = { enabled = true, custom = true, skill = 'mining', unit = 'rocks', xp = 5, every = 1,
           serverEvents = { 'mining:server:rockMined' } },
```

Finally, use the perks in your mining script:

```lua
local bonus = exports['5motion_skills']:GetEffect(source, 'harvestYield')   -- 0.15 = +15%
local amount = math.floor(baseAmount * (1 + bonus))

if exports['5motion_skills']:HasPerk(source, 'master_miner') then
    -- chance for rare ore
end
```

Need a bonus that doesn't exist yet? Add it in `effects.lua`. See [Bonuses → Your own bonus](bonuses.md#your-own-bonus).

## Texts in locale files

Instead of `label` / `description` in the block, you can add the texts to every language file:

```lua
-- locales/en.lua
skills = {
    mining = { label = 'Mining', description = 'Dig faster and find more.' },
},
perks = {
    mining_basics = { label = 'Basics', description = 'You know where to hit.' },
},
```
