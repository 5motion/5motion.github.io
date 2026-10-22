# Bonuses

[← Overview](./)

Every bonus a perk can give is defined in `effects.lua`. Perks use them by name:

```lua
effects = { weaponDamage = 0.05, carryWeight = 5 }
```

Values of the same bonus from many perks **add up**, up to the bonus `max`. Damage resistances of one kind
never go above 95%.

- [Formats](#formats)
- [Turning bonuses off](#turning-bonuses-off)
- [All bonuses](#all-bonuses)
- [Conflicts with other scripts](#conflicts-with-other-scripts)
- [Reading a bonus in your scripts](#reading-a-bonus-in-your-scripts)
- [Your own bonus](#your-own-bonus)

## Formats

| `format` | Value in `skills.lua` | Shown as |
|---|---|---|
| `percent` | fraction: `0.05` | `+5%` (with `sign = -1`: `-5%`) |
| `number` | plain number | `+10` |
| `hp` | health points | `+10 HP` |
| `kg` | kilograms | `+5 kg` |
| `seconds` | seconds | `+10 s` |
| `perMinute` | points per minute | `+5 / min` |
| `levels` | whole steps, texts in `ui.levels.<name>` | the text of the level |
| `flag` | `1` = on | "On" |

`Config.Bonuses.scale` multiplies every value (except flags and levels), so `0.5` makes all perks half as strong.

## Turning bonuses off

Two ways, both keep perks unlockable. The bonus just does nothing and is hidden in the menu:

```lua
-- config.lua, quick
Config.Bonuses.disabled = { 'recoil', 'carryWeight' }
```

```lua
-- effects.lua, per bonus
Effects.recoil = { enabled = false, ... }
```

Turning off `weaponDamage` turns off the weapon group bonuses (`pistolDamage`…) too, and turning off
`meleeDamage` turns off `fistDamage` and `meleeWeaponDamage`. `GetEffect` returns `0` for a disabled bonus.

## All bonuses

**Combat**

| Bonus | Format | Max | What it does |
|---|---|---|---|
| `weaponDamage` | percent | – | firearm damage (`SetPlayerWeaponDamageModifier`) |
| `pistolDamage`, `smgDamage`, `rifleDamage`, `shotgunDamage`, `sniperDamage` | percent | 50% | added to `weaponDamage` while holding a weapon of that group (`rifleDamage` covers MGs too) |
| `meleeDamage` | percent | – | all melee damage (`SetPlayerMeleeWeaponDamageModifier`) |
| `fistDamage` | percent | 60% | added to `meleeDamage` with bare fists |
| `meleeWeaponDamage` | percent | 60% | added to `meleeDamage` with knives, bats… |
| `vehicleWeaponDamage` | percent | 50% | vehicle-mounted weapons |
| `recoil` | percent, minus | 90% | less camera shake per shot |
| `bulletResist` | percent, minus | 50% | part of bullet damage healed back |
| `meleeResist` | percent, minus | 60% | part of melee damage healed back |
| `explosionResist` | percent, minus | 50% | part of explosion damage healed back |
| `maxArmour` | number | 100 | armour cap above 100 |
| `killHeal` | hp | 50 | health after a kill (`npcs = false` = player kills only) |
| `killArmour` | number | 50 | armour after a kill |
| `stunResist` | percent, minus | 80% | shorter time on the ground after a taser (`base` = 5000 ms) |
| `criticalResist` | flag | 1 | headshots don't kill instantly. Strong, the default trees don't use it |

**Movement**

| Bonus | Format | Max | What it does |
|---|---|---|---|
| `sprintSpeed` | percent | 49% | sprint speed (GTA caps it at +49%) |
| `moveSpeed` | percent | 15% | walking and jogging speed on foot |
| `swimSpeed` | percent | 49% | swimming speed |
| `stamina` | percent, minus | 90% | stamina used while sprinting |
| `swimStamina` | percent, minus | 90% | stamina used while swimming |
| `staminaRegen` | percent | 100% | faster stamina recovery when not sprinting |
| `quietSteps` | percent, minus | 90% | how far NPCs hear you |
| `stealthSpeed` | percent | 30% | speed while sneaking (GTA stealth or `Config.Activities.sneaking.stateBags`) |
| `fallResist` | percent, minus | 80% | part of fall damage healed back |
| `ragdollResist` | flag | 1 | not knocked over by running into people |
| `bikeBalance` | levels | 2 | 1 = hard to fall off a bike, 2 = never falls off |

**Survival**

| Bonus | Format | Max | What it does |
|---|---|---|---|
| `healthRegen` | percent | – | GTA's natural health regeneration speed |
| `regenLimit` | percent | 50% | GTA heals by itself up to half of the bar, this raises the limit |
| `maxHealth` | hp | 100 | max health above 200. **Off by default** |
| `armourRegen` | perMinute | 30 | armour per minute after `delay` = 10 s without damage, up to `limit` = 50 |
| `lungCapacity` | seconds | 40 | longer under water (`base` = 10 s) |
| `fireResist`, `drownResist`, `gasResist`, `animalResist` | percent, minus | 60% | part of that damage healed back |
| `hungerRate`, `thirstRate` | percent, minus | 80% | slower hunger / thirst (framework status, see below) |
| `stressGain` | percent, minus | 80% | less stress gained (framework status) |
| `carryWeight` | kg | – | inventory weight limit |

**Vehicles** (driver only, original handling comes back after leaving the driver seat)

| Bonus | Format | Max | What it does |
|---|---|---|---|
| `vehiclePower` | percent | 100% | engine power of cars, vans, trucks… (`powerClasses`) |
| `motorcyclePower`, `bicyclePower`, `boatPower` | percent | 100% | power of that class, adds up with `vehiclePower` |
| `vehicleTopSpeed` | percent | 50% | top speed (not aircraft) |
| `vehicleBrakes` | percent | 100% | brake force |
| `vehicleGrip` | percent | 50% | tyre grip |
| `wheelspin` | percent, minus | 80% | wheelspin when pulling away |
| `offroadGrip` | percent, minus | 80% | grip lost on dirt and grass |
| `steering` | percent | 25% | steering angle |
| `vehicleDurability` | percent, minus | 80% | body and deformation damage |
| `engineDurability` | percent, minus | 80% | engine damage |
| `crashResist` | percent, minus | 80% | part of crash injuries healed back |
| `fuelUsage` | percent, minus | 50% | part of the used fuel given back |
| `turbulence` | percent, minus | 100% | plane turbulence |
| `heliAgility` | percent | 50% | helicopter roll, pitch and yaw |

**Progress** (handled by the script itself)

| Bonus | Format | What it does |
|---|---|---|
| `xp` | percent | more XP for the skill the perk belongs to |
| `xpAll` | percent | more XP for every skill |
| `xpCap` | percent | higher `Config.Progression.hourlyCap` |
| `respecDiscount` | percent, minus (max 100%) | cheaper tree reset, 100% = free |
| `rewardBonus` | percent | more money from level rewards |

**Work and money**

| Bonus | Format | Max | What it does |
|---|---|---|---|
| `paycheck` | percent | 100% | extra money on top of every paycheck ([Paychecks](configuration.md#paychecks)) |
| `shopDiscount` | percent, minus | 50% | value for your shop scripts |
| `sellPrice` | percent | 50% | value for your selling scripts |
| `craftSpeed`, `repairSpeed` | percent | 50% | value for crafting / mechanic scripts |
| `harvestYield` | percent | 100% | value for farming / mining scripts |
| `lockpickChance` | percent | 50% | value for lockpick scripts |
| `materialSaving` | percent, minus | 50% | value for crafting scripts |
| `craftYield` | percent | 50% | value for crafting scripts |
| `fishingLuck`, `fishingSpeed` | percent | 50% | value for fishing scripts |

The values in this table **do nothing until one of your scripts reads them**.
See [Reading a bonus](#reading-a-bonus-in-your-scripts).

**Other**

| Bonus | Format | Max | What it does |
|---|---|---|---|
| `wantedGain` | percent, minus | 80% | slower GTA wanted level. Useless when your server turns wanted levels off |

### Frameworks and statuses

- `hungerRate`, `thirstRate` and `stressGain` read and change the status through `Framework.getNeed` /
  `Framework.setNeed` in `bridge/<framework>/server.lua`. Qbox / QBCore (`hunger`, `thirst`, `stress` metadata)
  and ESX (`esx_status`) work out of the box. ND_Core, ox_core and standalone have no statuses, so fill those two
  functions there if you use a status script. The status name is the `need` field of the bonus.
- `carryWeight` works with ox_inventory. With another inventory, fill `setCarryBonus` in `bridge/server.lua`.

## Conflicts with other scripts

GTA keeps one value for most of these settings, so the last script that sets it wins. If another script on your
server already controls one of them, turn the bonus off.

| Bonus | Turn it off when you have… |
|---|---|
| `weaponDamage`, weapon groups, `meleeDamage`, `fistDamage`, `meleeWeaponDamage` | a gym script or damage balancing that sets damage modifiers |
| `recoil` | a recoil script |
| `criticalResist` | an ambulance script that handles headshots |
| `stunResist` | a police script with its own taser time |
| `moveSpeed`, `stealthSpeed` | scripts that slow players down (carrying, injuries, drunk walk) |
| `sprintSpeed`, `swimSpeed` | an anticheat that kicks for movement speed |
| `healthRegen`, `regenLimit` | a medical script that turns off natural regeneration |
| `maxHealth` | is off by default. Most ambulance scripts expect 200 max health |
| `maxArmour`, `armourRegen`, `killArmour` | an armour / vest script |
| `carryWeight` | a gym or backpack script that changes the weight limit |
| vehicle bonuses | a tuning, handling or engine swap script |
| `fuelUsage` | a fuel script that keeps fuel only in its own data and overwrites the game level. Read `GetEffect('fuelUsage')` in that script instead |
| `GameStats` (not a bonus) | a gym script that sets GTA stamina / strength. Set `Config.GameStats = false` |

## Reading a bonus in your scripts

```lua
-- server
local discount = exports['5motion_skills']:GetEffect(source, 'shopDiscount')   -- 0.10 = 10%
local price = math.floor(basePrice * (1 - discount))

-- client
local speed = exports['5motion_skills']:GetEffect('craftSpeed')
local duration = math.floor(5000 * (1 - speed))
```

Perks can also carry `flags` that your scripts check:

```lua
if exports['5motion_skills']:HasPerk(source, 'master_miner') then
    -- rare ore
end
```

More exports are listed in [Integration](integration.md).

## Your own bonus

Add a block to `effects.lua` and use its name in any perk. Give it a `label` (or add `ui.effects.<name>` to the
locale files) so the menu shows a name.

```lua
-- A value read by your scripts, like shopDiscount
Effects.goldNuggets = {
    group = 'economy', format = 'percent', max = 0.5, icon = 'gem',
    label = { en = 'Gold nugget chance', pl = 'Szansa na samorodek złota' }
}

-- Client side
Effects.nightVision = {
    group = 'other', format = 'flag', icon = 'eye',
    label = { en = 'Night vision' },
    client = function(value)
        SetNightvision(value > 0)
    end
}

-- Server side, every 30 s while online
Effects.passiveIncome = {
    group = 'economy', format = 'number', icon = 'coins',
    label = { en = '$ every 30 s' },
    serverTick = function(source, value)
        addMoney(source, 'bank', math.floor(value), 'passive income')
    end
}
```

### Hooks

All hooks are optional. `value` is the total of the player's unlocked perks. `0` means the bonus was removed,
so restore the default then.

| Hook | Side | When |
|---|---|---|
| `client(value)` | client | after every change and every 2 s |
| `tick(value, ctx)` | client | every 200 ms (`ctx.dt` = seconds since the last tick) |
| `frame(value, ctx)` | client | every frame, keep it cheap |
| `weapon(value, weapon, ctx)` | client | when the player changes weapon |
| `vehicle(value, ctx)` | client | when the player becomes a driver |
| `vehicleExit(vehicle)` | client | when the player leaves the driver seat |
| `kill(value, ctx, victim, weapon)` | client | after the player kills an NPC or a player |
| `server(source, value)` | server | after every change and once after the character loads |
| `serverTick(source, value)` | server | every 30 s while the bonus is active |
| `setup()` | both | once at start (`IsDuplicityVersion()` = server) |
| `reset()` | client | when bonuses are removed (logout, resource stop) |

Instead of a hook, `resist = 'bullet' | 'melee' | 'fall' | 'fire' | 'explosion' | 'crash' | 'drown' | 'gas' | 'animal'`
uses the built-in damage reduction: `0.2` heals back 20% of that damage.

`ctx` holds `ped`, `player`, `vehicle`, `driver`, `class`, `onFoot`, `sprinting`, `swimming`, `weapon`,
`sinceDamage` (seconds since the player was hurt), `effects` (all bonus totals) and `dt`.

Helpers you can use inside hooks:

| Helper | Side | |
|---|---|---|
| `scaleVehicleHandling(vehicle, field, multiplier)` | client | changes a handling value, the original comes back when the player leaves the driver seat |
| `getEffect(name)` | client | total of another bonus |
| `getPlayerEffect(source, name)` | server | total of another bonus |
| `getNeed`, `addNeed`, `addMoney`, `addItem`, `onPaycheck` | server | from `bridge/server.lua` |

If a hook throws an error, the console prints it once with the bonus name and the rest keep working.
