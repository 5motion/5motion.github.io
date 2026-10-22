# 5motion_skills

Skill trees that grow while you play. Players shoot, drive, run, swim, fight, fly, sneak and hunt to earn XP,
level up and spend points on perks with real in-game bonuses.

- **14 skills, 21 perks each**: three branches per tree, cross-links between them and a final perk that needs
  two branches. A full tree costs more points than one character gets, so every player has to pick a direction.
- **76 bonus types**: damage per weapon group, recoil, resistances, sprint and swim speed, stamina,
  regeneration, carry weight, engine power, grip, brakes, fuel use, turbulence, paychecks and more.
  You can switch any of them off or add your own in a few lines.
- **XP from playing**: running, cycling, swimming, diving, driving, speeding, boating, flying, shooting,
  hits, melee, hiking, surviving damage, sneaking, hunting and paychecks, all with anti-cheat limits.
- **Hooks into any script without code**: point an activity at an event another script already fires,
  or call one export.
- **Your own skills** can be added in `skills.lua`. Texts can sit right in the block, so you don't need
  locale files.
- **Opens from anywhere**: a command, a key and a radial menu (5motion_hud, ox_lib, qb-radialmenu,
  qbx_radialmenu or your own). The radial is detected automatically.
- **Frameworks**: Qbox, QBCore, ESX, ND_Core, ox_core and standalone, detected automatically. ox_lib is not needed.
- **Storage**: saves to MySQL through oxmysql (the table is created automatically) or to KVP with no database.
- **UI**: dark glass, animated tree, perk tooltips, XP popups, level-up effects. It can use the player's own
  accent colour from 5motion_hud.
- **Languages**: English and Polish included, and new ones are easy to add.

## Quick start

1. Put `5motion_skills` in your `resources` folder.
2. Add `ensure 5motion_skills` to `server.cfg` after your framework (and after oxmysql / ox_inventory if you use them).
3. Restart the server. On the first start it detects your framework, database, notifications and radial menu.
4. In game, open the menu with `/skills`, the **K** key or the radial menu.

Nothing else is required, but take a look at [Configuration](configuration.md). Most servers change
the language, the colours and the XP speed first.

## Documentation

| Page | What is inside |
|---|---|
| [Installation](installation.md) | requirements, `server.cfg`, frameworks, database, updating, troubleshooting |
| [Configuration](configuration.md) | every option of `config.lua`, explained |
| [Skills and perks](skills.md) | how trees work, changing them, adding your own skill |
| [Bonuses](bonuses.md) | all 76 bonus types, conflicts with other scripts, writing your own |
| [Activities](activities.md) | where XP comes from, tuning it, hooking your scripts |
| [Integration](integration.md) | exports, events, radial menus, notifications, bridge functions |
| [FAQ](faq.md) | common questions and problems |

## Files

| File | What it is for |
|---|---|
| `config.lua` | language, framework, menu, colours, saving, XP curve, activities, rewards, admin |
| `skills.lua` | the skills and their perk trees |
| `effects.lua` | every bonus type: what it does, how it is shown, on / off |
| `locales/*.lua` | every text players see |
| `bridge/` | framework, inventory, notification and radial code. It is open, so change it for a custom framework |

The rest of the files are protected by escrow.

## Admin command

```
/skillsadmin <player id> <skill|all> <addxp|setlevel|reset> [value]
```

It works from the server console too. Permissions are set in `Config.Admin`.
