# roleBot for Discord

## About
- A very simple Discord bot that uses reactions to allow users to add/remove their own roles.

- Join the Discord server for any help and to keep up with updates: https://discord.gg/USxvyB9QTz

## Requirements
1: Node 16+ installed on server

2: Discord bot with:
  - Server Members Intent
  - Message Content Intent
  - Manage Roles permission

 
## Install
```
git clone https://github.com/RagingRectangle/roleBot.git
cd roleBot
cp -r config.json.example config.json
npm install
```

## When running Docker

```
git clone https://github.com/RagingRectangle/roleBot.git
cd roleBot
cp -r config.json.example config.json
docker-compose up -d -- build rolebot
```

## Discord Setup
- Create the roles users can select from.
- Create channel and make a post explaining how to click which reaction to add/remove which role.
- Add the reactions to the post (Until other users have reacted you might have to manually add/remove your own roles).

## Config Setup
- **botToken:** Discord bot token.
- **roleChannelIDs:** List of channel IDs where roles can be assigned.
- **roleMessageDeleteSeconds:** How long to wait before the confirmation message is deleted.
- **roles:** List of channel IDs where roles can be assigned.
    - **roleID:** ID of the role.
    - **emojiName:** Either a built-in Unicode emoji (Get correct form by escaping emoji: `\😺`) or the name of a custom emoji.

## Usage
- **Basic:** `node roles.js`
- **PM2:** `pm2 start roles.js`
- **Docker:** No action required, container will stay up