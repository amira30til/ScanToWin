## Hard coded Values

- FORTUNE_WHEEL_NAME - used in

  - pages/user/index.jsx

- ADMIN_ROLE
- SUPER_ADMIN_ROLE
  - app.jsx

## ssh connection

- generate ssh key: ssh-keygen -t ed25519 -C "amine-ec2"
- copy paste to github : cat ~/.ssh/aminescan2win.pub
- use it:
  - eval "$(ssh-agent -s)"
  - ssh-add ~/.ssh/aminescan2win

## copy .env.production

`scp -i "/c/Users/Amine/Desktop/docker/Docker-Projects/example-1.pem" -r ./backend/.env.production ec2-user@16.171.170.101:/home/ec2-user/scan2win/backend`

## run ts file:

`npx ts-node seeders/seed-clicked.ts`

## Migrations

- generate migration: `npm run migration:generate --name=CREATE_USER`
- run migration: `npm run migration:run`
