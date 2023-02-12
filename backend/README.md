## Folder structure

- `/docs`: contains auto generated `dbml` files and instructions for viewing them online
- `/prisma`: Prisma schema which gets converted to mysql tables 
- `/src/prisma` contains all the code for setting up the Prisma ORM
- `/src/flash-cards`: this module contains our controllers, services and DTOs for the flash cards logic

## backend APIs:

- **GET** `/api/flash-cards/` returns all the cards in our database
- **POST** `/api/flash-cards/` to add a card to the database =
- **GET** `/api/flash-cards/study` returns the cards ready for review 
- **PATCH** `/api/flash-cards/:id` updates the card's bin, time for next appearance etc
Each of these APIs is inside the controllers file with the associated business logic in `src/flash-cards/flash-card.services.ts` file

## Tools and libraries used

- Framework used: [Nest.js](https://nestjs.com/) - a Node.js framework
- Database: `mysql` ~~hosted on [planetscale.com](https://planetscale.com/)~~
- ORM: [prisma](https://www.prisma.io/)
- ~~server running on a `t2 micro` AWS instance proxied by a [Caddy](https://caddyserver.com/) webserver and using nip.io dns for automating https setup~~
