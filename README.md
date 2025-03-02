# LullAIbot Education App

## Overview

LullAIbot Education App is an interactive application that enhances the functionality of Lullabot's AI Education Wiki. The app allows users to submit new links, browse existing resources through a user-friendly interface, and incentivizes contributions through gamification elements.

## Features

- **Link Input and Categorization**: Submit new links and have them automatically categorized using LLM analysis
- **Resource Display**: Browse resources in tree view, card view, or list view with filtering options
- **Autocomplete**: Intelligent suggestions for adding resources and searching
- **Gamification**: Points system, achievements, leaderboard, and progress tracking

## Admin Functionality

The application includes a comprehensive admin dashboard for site administrators to manage users, content, and monitor site activity.

### Accessing Admin Features

- Log in with admin credentials (email: admin@example.com in development mode)
- Navigate to the Admin Dashboard via the navigation menu (only visible to admin users)

### Admin Dashboard Components

1. **User Management**
   - View all users with pagination and search functionality
   - Edit user details (name, email, role)
   - Delete users when necessary

2. **Content Moderation**
   - Review pending resources awaiting approval
   - Approve or reject submitted resources
   - Edit resource details (title, URL, description, category, tags)
   - Delete inappropriate resources

3. **Analytics Dashboard**
   - View key metrics (total users, active users, total resources, pending resources)
   - Monitor user registration trends over time
   - Track resource distribution by category
   - Analyze user activity patterns

### Mock API for Development

During development, the admin functionality uses a mock API that simulates server responses. This allows for testing the admin features without a backend connection. The mock data is automatically registered when running in development mode.

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

### Testing Admin Features

To test the admin functionality in development mode:

1. Log in using the following credentials:
   - Email: admin@example.com
   - Password: password (or as configured in your development environment)

2. After logging in, you'll see an "Admin" link in the navigation menu
   
3. The admin dashboard includes:
   - User Management: Test editing user roles and details
   - Content Moderation: Approve/reject/edit resources
   - Analytics: View mock statistics and charts

Note: The admin functionality uses mock data in development mode. The charts require chart.js and react-chartjs-2 packages, which are included in the dependencies.

## Project Structure

- `/app` - Project documentation
  - `software_specification.md` - Full technical specification
  - `task_list.md` - Implementation task list
- `/src` - Source code
  - `/components` - Reusable UI components
    - `/admin` - Admin dashboard components
      - `UserManagement.tsx` - User management interface
      - `ContentModeration.tsx` - Content moderation interface
      - `AnalyticsDashboard.tsx` - Analytics and statistics
  - `/pages` - Application pages
    - `AdminDashboardPage.tsx` - Admin dashboard main page
  - `/services` - API integration and business logic
  - `/utils` - Utility functions
    - `adminMockApi.ts` - Mock data and functions for admin features
    - `mockApiRegister.ts` - API interceptors for admin functionality
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
- Chart.js for analytics visualizations

### Admin Feature Development

The admin functionality follows these architectural principles:

1. **Component-Based Structure**
   - Modular components for each admin feature
   - Tabs-based navigation for intuitive user experience
   - Material-UI components for consistent styling

2. **Mock API System**
   - API interceptors to simulate server responses
   - Mock data generation for testing
   - Separation of concerns between UI and data layers

3. **Access Control**
   - Role-based access control for admin routes
   - Redirection for unauthorized access attempts
   - Conditional rendering of admin navigation items

When extending the admin functionality:
- Add new mock endpoints in `adminMockApi.ts`
- Register new API interceptors in `mockApiRegister.ts`
- Create new admin components in the `/admin` directory

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