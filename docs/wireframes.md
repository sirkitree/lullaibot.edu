# LullAIbot Education App - Wireframes

This document provides wireframe descriptions and layouts for all major screens of the LullAIbot Education App. These wireframes serve as a blueprint for the UI implementation.

## Screen Overview

The LullAIbot Education App consists of the following major screens:

1. Dashboard (Home)
2. Resources Page
3. Add Resource Page
4. Achievements Page
5. Leaderboard Page
6. User Profile Page
7. Admin Dashboard (future)

## 1. Dashboard (Home)

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  HERO SECTION                                       |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Welcome message                              |  |
|  |  Brief app description                        |  |
|  |                                               |  |
|  |  [Browse Resources]    [Add New Resource]     |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  +-------------------+    +----------------------+  |
|  |                   |    |                      |  |
|  |  RECENT ACTIVITY  |    |   USER PROGRESS      |  |
|  |                   |    |                      |  |
|  |  - Resource 1     |    |   Contributions: 12  |  |
|  |  - Resource 2     |    |   Points: 145        |  |
|  |  - Resource 3     |    |   Streak: 3 days     |  |
|  |                   |    |   Rank: #5           |  |
|  |  [View All]       |    |                      |  |
|  |                   |    |   [Achievements]     |  |
|  +-------------------+    +----------------------+  |
|                                                     |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  CATEGORIES                                   |  |
|  |                                               |  |
|  |  - Beginner Resources (15)                    |  |
|  |  - Intermediate Resources (23)                |  |
|  |  - Expert Resources (18)                      |  |
|  |  - Developer Resources (31)                   |  |
|  |  - More...                                    |  |
|  |                                               |  |
|  |  [Explore Categories]                         |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **Hero Section**: Welcome message with primary action buttons
- **Recent Activity**: List of recently added resources
- **User Progress**: Stats showing user contributions and achievements
- **Categories Overview**: Categories with resource counts

## 2. Resources Page

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  RESOURCES PAGE HEADER                              |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  AI Learning Resources                        |  |
|  |  Description text                             |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  SEARCH BAR                                         |
|  +-----------------------------------------------+  |
|  |  [                    Search                 ]|  |
|  +-----------------------------------------------+  |
|                                                     |
|  +-------------------+    +----------------------+  |
|  |                   |    |                      |  |
|  |  FILTERS          |    |   RESOURCE LIST      |  |
|  |                   |    |                      |  |
|  |  Categories:      |    |   [View Options]     |  |
|  |  □ Beginner       |    |   [Sort Options]     |  |
|  |  □ Intermediate   |    |                      |  |
|  |  □ Expert         |    |   - Resource Card 1  |  |
|  |                   |    |   - Resource Card 2  |  |
|  |  Date Added:      |    |   - Resource Card 3  |  |
|  |  ○ Any time       |    |   - Resource Card 4  |  |
|  |  ○ This week      |    |   - Resource Card 5  |  |
|  |  ○ This month     |    |                      |  |
|  |  ○ This year      |    |   [Load More]        |  |
|  |                   |    |                      |  |
|  |  Tags:            |    |                      |  |
|  |  [Tag input]      |    |                      |  |
|  |                   |    |                      |  |
|  |  [Apply Filters]  |    |                      |  |
|  |                   |    |                      |  |
|  +-------------------+    +----------------------+  |
|                                                     |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Don't see what you're looking for?           |  |
|  |  [Add New Resource]                           |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **Search Bar**: Prominently displayed for quick resource search
- **Filters**: Sidebar with category, date, and tag filters
- **Resource List**: Configurable display (card/list) with sort options
- **Add Resource CTA**: Prompt for adding new resources

## 3. Add Resource Page

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  ADD RESOURCE FORM                                  |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Add New Resource                             |  |
|  |  Description text                             |  |
|  |                                               |  |
|  |  URL*                                         |  |
|  |  [                                       ][A] |  |
|  |                                               |  |
|  |  Title*                                       |  |
|  |  [                                         ]  |  |
|  |                                               |  |
|  |  Description*                                 |  |
|  |  [                                         ]  |  |
|  |  [                                         ]  |  |
|  |  Character count: 0/300                       |  |
|  |                                               |  |
|  |  Tags (comma separated)                       |  |
|  |  [                                         ]  |  |
|  |                                               |  |
|  |  SUGGESTED CATEGORIES                         |  |
|  |  ☑ Beginner Resources (92%)                   |  |
|  |  ☑ Getting Started Guides (76%)               |  |
|  |  ☐ Developer Resources (45%)                  |  |
|  |  ☐ Content Creation (32%)                     |  |
|  |                                               |  |
|  |  Suggest a new category:                      |  |
|  |  [                                         ]  |  |
|  |  New categories require admin approval        |  |
|  |                                               |  |
|  |  [Cancel]                [Submit Resource]    |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **URL Input**: With "Analyze" button [A] for metadata extraction
- **Resource Details**: Title, description, and tags inputs
- **Suggested Categories**: AI-generated category suggestions with confidence scores
- **New Category**: Option to suggest a new category

