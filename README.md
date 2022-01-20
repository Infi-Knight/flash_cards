# flash_cards

Demo: https://3.221.190.74.nip.io/

Please notify me if you are unable to access the demo or if it is down. 

- Please take a look at `frontend/README.md` and `backend/README.md` for a detailed overview of both components

## Development instructions

- Go inside `backend` folder, then
  1. Ensure you have mysql installed and running
  2. Create a `.env` file and insert the mysql connection string in the following format e.g `DATABASE_URL=mysql://root:5623005@localhost:3306/shortform_mini_project`
  3. run `npm i`
  4. Start the dev server at port `3001` using `npm run start:dev` 

- Go inside the `frontend` folder then:
  1. `npm i`
  2. `npm run start` will start serving the SPA on port `3000` and proxy api requests to the backend.

- creating a production build
  1. Put the spa build from frontend (after running `npm run build`) into the backend folder with the name `frontend_build`
  2. Do `npm run build` from inside the backend fodler.
  3. Then serve the generated `dist` folder in the backend

