# Frontend Developer Assignment: React Dashboard

This project is a simple dashboard built with React.js and TypeScript, displaying a list of "Runs" and their details.

## Project Structure

- `src/`
  - `components/`: React components
    - `ListPage.tsx`: Displays the list of runs
    - `DetailsPage.tsx`: Shows details of a single run
  - `types.ts`: TypeScript interfaces
  - `App.tsx`: Main application component
- `public/`
  - `data/runs.json`: Sample JSON data for runs
  - `babylon.html`: HTML file for Babylon.js 3D text rendering

## Libraries Used

- React
- React Router
- Babylon.js
- Tailwind CSS (for styling)
- Preline

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/reachSahilWassan/run-app.git
   cd runApp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

## Additional Notes

- The application uses sample data stored in `public/data/runs.json`. In a real-world scenario, this would be replaced with API calls.
- The 3D text rendering is done using Babylon.js in an iframe. The color of the text can be changed using the buttons on the Details page.