## 4. Achievements Page

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  ACHIEVEMENTS HEADER                                |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Your Achievements                            |  |
|  |  You've unlocked 7 out of 20 achievements     |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  PROGRESS BAR                                       |
|  +-----------------------------------------------+  |
|  |  [==============>                           ] |  |
|  |  7/20 achievements unlocked                   |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ACHIEVEMENTS GRID                                  |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  UNLOCKED                                     |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |  |  Icon  |  |  Icon  |  |  Icon  |          |  |
|  |  |  Name  |  |  Name  |  |  Name  |          |  |
|  |  | 10/5/23|  | 10/8/23|  | 10/9/23|          |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |                                               |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |  |  Icon  |  |  Icon  |  |  Icon  |          |  |
|  |  |  Name  |  |  Name  |  |  Name  |          |  |
|  |  | 10/12/23| |10/15/23|  |10/20/23|          |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |                                               |  |
|  |  LOCKED                                       |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |  |   ?    |  |   ?    |  |    ?   |          |  |
|  |  |  Name  |  |  Name  |  |  Name  |          |  |
|  |  | Locked |  | Locked |  | Locked |          |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |                                               |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |  |    ?   |  |    ?   |  |    ?   |          |  |
|  |  |  Name  |  |  Name  |  |  Name  |          |  |
|  |  | Locked |  | Locked |  | Locked |          |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  STATS SUMMARY                                      |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Total Points: 145                            |  |
|  |  Current Streak: 3 days                       |  |
|  |  Longest Streak: 7 days                       |  |
|  |  Resources Added: 12                          |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **Progress Overview**: Achievement count and progress bar
- **Achievement Grid**: Visual display of unlocked and locked achievements
- **Stats Summary**: User statistics related to achievements

## 5. Leaderboard Page

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  LEADERBOARD HEADER                                 |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Community Leaderboard                        |  |
|  |  Top contributors in the Lullabot community   |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  FILTER OPTIONS                                     |
|  +-----------------------------------------------+  |
|  |  Time Period:                                 |  |
|  |  [All Time ▼]                                 |  |
|  |                                               |  |
|  |  Department:                                  |  |
|  |  [All Departments ▼]                          |  |
|  +-----------------------------------------------+  |
|                                                     |
|  YOUR RANK                                          |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Your Current Rank: #5                        |  |
|  |  Points: 145    Contributions: 12             |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  LEADERBOARD TABLE                                  |
|  +-----------------------------------------------+  |
|  | Rank | User           | Points | Contributions|  |
|  |------|----------------|--------|--------------|  |
|  |  1   | Alice Johnson  |  450   |     25       |  |
|  |  2   | Bob Smith      |  380   |     19       |  |
|  |  3   | Carol Davis    |  320   |     22       |  |
|  |  4   | Dave Wilson    |  285   |     17       |  |
|  |→ 5   | YOU            |  145   |     12       |  |
|  |  6   | Eve Brown      |  130   |     10       |  |
|  |  7   | Frank Miller   |  120   |     8        |  |
|  |  8   | Grace Lee      |  110   |     11       |  |
|  |  9   | Henry Garcia   |  95    |     7        |  |
|  | 10   | Ivy Chen       |  80    |     6        |  |
|  |                                               |  |
|  |  [Previous]                      [Next]       |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **Filter Options**: Time period and department filters
- **User Rank**: Highlighted section showing current user's rank
- **Leaderboard Table**: Ranking of users with points and contributions
- **Pagination**: Navigation for viewing more results

## 6. User Profile Page

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  PROFILE HEADER                                     |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  [Avatar]  John Doe                           |  |
|  |            john.doe@example.com               |  |
|  |                                               |  |
|  |  [Edit Profile]                               |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  PROFILE TABS                                       |
|  +-----------------------------------------------+  |
|  | [Contributions] [Achievements] [Settings]     |  |
|  +-----------------------------------------------+  |
|                                                     |
|  SECTION CONTENT (Contributions Tab)                |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  CONTRIBUTIONS STATS                          |  |
|  |  Total: 12    This Month: 3    This Week: 1   |  |
|  |                                               |  |
|  |  YOUR RESOURCES                               |  |
|  |  +-------------------+  +------------------+  |  |
|  |  | Introduction to AI|  | ChatGPT Guide    |  |  |
|  |  | Oct 15, 2023      |  | Oct 10, 2023     |  |  |
|  |  | 15 votes          |  | 8 votes          |  |  |
|  |  +-------------------+  +------------------+  |  |
|  |                                               |  |
|  |  +-------------------+  +------------------+  |  |
|  |  | AI Ethics Overview|  | Prompt Engineering|  |  |
|  |  | Oct 5, 2023       |  | Sep 28, 2023      |  |  |
|  |  | 12 votes          |  | 20 votes          |  |  |
|  |  +-------------------+  +------------------+  |  |
|  |                                               |  |
|  |  [Load More]                                  |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **Profile Header**: User info and edit button
- **Profile Tabs**: Navigation between different profile sections
- **Contributions Stats**: Overview of user's contribution activity
- **Resource List**: Grid of resources contributed by the user

