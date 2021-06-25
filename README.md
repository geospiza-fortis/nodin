# Nodin

## Getting set up

- Clone https://github.com/johncintron/wz_client into `client/wz_client`.
- `npm install`
- `npm run dev` to start the application with inspectable IIFE client code.
- `npm run build` to build the artifacts for serving

## FAQ

### How do I get past the login screen?

Go in the developer console and enter: LoginState.enterGame(); You can also move up the login map by mutating the Camera.y attribute.

### How do I switch maps?

MapleMap.load(id); where id is the map id you want to load.

### How do I attach equips to the character?

MyCharacter.attachEquip(slot, id); where slot is the equip slot and id is the equip id.

### How do I spawn another player?

MapleCharacter.fromOpts(obj).then(m => MapleMap.characters.push(m));
