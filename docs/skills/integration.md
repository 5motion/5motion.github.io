# Integration

[← Overview](./)

- [Server exports](#server-exports)
- [Client exports](#client-exports)
- [Events](#events)
- [Radial menu](#radial-menu)
- [Notifications](#notifications)
- [A custom framework](#a-custom-framework)
- [Bridge functions](#bridge-functions)

## Server exports

| Export | Returns | |
|---|---|---|
| `AddXP(source, skill, amount, reason?, options?)` | XP really added | `options = { cap = false, multipliers = true }`: `cap` counts it toward the hourly cap, `multipliers` applies boosts and `xp` perks |
| `AddActivity(source, activity, amount?)` | XP really added | XP of an activity from `Config.Activities` (`amount / every × xp`), with the hourly cap |
| `GetSkillLevel(source, skill)` | number or nil | |
| `GetSkillXP(source, skill)` | number or nil | total XP |
| `SetSkillLevel(source, skill, level)` | boolean | sets XP to the start of that level, no rewards. A lower level removes the perks of that tree (points come back) |
| `ResetSkill(source, skill)` | boolean | XP, level and perks of that skill back to zero |
| `HasPerk(source, perk)` | boolean | a perk id or a `flags` name |
| `GetEffect(source, bonus, skill?)` | number | total of a bonus, `skill` = only perks of that tree. `0` for a disabled bonus |
| `GetProfile(source)` | table or nil | `{ skills = { [id] = { xp, level, points, … } }, perks = { … } }` |
| `Paycheck(source, amount, account?)` | | tell the script a player was paid (frameworks without paycheck detection) |

```lua
local skills = exports['5motion_skills']

skills:AddActivity(source, 'repairs', 1)

if skills:GetSkillLevel(source, 'mechanics') >= 10 then
    -- unlock an advanced repair
end

local speed = skills:GetEffect(source, 'repairSpeed')   -- 0.2 = 20% faster
```

Exports return `nil` / `false` / `0` while the player has no character loaded.

## Client exports

| Export | |
|---|---|
| `OpenMenu()`, `CloseMenu()`, `ToggleMenu()` | the skills menu |
| `IsOpen()` | is the menu open |
| `GetSkillLevel(skill)` | level of the local player |
| `HasPerk(perk)` | perk id or flag |
| `GetEffect(bonus, skill?)` | total of a bonus for the local player |

```lua
local duration = math.floor(8000 * (1 - exports['5motion_skills']:GetEffect('craftSpeed')))
```

## Events

Server, local (`AddEventHandler`):

| Event | Arguments |
|---|---|
| `5motion_skills:xpGained` | `source, skill, amount, reason` |
| `5motion_skills:levelUp` | `source, skill, newLevel, oldLevel` |
| `5motion_skills:perkUnlocked` | `source, perk, skill, price` |
| `5motion_skills:respec` | `source, skill, price` |
| `5motion_skills:reward` | `source, skill, level, lines` (texts of what was given) |
| `5motion_skills:death` | `source, xpLost` |
| `5motion_skills:admin` | `admin, action, target, { skill, value }` (`admin` = 0 from the console) |

```lua
AddEventHandler('5motion_skills:levelUp', function(source, skill, level)
    if skill == 'driving' and level == 20 then
        -- give a car voucher, post to Discord, …
    end
end)
```

Client, local:

| Event | |
|---|---|
| `5motion_skills:client:xpGained` | `skill, amount, levelUp` (`levelUp` = new level or nil). Listen to it |
| `5motion_skills:client:openMenu` | trigger it to open the menu (used by qb radial menus) |

## Radial menu

`Config.Menu.radial.system = 'auto'` adds a "Skills" entry to the first running radial menu:

| System | How |
|---|---|
| `5motion_hud` | `addRadialItem`, sub menu with `parent` |
| `ox_lib` | `lib.addRadialItem`, sub menu with `parent` |
| `qb-radialmenu`, `qbx_radialmenu` | `AddOption`, opens through the `5motion_skills:client:openMenu` event |

The entry comes back by itself when the radial resource restarts, and disappears when this script stops.
Set a name instead of `'auto'` to force one system, or `false` to add nothing.

**Another radial script:** set `system = 'custom'` and fill these two functions in `bridge/client.lua`:

```lua
function addCustomRadial()
    exports['my_radial']:AddItem({
        id = '5motion_skills',
        label = locale('radial_label'),
        icon = Config.Menu.radial.icon,
        action = function()
            openMenu()
        end
    })

    return true
end

function removeCustomRadial()
    exports['my_radial']:RemoveItem('5motion_skills')
end
```

Or skip the bridge and add an item in your radial's own config that triggers the local client event
`5motion_skills:client:openMenu`, or calls `exports['5motion_skills']:OpenMenu()`.

## Notifications

`Config.Notify.system` picks where messages go ([Configuration → Notifications](configuration.md#notifications)).
Any other notification script: replace the body of `notify(text, kind)` in `bridge/client.lua`:

```lua
function notify(text, kind)
    exports['my_notify']:Show(text, kind or 'info', 4000)
end
```

`kind` is `'info'`, `'success'`, `'error'` or `'warning'`.

## A custom framework

Each framework has a folder in `bridge/` with a `client.lua` and a `server.lua`. Every file starts with a
check, so only one of them loads. For your own framework:

1. Copy `bridge/standalone` to `bridge/myframework`.
2. Change the first line of both files to `if Config.Framework ~= 'myframework' then return end`
   and `name = 'myframework'`.
3. Add both files to `fxmanifest.lua` next to the other `bridge/<framework>/` lines (before `bridge/client.lua` /
   `bridge/server.lua`), and to `escrow_ignore`.
4. Fill the functions, then set `Config.Framework = 'myframework'`.

| Server function | |
|---|---|
| `Framework.getCharacterId(source)` | **the only one that is required**: a unique id of the loaded character, `nil` when none is loaded |
| `Framework.hasGroup(source, group)` | admin groups in `Config.Admin.groups` |
| `Framework.removeMoney(source, account, amount, reason)` / `addMoney(…)` | `true` on success. Perk prices, tree resets, rewards, `paycheck` |
| `Framework.addItem(source, item, count, metadata)` | item rewards (ox_inventory is used first when it runs) |
| `Framework.getJob(source)` | `name, grade` for perks with `jobs` |
| `Framework.getNeed(source, need)` / `setNeed(source, need, value, amount)` | statuses 0–100 for `hungerRate`, `thirstRate`, `stressGain` |

| Client function | |
|---|---|
| `Framework.notify(text, kind)` | `true` when shown, used with `Config.Notify.system = 'framework'` |
| `Framework.getJobLabel(job)`, `Framework.getItemLabel(item)` | names in the menu (optional) |

Call `onCharacterLoaded()` on the client when a character is loaded (and `onCharacterUnloaded()` when it is
unloaded), and `onCharacterUnloaded(source)` on the server when a player logs out to the character screen.
Look at `bridge/qbx` for an example. Without these calls the client only asks for the profile during the first
30 seconds after the resource starts, and switching characters keeps the old profile.

To make paychecks count, call `reportMoneyAdded(source, account, amount, reason)` from your framework's
"money added" event, or use the `Paycheck` export.

## Bridge functions

`bridge/client.lua` and `bridge/server.lua` are shared by every framework and are open to edit.

**Server**

| Function | |
|---|---|
| `getCharacterId(source)` | id the profile is saved under |
| `isSkillsAdmin(source)` | ACE from `Config.Admin.ace` or a framework group |
| `removeMoney`, `addMoney`, `addItem`, `getItemLabel`, `getPlayerJob` | money, items and jobs through the framework |
| `getNeed`, `addNeed` | statuses for the survival bonuses |
| `onPaycheck(handler)`, `firePaycheck`, `reportMoneyAdded` | paycheck detection |
| `setCarryBonus(source, kg)` | extra inventory weight, ox_inventory by default. Put another inventory's call here |

**Client**

| Function | |
|---|---|
| `notify(text, kind)` | every message the script shows |
| `getNotifySettings`, `getNotifySystem`, `hudNotify` | notification routing |
| `getHudTheme()` | accent colour from 5motion_hud |
| `getItemLabel(item)`, `getJobLabel(job)` | names shown in the menu |
| `isPlayerDead()` | used by `Config.Death`, add your ambulance script's "downed" check |
| `getRadialSystem`, `addRadialEntry`, `removeRadialEntry`, `addCustomRadial`, `removeCustomRadial` | radial menu |
