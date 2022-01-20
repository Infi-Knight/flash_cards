## Folder structure

- `/docs`: contains auto generated `dbml` files and instructions for viewing them online
- `/prisma`: Prisma schema which gets converted to mysql tables 
- `/src/prisma` contains all the code for setting up the Prisma ORM
- `/src/flash-cards`: this module contains our controllers, services and DTOs for the flash cards logic

## Tools and libraries used

- Framework used: [Nest.js](https://nestjs.com/) - a Node.js framework
- Database: `mysql` hosted on [planetscale.com](https://planetscale.com/)
- ORM: [prisma](https://www.prisma.io/)
- server running on a `t2 micro` AWS instance proxied by a [Caddy](https://caddyserver.com/) webserver and using nip.io dns for automating https setup
