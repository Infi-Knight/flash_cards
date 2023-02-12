# flash_cards

## Spec | Overview

The user creates vocabulary flashcards they want to study. When reviewing a flashcard, the user can choose whether they got it right or not. Each time they gets it right, the time for the card to reappear is increased. If they gets it wrong, the card is reset to reappear much sooner. This is a basic spaced repetition learning model.


### Admin Interface:

- Create tool where the user can create a single word and definition
- View cards tool that displays all cards and their current status (bin, time to next appearance, # of times answered incorrect)

### Flashcard Logic:

- There are 12 bins of cards, each representing increasing levels of mastery.
- Each user-word starts out in bin 0.
- If a user gets a word right, it moves to the next bin, up to bin 11.
- If a user gets a word wrong, it goes back to bin 1.
- Bins 1-11 are associated with the following timespans:  5 seconds, 25 seconds, 2 minutes, 10 minutes, 1 hour, 5 hours, 1 day, 5 days, 25 days, 4 months, and never. The timespans reflect the amount of time to wait before the next review of that card.

### Reviewing Words:
- If any words at bin 1 or higher have reached 0 time or less, review these first.
- For the subset above, review higher-numbered bins before lower bins.
- Between two words of the same bin and same time for review, order does not matter.
- If all words in bin 1 or higher have positive timers on them, start drawing new words from bin 0 (order does not matter).
- If there are no words in bin 0 and all other words still have positive timers, display a message: “You are temporarily done; please come back later to review more words.”
Forgetting Words:
- If a user has gotten any single word wrong 10 times ever (even if they got the word right in between; this is a lifetime count), the word gets put into a “hard to remember” bin and is never shown again.
- If all words are either in the last bin (never review) or in “hard to remember”, display a message “you have no more words to review; you are permanently done!”

### Study Interface - User Interaction:
- When a user loads the app, he is a shown a word.
- When he sees a word and clicks “show definition” the definition displays.
- After seeing the definition, he clicks “I got it” or “I did not get it



## Implementation
- Please take a look at `frontend/README.md` and `backend/README.md` for a detailed overview of both components
- **NOTE** In the UI, there is an extra bin 12 which represents hard to remember words.
- When reviewing the words, the UI will automatically move to next words or render an appropriate message if required.

### Development instructions

- Go inside `backend` folder, then
  1. Ensure you have mysql installed and running
  2. Create a `.env` file and insert the mysql connection string in the following format e.g `DATABASE_URL=mysql://root:5623005@localhost:3306/shortform_mini_project`
  3. run `npm i`
  4. run `npx prisma db push` to generate the db client and create tables in the database
  5. Start the dev server at port `3001` using `npm run start:dev`
  6. you can also run `npx prisma studio` to visualize the database

- Go inside the `frontend` folder then:
  1. `npm i`
  2. `npm run start` will start serving the SPA on port `3000` and proxy api requests to the backend.

- creating a production build
  1. Put the spa build from frontend (after running `npm run build`) into the backend folder with the name `frontend_build`
  2. Do `npm run build` from inside the backend fodler.
  3. Then serve the generated `dist` folder in the backend

