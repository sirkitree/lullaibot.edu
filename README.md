# LullAIbot Education App

## Overview

LullAIbot Education App is an interactive application that enhances the functionality of Lullabot's AI Education Wiki. The app allows users to submit new links, browse existing resources through a user-friendly interface, and incentivizes contributions through gamification elements.

## Features

- **Link Input and Categorization**: Submit new links and have them automatically categorized using LLM analysis
- **Resource Display**: Browse resources in tree view, card view, or list view with filtering options
- **Autocomplete**: Intelligent suggestions for adding resources and searching
- **Gamification**: Points system, achievements, leaderboard, and progress tracking

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd lullaibot.edu
```

2. Install dependencies
```bash
cd src
npm install # or yarn
```

3. Start the development server
```bash
npm run dev # or yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

- `/app` - Project documentation
  - `software_specification.md` - Full technical specification
  - `task_list.md` - Implementation task list
- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Application pages
  - `/services` - API integration and business logic
  - `/utils` - Utility functions
  - `/styles` - CSS styles
  - `/hooks` - Custom React hooks
  - `/context` - React context providers
  - `/assets` - Static assets (images, icons)
- `/docs` - Additional documentation

## Development

### Architecture

The application follows a modern React architecture:

- React for UI components
- TypeScript for type safety
- React Router for navigation
- CSS variables for theming

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Contributing

Please read the [software specification](app/software_specification.md) and review the [task list](app/task_list.md) before contributing to the project.

## License

This project is proprietary and owned by Lullabot.

## Acknowledgments

- Based on the Lullabot AI Education Wiki
- Incorporates feedback from the AI Working Group 