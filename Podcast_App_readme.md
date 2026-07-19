# 🎙️ Podcast Web Application

📌vercel link - add link 

A web-based audio streaming application built with React.js that allows users to browse podcast shows, manage favorite episodes, and listen to audio tracks seamlessly. This is the final project in our JavaScript learning journey with CodeSpace.

## 🚀 Features

### 📻 Global Audio Player
*   **Persistent Playback:** Listen to audio files continuously with an integrated global audio controller that plays music smoothly even when navigating between different views.
*   **Playback Controls:** View current progress, pause, resume, and seek through episodes.
*   **Session Protection:** Confirms with the user before reloading or closing the page if audio is actively playing to prevent accidental data loss.

### 💖 Favourites Management
*   **Save Episodes:** Mark or unmark episodes as favorites with instant visual feedback (e.g., filled heart icons).
*   **Persistent Storage:** Uses `localStorage` to ensure favorited episodes persist across browser sessions.
*   **Dedicated Favourites Page:** 
    *   Displays the associated show and season for each favorited episode.
    *   Logs the exact date and time an episode was added.
    *   Groups favorites by their respective show titles.
*   **Sorting Options:** 
    *   Sort episodes within each show group alphabetically (A–Z & Z–A).
    *   Sort favorites globally by the date added (newest or oldest first).

### 👌 Recommended Shows Carousel
*   **Sliding Carousel:** A horizontally scrollable (via swipe or navigation arrows) carousel showcasing recommended shows.
*   **Rich Media Display:** Each item displays the show's image, title, and genre tags.
*   **Infinite Loop:** Automatically loops back to the beginning once the end of the carousel is reached.

## 📁 App Structure 

my-project/
├── src/
│   ├── api/
│   │   └── fetchData.js
│   ├── components/
│   │   ├── Filters/
│   │   ├── Podcasts/
│   │   └── UI/
│   ├── context/
│   │   ├── AudioContext.jsx
│   │   ├── PodcastContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   └── useTheme.js
│   ├── pages/
│   │   ├── FavouriteEpisodes.jsx
│   │   ├── FavouriteEpisodes.module.css
│   │   ├── Home.jsx
│   │   ├── Home.module.css
│   │   └── ShowDetail.jsx
│   ├── styles/
│   │   └── theme.css
│   ├── utils/
│   │   └── formatDate.js
│   ├── App.jsx
│   ├── data.js
│   ├── index.css
│   ├── main.jsx
│   └── RecommendedCarousel.jsx
└── package.json



## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Storage:** Web Storage API (`localStorage`)
*   **Hosting:** Vercel
*   **Styling:** CSS Modules
*   **Data Persistence:** Web Storage API (`localStorage`)
*   **Build Tool:** Vite



## 🚀 Getting Started
1. Clone the repository:
   ```bash
   git clone <your-repository-url>

2. Install dependencies:
   ```bash
   npm install

3. Run the development server:
   ```bash
   npm run dev

## Note:
This is a Project of CodeSpace. 