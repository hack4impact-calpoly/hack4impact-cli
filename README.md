# Hack4Impact CLI
Project builder CLI for Next.js

## Usage:
```
hack4impact-cli <command>
```

### Available commands:

- `init` - Sets up a new Next.js project with create-next-app, with flag presets and additional config (husky, prettier, jest)
- `database` - Set up database & files (MongoDB)
- `deploy` - Directs user to deployment service (Vercel / AWS)
- `auth` - Set up auth (Kinde Auth)


## To start running the npm package locally:
```
npm run build
```
```
npm link
```
In another terminal:
```
cd demo
```
```
npm link hack4impact-cli
```
```
hack4impact-cli <command>
```

### While developing, to see local changes you need to update the build. Go to root directory:
```
npm run build
```
