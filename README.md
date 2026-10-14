# 🎯 HabitFlow - Gamified Habit Tracker

> A full-stack habit tracking application with gamification, real-time analytics, and 30+ pre-made templates. Built to help users build and maintain positive habits through engaging visualizations and achievement systems.

<div align="center">

[ https://habitflow-hs.vercel.app ]
[ https://github.com/HaythamSaba/habitflow ]
[ https://www.linkedin.com/in/haytham-saba-401148278/ ]

</div>

## ✨ Key Features

### 🎮 Gamification System

- **Points & Experience** - Earn XP for completing habits and level up your profile
- **Achievement System** - Unlock achievements for milestones: streaks, total check-ins, points, early or late check-ins and perfect days
- **Streak Tracking** - Build momentum with visual streak counters and fire emojis
- **Level Progression** - 11 levels from Beginner (🌱) to Mythic (🔮), on a curve that lasts about a year

### 📊 Analytics & Insights

- **GitHub-Style Heatmap** - Visualize 365 days of activity at a glance
- **Completion Trends** - Track your progress with interactive line charts
- **Performance Analytics** - See completion rates by habit over time
- **Real-time Statistics** - Current streak, total points, active habits, and completion rate

### 🎯 Smart Habit Management

- **30+ Pre-made Templates** - Quick-start with fitness, health, productivity, and mindfulness habits
- **Search & Filtering** - Search habits and filter by category and status (active/archived)
- **Category Organization** - Create custom categories with emojis
- **Daily Targets** - Track habits once or several times a day (e.g. 8 glasses of water)
- **Guided First Run** - New users pick starter habits and are prompted to make their first check-in

### 🎨 User Experience

- **Complete Dark Mode** - Follows your system setting, remembers your choice, no flash on load
- **Fully Responsive** - Optimized for mobile (with a bottom tab bar), tablet, and desktop
- **Instant Feedback** - Optimistic check-ins with undo, points animation and confetti on a perfect day
- **Smooth Animations** - Framer Motion powered transitions that respect reduced-motion settings

---

## 🖼️ Screenshots

Here you can find some screenshots from the project : https://imgur.com/a/StKWS7b

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety across the application
- **TailwindCSS v4** - Utility-first styling with custom design system
- **React Query (TanStack Query)** - Server state management with optimistic updates
- **React Hook Form** - Performant form handling with validation
- **Zod** - Runtime type validation and schema definitions
- **Recharts** - Interactive data visualizations
- **Framer Motion** - Smooth animations and transitions
- **date-fns** - Modern date manipulation library
- **Lucide React** - Beautiful, consistent icon system

### Backend & Database

- **Supabase** - PostgreSQL database
- **Row-Level Security (RLS)** - Secure, user-specific data access
- **Supabase Auth** - Email/password authentication

### Development & Deployment

- **Vite** - Fast build tool and dev server, with route-level code splitting
- **Vitest** - Unit tests for the core logic (streaks, analytics, achievements, levels)
- **Vercel** - Continuous deployment and hosting
- **ESLint** - Code quality
- **Git & GitHub** - Version control

---

## 🏗️ Architecture & Code Quality

### Component Structure

```
src/
├── components/
│   ├──achievements/    # Achievement system components
│   ├── analytics/       # Charts and visualizations
|   ├── categories/      # Managing Categories
│   ├── dashboard/       # Dashboard-specific components
│   ├── habits/          # Habit management components
|   ├── layout/          # For layout components used in different parts
|   ├── templates/       # Choosing ready-to-use habits
│   └── ui/              # Reusable UI components (Card, Button, Modal)
|
├── constants/          # Shared constants and schemas
├── contexts/           # Managing Theme context
├── hooks/              # Custom React hooks (25+)
├── lib/                # Utility functions
├── pages/              # Route-level page components
├── store/              # creating store using zustand
├── supabase/           # Project Schema for supabase
└── types/              # TypeScript type definitions
```

### Key Technical Decisions

- **Component Composition** - Built 13+ reusable components following single responsibility principle
- **Custom Hooks** - Extracted business logic into 25+ custom hooks for reusability
- **Tested Core Logic** - Streaks, completion rates, achievements and levels are pure functions with unit tests
- **Local-Time Correctness** - "Today" and streaks use the user's local day, not the UTC date
- **Type Safety** - 100% TypeScript coverage with strict mode enabled
- **Performance** - Memoization, route-level code splitting, and optimistic updates
- **Accessibility** - Semantic HTML, keyboard navigation, focus management, ARIA labels, reduced-motion support

---

## 💻 Getting Started

### Prerequisites

- Node.js 20.19+ (required by Vite 7) and npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/HaythamSaba/habitflow.git
   cd habitflow
```

2. **Install dependencies**

```bash
   npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the project root with your Supabase credentials
(Project Settings → API in the Supabase dashboard):

```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Open the SQL editor and run `src/supabase/schema.sql` (tables, RLS policies, triggers and the points function)
   - Note: the achievement definitions (rows of the `achievements` table) aren't included in that file, so add your own to use achievements

5. **Run development server**

```bash
   npm run dev
```

6. **Open your browser**

```
   http://localhost:5173
```

### Run Tests

```bash
npm test         # Vitest: streaks, analytics, achievements, levels
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🎯 Development Journey

### Timeline: 26 Days

- **Days 1-10:** Core system (auth, CRUD, habit tracking)
- **Days 11-14:** Gamification system (points, levels, achievements)
- **Days 15-16:** Settings, dark mode, user experience
- **Days 17-19:** Analytics, categories, 30 habit templates
- **Days 20-21:** Habits management page, filtering, mobile optimization
- **Days 22-24:** Real stats, GitHub-style heatmap, data visualization
- **Days 25-26:** Major refactoring - extracted 13+ components, reduced code by 500+ lines

### Key Metrics

- **12,000+ lines** of TypeScript
- **65+ components** following best practices
- **25+ custom hooks** for business logic
- **7 database tables** with RLS policies
- **60 unit tests** for the core logic
- **100% TypeScript** coverage
- **100% responsive** across all breakpoints
- **100% dark mode** support

---

## 🏆 Project Highlights

### Technical Achievements

✅ **Clean Architecture** - Shared logic (streaks, analytics) in single, tested modules  
✅ **Type-Safe** - Full TypeScript with strict mode  
✅ **Real-time** - Optimistic updates with React Query  
✅ **Performant** - Memoized calculations, lazy-loaded routes and charts  
✅ **Accessible** - Keyboard navigation, focus management, screen-reader labels, reduced motion  
✅ **Scalable** - Component composition patterns

### Product Achievements

✅ **User Onboarding** - A guided first run and 30 templates make setup quick  
✅ **Engagement** - Points, streaks, levels and achievements reward consistency  
✅ **Insights** - 365-day heatmap shows long-term trends  
✅ **Experience** - Complete dark mode, smooth animations  
✅ **Mobile-First** - Responsive across all devices

---

## 📚 What I Learned

### Technical Skills

- Advanced React patterns (composition, render props, compound components)
- TypeScript best practices and advanced types
- Complex state management with React Query
- Real-time data synchronization with Supabase
- Data visualization with Recharts
- Performance optimization techniques
- Mobile-first responsive design
- Component architecture and reusability

### Soft Skills

- Product thinking and user-centric design
- Breaking down complex features into manageable tasks
- Iterative development and refactoring
- Documentation and code maintainability
- Time management (26-day sprint)

### Specific Challenges Solved

1. **GitHub-style heatmap** - Implemented date aggregation algorithm for 365 days
2. **Streak calculation** - One tested module for consecutive days, in the user's local time zone
3. **Template system** - Designed reusable template structure reducing onboarding time
4. **Component refactoring** - Extracted shared logic eliminating 500+ lines of duplication
5. **Real-time updates** - Implemented optimistic UI with React Query mutations

---

## 🔮 Future Enhancements

**Planned Features:**

- [ ] Weekly and custom-day habit schedules
- [ ] Social features (share achievements, follow friends)
- [ ] Export data (CSV/JSON download)
- [ ] Habit reminders and notifications
- [ ] Custom habit templates creation
- [ ] Drag-and-drop habit reordering
- [ ] Weekly/monthly report emails
- [ ] Integration with Apple Health / Google Fit
- [ ] Multi-language support
- [ ] PWA (offline functionality)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Haytham** - Frontend Developer

- Portfolio: [haytham-saba.vercel.app](https://haytham-saba.vercel.app/)
- LinkedIn: [Haytham Saba](https://www.linkedin.com/in/haytham-saba-401148278/)
- Email: haythamsaba@gmail.com
- GitHub: [@HaythamSaba](https://github.com/HaythamSaba)

**Live Demo:** [habitflow-hs.vercel.app](https://habitflow-hs.vercel.app)  
**GitHub Repo:** [View Source Code](https://github.com/HaythamSaba/habitflow)

---

<div align="center">

### ⭐ If you found this project interesting, please give it a star!

**Built with ❤️ by Haytham** | **© 2026**

</div>
