# Installation

[← Overview](./)

## Requirements

| | |
|---|---|
| FiveM server | any recent artifact, OneSync recommended |
| Framework | Qbox, QBCore, ESX, ND_Core, ox_core or none (standalone) |
| Database | optional: oxmysql. Without it, skills are saved in KVP |
| Optional | ox_inventory (carry weight bonus, item names), 5motion_hud (colours, notifications, radial), ox_lib / qb-radialmenu / qbx_radialmenu (radial entry) |

ox_lib is **not** required.

## Steps

1. Copy the `5motion_skills` folder into `resources`.
2. In `server.cfg`, ensure it **after** the framework and the optional scripts:

   ```cfg
   ensure oxmysql
   ensure qbx_core        # or qb-core / es_extended / ND_Core / ox_core
   ensure ox_inventory    # optional
   ensure 5motion_skills
   ```

3. Start the server. The console shows which framework and storage were picked if something is off.
4. Pick the language in `config.lua`: `Config.Locale = 'en'` (or `'pl'`).

The script starts working right away. The database table is created by itself.

## Framework detection

`Config.Framework = 'auto'` picks the first running framework in this order:
`qbx_core` → `qb-core` → `es_extended` → `ND_Core` → `ox_core` → standalone.

You can force one: `'qbx'`, `'qb'`, `'esx'`, `'nd'`, `'ox'` or `'standalone'`.

Skills are saved **per character**:

| Framework | Saved under |
|---|---|
| Qbox / QBCore | `citizenid` |
| ESX | `identifier` (`char1:…` with multicharacter) |
| ND_Core | `nd:<character id>` |
| ox_core | `ox:<charId>` |
| standalone | the player's FiveM license, so one profile per account |

A custom framework needs its own folder in `bridge/`. See [Integration → A custom framework](integration.md#a-custom-framework).

## Storage

```lua
Config.Storage = {
    type = 'auto',          -- 'auto', 'oxmysql' or 'kvp'
    table = '5motion_skills',
    interval = 120          -- seconds between saves of changed profiles
}
```

- **oxmysql**: one table, `identifier` + JSON `data` (XP, perks, reset cooldowns, claimed rewards). It is created on the first start.
- **KVP**: no database at all, the data stays in the server's KVP store. Good for testing and small servers.
- `auto` uses oxmysql when it is installed, otherwise KVP.

Profiles are also saved when a player leaves and when the resource stops.

> Deleting characters: if you have foreign keys, you can add one from `5motion_skills.identifier` to your
> characters table with `ON DELETE CASCADE`, so skills disappear together with the character.

## Opening the menu

By default it opens three ways: `/skills`, the **K** key (players can rebind it in *Settings → Key Bindings → FiveM*)
and an entry in your radial menu. See [Configuration → Menu](configuration.md#menu) to change or turn off any of them.

## Updating

1. Back up your `config.lua`, `skills.lua`, `effects.lua`, `locales/` and any `bridge/` changes.
2. Replace the folder and copy your files back, or merge new options from the new `config.lua`.
3. Restart the resource. If a perk tree changed, players whose unlocked perks no longer fit get that
   tree reset for free and see a message. Their XP and levels are never lost.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Your skills are still loading" | No character is loaded yet, or `getCharacterId` returns nothing for your framework. Check the framework detection. |
| Nothing is saved after a restart | oxmysql missing or failing → the console says *saving to KVP instead*. Check the oxmysql connection. |
| The menu does not open | Another NUI window has focus, or the command / key are turned off. Try `exports['5motion_skills']:OpenMenu()` in F8 (`/skills` works too). |
| No radial entry | No supported radial running, or `Config.Menu.radial.system` points to one that is not started. See [Integration → Radial](integration.md#radial-menu). |
| A bonus does nothing | It is turned off in `effects.lua` / `Config.Bonuses.disabled`, or it is a value for other scripts (e.g. `shopDiscount`). See [Bonuses](bonuses.md). |
| XP stops growing | The hourly cap (`Config.Progression.hourlyCap`) was hit for that skill. |
| Console: *unknown bonus "x"* | A perk in `skills.lua` uses a bonus name that does not exist in `effects.lua`. |
| Console: *perk "x" is used twice* | Perk ids must be unique across **all** trees. |
