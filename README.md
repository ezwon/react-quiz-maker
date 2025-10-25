# React Quiz Maker

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Copy .env.example to .env

3. Install your dependencies

```
cd path/to/directory
nvm use
npm install
```

4. Run the app

```
npm run dev
```

5. App Architecture 

- I implemented a feature-based folder structure following the structure of the current API endpoints. 
Based on my experience, this is easier to maintain and understand by new devs joining the project.
- I wrapped the TanStack Queries with hooks, so in case we move to a different plugin it will be easier to adjust as we only to adjust the hooks not the actual implementation across the app.
- I used axios as helper plugin for the api request as its easier to attach middlewares for handling api request related issues and validation
- I used AntDesign UI framework for a decent UI presentation
- I maximize usage of drawers and modals to avoid living base module page and better navigation

6. Notes

- Required UX outline or flow for creating quiz would be possible if api endpoint supports array of question so it can be included on the create payload.
- Implemented creation of Quiz first before adding the question items.
- I enjoy working on this tech exam and also learned new things on TanStack Query :)

 
 