## 7. Admin Dashboard (Future)

```
+-----------------------------------------------------+
|                                                     |
|  HEADER / NAVIGATION                                |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  ADMIN DASHBOARD HEADER                             |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  Admin Dashboard                              |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ADMIN NAVIGATION                                   |
|  +-----------------------------------------------+  |
|  | [Overview] [Resources] [Users] [Categories]   |  |
|  | [Reports] [Settings]                          |  |
|  +-----------------------------------------------+  |
|                                                     |
|  SECTION CONTENT (Overview Tab)                     |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  SUMMARY STATS                                |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |  |  120   |  |   35   |  |    8   |          |  |
|  |  | Users  |  |Resources|  |Pending |          |  |
|  |  +--------+  +--------+  +--------+          |  |
|  |                                               |  |
|  |  RECENT ACTIVITY                              |  |
|  |  - New resource added by John Doe             |  |
|  |  - Category suggestion from Alice Johnson     |  |
|  |  - New user registration: Bob Smith           |  |
|  |  - Resource updated by Carol Davis            |  |
|  |                                               |  |
|  |  PENDING APPROVALS                            |  |
|  |  +-----------------------------------+        |  |
|  |  | New Category: "AI Tools"          |        |  |
|  |  | Suggested by: Alice Johnson      |        |  |
|  |  | [Approve] [Reject] [Edit]        |        |  |
|  |  +-----------------------------------+        |  |
|  |                                               |  |
|  |  +-----------------------------------+        |  |
|  |  | Resource: "AI Ethics Framework"   |        |  |
|  |  | Added by: Bob Smith              |        |  |
|  |  | [Approve] [Reject] [Edit]        |        |  |
|  |  +-----------------------------------+        |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  FOOTER                                             |
|                                                     |
+-----------------------------------------------------+
```

### Key Elements:
- **Admin Navigation**: Tabs for different administrative functions
- **Summary Stats**: Overview of key metrics
- **Recent Activity**: Log of recent system events
- **Pending Approvals**: Items requiring admin review

## Responsive Design Considerations

All wireframes should adapt to the following breakpoints:

1. **Mobile (< 576px)**
   - Single column layout
   - Stacked content blocks
   - Condensed navigation
   - Reduced padding and margins

2. **Tablet (576px - 992px)**
   - Two column layout where appropriate
   - Side navigation collapses to toggle menu
   - Filter sidebar becomes an overlay or top bar

3. **Desktop (> 992px)**
   - Full multi-column layout
   - Side-by-side content areas
   - Expanded navigation and filtering options

## Interactive Elements

### Resource Card
```
+-------------------------------------------+
|                                           |
|  Introduction to Artificial Intelligence  |
|                                           |
|  example.com                  Oct 15, 2023|
|                                           |
+-------------------------------------------+
```

### Resource Card (Expanded)
```
+-------------------------------------------+
|                                           |
|  Introduction to Artificial Intelligence  |
|                                           |
|  A comprehensive introduction to AI       |
|  concepts, history, and applications.     |
|  Perfect for beginners.                   |
|                                           |
|  example.com                  Oct 15, 2023|
|                                           |
|  [Tags: AI, Beginner, Guide]              |
|                                           |
|  [Edit] [Delete]                          |
|                                           |
+-------------------------------------------+
```

### Filter Component
```
+----------------------------+
|                            |
|  FILTER TYPE               |
|  ☐ Option 1                |
|  ☑ Option 2                |
|  ☐ Option 3                |
|  ☐ Option 4                |
|                            |
|  [Show More]               |
|                            |
+----------------------------+
```

### Search Bar with Autocomplete
```
+-------------------------------------------+
|                                           |
|  [Search resources...            🔍]      |
|  +--------------------------------------+ |
|  | Suggested: AI Ethics                 | |
|  | Suggested: Prompt Engineering        | |
|  | Recent: Introduction to AI           | |
|  +--------------------------------------+ |
|                                           |
+-------------------------------------------+
```

## Color Scheme and Typography References

### Color Palette
- Primary: `#4A6BF5` (Blue)
- Secondary: `#6E49E8` (Purple)
- Background: `#FFFFFF` (White) / `#121212` (Dark)
- Text: `#333333` (Dark) / `#F1F1F1` (Light)
- Accent: `#38A169` (Green), `#E53E3E` (Red), `#F59E0B` (Yellow)

### Typography
- Primary Font: Inter
- Heading Sizes: 
  - H1: 2.25rem 
  - H2: 1.875rem
  - H3: 1.5rem
  - H4: 1.25rem
- Body Text: 1rem
- Small Text: 0.875rem

## Next Steps

1. Create high-fidelity mockups based on these wireframes
2. Develop component prototypes in the UI library
3. Implement responsive breakpoints
4. Test interfaces with users for usability feedback 