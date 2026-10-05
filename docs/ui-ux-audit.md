# HabitFlow UI/UX Audit

Audit date: 2026-10-03. Based on reading the source (routes, pages, components, hooks, `index.css` theme, API layer) plus a `vite build` to inspect generated CSS and bundle size. The live site was not clicked through.

Notes: the repo runs React 19 (README says 18), and PostHog is not installed (only Vercel Analytics).

## Progress tracker

Mark items as they are fixed so work can resume in a new session.

| ID | Title | Effort | Status |
|----|-------|--------|--------|
| C1 | "Today" is a UTC date | S | Open |
| C2 | Achievements and Habits-page stats only see today's completions | S | Open |
| C3 | No demo / guest path for recruiters | M | Open |
| C4 | Check-off is slow and gives no reward | M | Open |
| H1 | Habit list buried on dashboard | M | Open |
| H2 | Bare `primary` color token missing | S | Done |
| H3 | Keyboard and screen-reader access broken | M | Done |
| H4 | Five inconsistent streak calculations | M | Open |
| H5 | Analytics numbers misleading or wrong | M | Open |
| H6 | Unfinished features visible in the UI | S each | Open |
| H7 | "Complete All" undermines motivation | S | Done (removed; no demo account yet) |
| H8 | Enter on "Cancel" in delete confirmation deletes | S–M | Done (Delete now hard-deletes; Archive archives) |
| H9 | Dark mode unfinished | S–M | Open |
| M1 | No reduced-motion support | S | Open |
| M2 | Global 300 ms color transition on every element | S | Open |
| M3 | Creating a habit takes 4+ taps, no defaults | S–M | Open |
| M4 | Generic first-run experience | M | Open |
| M5 | Mobile navigation and sidebar layout shift | M | Open |
| M6 | Heatmap awkward on phones | S | Open |
| M7 | Dashboard "today" numbers contradict each other | S | Open |
| M8 | Inconsistent loading / error / success states | M | Open |
| M9 | `Input` breaks email fields on mobile | S | Done |
| M10 | Contrast failures | S | Open |
| M11 | Links that reload the whole app | S | Done |
| M12 | Single 1.49 MB JS bundle | S–M | Open |
| L1 | Code polish a reviewer will notice | S | Open |
| L2 | Font setup | S | Open |
| L3 | Achievement toast styling | S | Open |
| L4 | Navbar details | S | Open |
| L5 | Copy and emoji | S | Open |
| L6 | Level curve ends early | S | Open |
| L7 | README accuracy | S | Open |

---

## 🔴 Critical

### C1. "Today" is a UTC date, so check-ins vanish or reset at the wrong time
- **Problem:** `getTodayCompletions` builds "today" with `new Date().toISOString().split("T")[0]` (`src/lib/api.ts:139`). `src/lib/streaks.ts:26,33` does the same. For a user in New York, everything checked off that morning disappears from "Today" at 8 pm local time, when the UTC date rolls over. Habits show as unchecked again and Today's Progress drops to 0%. East of UTC, the day starts hours late.
- **Why it matters:** This breaks the one thing a habit tracker must get right. Many recruiters are in US time zones and look at portfolios in the evening.
- **Solution:** Compute local day bounds and send them as full ISO timestamps. Use one shared `dayKey()` helper everywhere.
  ```ts
  const start = startOfDay(new Date()).toISOString();
  const end = endOfDay(new Date()).toISOString();
  .gte("completed_at", start).lte("completed_at", end)
  ```
- **Effort:** S

### C2. Achievements and Habits-page stats only see today's completions
- **Problem:** `src/hooks/useCheckAchievements.ts:17` and `src/pages/AchievementsPage.tsx:15` get `totalCompletions` from `useCompletions()`, which only returns today's rows. So "Complete 100 habits" can only unlock if you do all 100 in one day, and locked progress bars reset to 0 every night. `src/pages/HabitsPage.tsx:29` passes the same today-only data to `useHabitsStats`, so "Avg completion rate" sits near 0% and "Longest streak" never goes above 1.
- **Why it matters:** The gamification looks broken to anyone who uses the app for more than one day.
- **Solution:** Use `useAllCompletions()` in those three places. The query is already cached under `["all-completions"]`.
- **Effort:** S

### C3. A recruiter has to sign up and confirm an email before seeing anything
- **Problem:** Every route except login and signup sits behind `ProtectedRoute` (`src/App.tsx:81-136`), including `/about`. There's no demo account, guest mode, or public landing page. Signup goes to an email-confirmation wall (`src/hooks/useAuth.ts:105`).
- **Why it matters:** Most reviewers stop here. The best work is behind a form plus an inbox round-trip.
- **Solution:** Add a **"Try the demo"** button on the login page that signs into a seeded demo account with about 60 days of history, streaks, and unlocked achievements. Alternatively, use Supabase anonymous sign-in and seed data on first visit. Make `/about` public.
- **Effort:** M

### C4. Checking off a habit is slow and gives almost no reward
- **Problem:** `src/hooks/useToggleCompletion.ts` has no `onMutate`, so the UI waits for two sequential requests (insert, then points RPC), four query invalidations, and a refetch. The checkbox stays disabled the whole time (`src/components/habits/HabitCard.tsx:109`). On success nothing celebrates: no "+10 pts", no animation, no completion moment. Also:
  - `isCompleted` means "at least one completion", so a 1/3 habit already shows a check and a strikethrough (`HabitCard.tsx:53,112,136`).
  - On a full 3/3 habit, a tap silently removes one completion, and there's no other way to decrement.
  - Debug `console.log`s ship to production (lines 27, 37, 43, 45, 50).
- **Why it matters:** The check-off is the product. Duolingo, Streaks, and Finch put most of their polish into this one moment.
- **Solution:**
  - Optimistic update with rollback:
    ```ts
    onMutate: async ({ habitId }) => {
      await qc.cancelQueries({ queryKey: ["completions", uid] });
      const prev = qc.getQueryData<Completion[]>(["completions", uid]);
      qc.setQueryData(["completions", uid], (old = []) =>
        [...old, { id: `temp-${Date.now()}`, habit_id: habitId, completed_at: new Date().toISOString() }]);
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(["completions", uid], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["completions"] }),
    ```
  - On completion: animate the check (spring scale), float a "+10" chip toward the level badge, fire confetti when the last habit of the day is done ("Perfect day").
  - Progress ring for multi-count habits; separate "undo" action in a toast.
- **Effort:** M

---

## 🟠 High

### H1. On the dashboard, the habit list sits below 8 other blocks
- **Problem:** `src/pages/DashboardPage.tsx` renders the welcome header, level bar, 4 stat cards, Today's Progress, achievement count, Recent Achievements, the "Keep Going" card, and category chips, all before "Today's Habits" (line 256). On a phone that's thousands of pixels of scrolling before the first checkbox.
- **Why it matters:** The first thing a returning user wants is to check off today's habits.
- **Solution:** Put "Today's Habits" first. Merge stats into one compact strip (today ring, streak 🔥, level), move achievements and charts below the list.
- **Effort:** M

### H2. The bare `primary` color token doesn't exist, so many brand-color classes do nothing
- **Problem:** `@theme` defines only `primary-50…950` (`src/index.css:9-19`), but the code uses `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, `accent-primary` in about 30 places. The built CSS contains none of them (verified: 0 matches).
  - Selected states in `IconPicker.tsx:25-27` and `FrequencySelector.tsx:26-29` fall back to `currentColor` instead of brand green.
  - The `%` in `TodayProgress.tsx:68` isn't green.
  - Achievements filter active state (`AchievementsPage.tsx:123`) has no colored background.
  - The range slider uses the browser's default accent.
- **Why it matters:** Weak selection feedback in the create-habit form; inconsistent brand color.
- **Solution:** Add `--color-primary: #10b981;` and `--color-secondary: #ffcf36;` to `@theme`.
- **Effort:** S

### H3. Keyboard and screen-reader access is broken in the main controls
- **Problem:**
  - **No focus rings:** `src/components/ui/Button.tsx:30` applies `focus:outline-none focus:ring-0` as utilities, overriding the global `*:focus-visible` ring (`src/index.css:127`). No `<Button>` shows focus.
  - **Non-buttons:** user menu trigger is a clickable `<div>` (`Navbar.tsx:133`), as is the logo (`:76`).
  - **Unlabeled icon buttons:** habit checkbox (`HabitCard.tsx:107`, no `aria-pressed`/checked state); edit and delete (`:219-235`); star and ⋮ menu (`PremiumHabitCard.tsx:131,145`); Settings icon (`Navbar.tsx:126`); color swatches announced as "#10b981"; password toggle with `tabIndex={-1}` and no label.
  - **Dialogs and menus:** `Modal.tsx` has no focus trap, no initial focus, no focus return. Dropdowns don't close on Escape. Mobile sidebar drawer doesn't trap focus. Collapsed-sidebar tooltips show on hover only.
  - **Overall:** only 13 `aria-*` attributes in the codebase.
- **Why it matters:** Reviewers often tab through a page; keyboard and screen-reader users can't use the app.
- **Solution:** Replace `focus:ring-0` with `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`. Checkbox as `<button role="checkbox" aria-checked={done} aria-label={`Mark ${habit.name} complete`}>`. `aria-label` on every icon-only button. Focus-trap hook in `Modal` (or Radix Dialog / Headless UI).
- **Effort:** M

### H4. There are five different streak calculations, and they disagree
- **Problem:**
  - `src/lib/streaks.ts` uses UTC dates (dashboard, `HabitCard`).
  - `src/hooks/useHabitStats.ts:70` uses local dates (`PremiumHabitCard`).
  - `src/hooks/useHabitsStats.ts:107` resets the streak when two completions share a day (diff = 0), breaking multi-count habits.
  - `src/hooks/useAnalytics.ts:55` is a fourth version.
  - `src/components/analytics/ActivityHeatmap.tsx:381` counts back from the last week's future padding days (count 0), so "Current Streak" is 0 except on Saturdays.
  - None handle `weekly` frequency or `target_count`; weekly habits can never streak.
- **Why it matters:** The same habit shows different streaks on different pages; streaks are the core motivation mechanic.
- **Solution:** One pure `lib/streaks.ts` (local day keys, frequency-aware, counting only days where the target was met) with unit tests; every view calls it.
- **Effort:** M

### H5. Analytics numbers are misleading or wrong
- **Problem:**
  - **Rates ignore habit age:** expected = `target_count × 30` (`useAnalytics.ts:40,146`). A 5-day-old habit done every day shows **17%**. Same bar chart is on the dashboard.
  - **Uncapped average:** `averageRate` has no cap and treats weekly habits as daily.
  - **Mislabeled heatmap rows:** columns start Sunday (`useActivityHeatmap.ts:74`), labels read Mon…Sun (`ActivityHeatmap.tsx:163-199`).
  - **Diluted average:** "Avg per Day" includes padding days.
  - **No context in trend line:** raw counts, no "out of possible".
- **Why it matters:** New users and recruiters on a fresh account see discouraging numbers; the day-label bug is easy to spot.
- **Solution:** Expected from `max(created_at, 30 days ago)` and frequency. Fix row labels (or start weeks Monday); exclude padding. Plot "% of daily target". Replace dashboard bar chart with a 7-day mini chart or remove it.
- **Effort:** M

### H6. Unfinished features are visible in the UI
- **Problem:**
  - Sort by "streak"/"rate" does nothing (`// todo; return 0`, `src/pages/HabitsPage.tsx:84-89`).
  - List and Table view toggles show "coming in a future update" (`:243-262`).
  - Settings has four "Coming soon!" rows.
  - "Forgot password?" does nothing (`src/pages/LoginPage.tsx:82`), though `resetPassword` exists.
  - ⭐ favorite is local state that resets on reload (`PremiumHabitCard.tsx:72`).
  - "Profile" goes to `/habits` (`Navbar.tsx:152`).
  - "Custom" frequency has no day picker; weekly habits still appear under "Today's Habits".
  - Habits library cards (`PremiumHabitCard`) have no check-in control.
- **Why it matters:** Non-working controls create a tutorial-project impression.
- **Solution:** Implement each or remove the control.
- **Effort:** S each

### H7. "Complete All" undermines the motivation system
- **Problem:** `src/components/habits/HabitsContianer.tsx:155` has a one-tap button that completes every habit and awards all the points.
- **Why it matters:** Makes points, streaks, and achievements meaningless.
- **Solution:** Remove it, or show it only on the demo account.
- **Effort:** S

### H8. Pressing Enter on "Cancel" in the delete confirmation deletes the habit
- **Problem:** `src/lib/confirmToast.tsx:119` listens for Enter on `window` and resolves `true` regardless of focus, including Cancel. Clicking a button never removes the listener (`cleanup` only runs on key presses), so listeners pile up; afterwards every Enter/Escape anywhere calls `toast.dismiss()` on all toasts. Delete confirmation is inconsistent: `window.confirm` in `HabitsPage.tsx:104` and `CategoryManager.tsx:34`, `confirmToast` elsewhere.
- **Why it matters:** Silent data loss.
- **Solution:** One `<ConfirmDialog>` built on `Modal`, no global key listeners. Suggest Archive as safer default; undo toast after delete.
- **Effort:** S–M

### H9. Dark mode is unfinished in several places
- **Problem:**
  - **Ghost/outline buttons:** `Button.tsx:38,42` hard-code `text-gray-700` as a utility, overriding `.btn-ghost`'s `dark:text-gray-300` (components layer). Cancel buttons, menu items, HabitCard edit buttons are dark gray on near-black.
  - **Toasts:** `<Toaster>` hard-coded white (`src/App.tsx:47`).
  - **Modal and loader:** modal header keeps `border-gray-200` / `hover:bg-gray-200` in dark (`Modal.tsx:80,93`); `ProtectedRoute` loader is `bg-gray-50`, flashes white.
  - **Theme on load:** applied in `useEffect`, ignores `prefers-color-scheme` (`src/contexts/ThemeContext.tsx:21-37`); light flash on every load for dark users.
- **Solution:** `dark:` variants inside Button variants; Toaster reads theme; inline `<script>` in `index.html` sets `.dark` before mount and defaults to OS preference.
- **Effort:** S–M

---

## 🟡 Medium

### M1. No reduced-motion support
- **Problem:** Only `prefers-reduced-motion` rule is for smooth scroll (`src/index.css:132`). Framer Motion in sidebar and modals, infinite `animate-bounce` on achievement toasts, `animate-pulse` glow, hover scaling, count-up numbers. `src/components/ui/AnimatedNumber.tsx:4` restarts from 0 on every change, so points count up from zero after every check-off.
- **Solution:** `<MotionConfig reducedMotion="user">`; `@media (prefers-reduced-motion: reduce)` disabling `animate-*`; `AnimatedNumber` tweens from previous value and skips animation under reduced motion.
- **Effort:** S

### M2. A global 300 ms color transition on every element
- **Problem:** `src/index.css:79` applies the transition to `*`. Checkbox, hover, and selection colors lag; theme toggle repaints the whole DOM.
- **Solution:** `.theme-transition` class on `<html>` for ~300 ms only while toggling.
- **Effort:** S

### M3. Creating a habit takes at least 4 taps, with no defaults
- **Problem:** Icon and color required and start empty (`src/constants/habits.ts:42-43`). Flow: New Habit → name → icon → color → Create. 7 fields in one bottom sheet; not a `<form>`, so Enter doesn't submit.
- **Solution:** Default icon and color (name + Enter is enough). Frequency/target/category under "More options". Wrap in `<form>`. Show 3 template chips in the empty state.
- **Effort:** S–M

### M4. The first-run experience is generic
- **Problem:** After signup: email wall, then a dashboard of zeros. Stat cards show "0" while loading, then animate. `src/components/dashboard/EmptyProgress.tsx` is unstyled `<h4>`/`<p>`. No onboarding.
- **Solution:** 2-step first run ("Pick 1–3 starter habits" from templates, then "Check off your first one now", which unlocks the speed-completion achievement). Skeletons instead of zeros.
- **Effort:** M

### M5. Mobile navigation and layout shift
- **Problem:** Phones get only a hamburger drawer. On desktop, the sidebar widens `w-20` → `w-72` on hover within page layout (`src/components/layout/Sidebar.tsx:67`, `DashboardLayout.tsx:42`), reflowing main content on every mouse pass.
- **Solution:** Bottom tab bar on mobile (Today / Habits / Stats / Me). Desktop expansion as an overlay (`absolute`).
- **Effort:** M

### M6. The heatmap is awkward on phones
- **Problem:** Full year with horizontal scroll starting at the oldest end, today off screen. Cells are non-focusable `<div>`s; screen-reader summary is only a `title` per cell.
- **Solution:** Scroll to end on mount; ~4 months on small screens; visually hidden summary.
- **Effort:** S

### M7. Today's numbers on the dashboard contradict each other
- **Problem:** "Completion Rate" (`src/pages/DashboardPage.tsx:62-68`) divides all of today's completions by targets of the *filtered* habits, so it can exceed 100% with a category filter. "Today's Progress" counts fully completed habits instead. "Current Streak" is actually the max streak across habits.
- **Solution:** One "Today x/y" metric; label "Best active streak".
- **Effort:** S

### M8. Loading, error, and success states are inconsistent
- **Problem:**
  - Achievements page shows plain "Loading achievements…".
  - Habits error state retries with `window.location.reload()` (`HabitsContianer.tsx:136`).
  - Each `HabitCard` runs its own `useHabitStreak` query (N requests, N spinners) though all completions are cached.
  - Completion insert and points update aren't atomic (`useToggleCompletion.ts:44-46`); if the RPC fails the user sees "Failed to update habit" though the check-in saved.
- **Solution:** `refetch()` for retries; consistent skeletons; derive per-habit streaks from `all-completions`; points update in a DB trigger or single RPC.
- **Effort:** M

### M9. The `Input` component breaks email fields on mobile
- **Problem:** At `src/components/ui/Input.tsx:28,42`, `showPassword` starts `false` for non-password fields, which renders `type="text"`. Every `type="email"` field loses the email keyboard and browser validation. Eye/EyeOff icons are inverted; no `autoComplete` attributes.
- **Solution:** `type={isPassword ? (visible ? "text" : "password") : type}`, plus `autoComplete="email"` and `"current-password"`/`"new-password"`.
- **Effort:** S

### M10. Contrast failures
- **Problem:**
  - `src/components/dashboard/LevelProgress.tsx:22,36`: `text-gray-100` on `primary-500` (~2.5:1).
  - Points number uses level color on green, e.g. `#ebd11a` yellow (`:32`).
  - Locked achievements: `opacity-60` + `text-gray-400` (`AchievementCard.tsx:40,75`).
  - Many `text-[10px]` gray-500 labels.
- **Solution:** White or gray-900 on green; points on a neutral chip; `grayscale` instead of opacity for locked cards; 12px minimum font size.
- **Effort:** S

### M11. Several links reload the whole app
- **Problem:** `<a href="/achievements">` (`RecentAchievementsSection.tsx:24`), `window.location.href` in `EmptyState.tsx:63` and `ErrorBoundary.tsx:37`, and the footer link do a full reload and refetch.
- **Solution:** `<Link>` or `navigate()`.
- **Effort:** S

### M12. One 1.49 MB JavaScript bundle
- **Problem:** Single 1.49 MB JS chunk (420 KB gzipped), no code splitting; slow on phones.
- **Solution:** Lazy-load routes; load Recharts and heatmap only on Analytics.
- **Effort:** S–M

---

## 🟢 Low

### L1. Code polish a reviewer will notice
- `HABIT_ICONS` copied into `PremiumHabitCard.tsx:32` and `HabitCard.tsx:33` instead of importing from `constants/habits.ts`.
- Leftover `// ⭐ ADD THIS` comments and 7 `console.log`s.
- Misspelled filename `HabitsContianer.tsx`.
- `Modal` returns `null` before `AnimatePresence` (`Modal.tsx:50`), so exit animations never play.
- **Effort:** S

### L2. Font setup
- `@theme` font tokens named `--font-family-*`; Tailwind v4 expects `--font-sans` / `--font-display`, so no `font-display` utility exists, hence repeated inline `style={{fontFamily:"Sora"}}`. The CSS `@import url(...)` comes after other rules and is dropped (build warns); harmless since `index.html` loads the fonts.
- **Effort:** S

### L3. Achievement toast styling
- `animate-fadeOut` undefined, `animate-bounce` runs forever, light-only colors.
- **Effort:** S

### L4. Navbar details
- Time display never updates. Two `<h1>`s (logo and page title) and a decorative `<h3>` "Happy Monday!" before them.
- **Effort:** S

### L5. Copy and emoji
- Emoji in most headings, plus "Master your habits with elegance" and "Premium…" component names, read as template copy. Use fewer, deliberate emoji (🔥 streaks, 🏆 achievements).
- **Effort:** S

### L6. The level curve ends early
- Only 5 levels, top at 1,000 points (~100 check-ins, about a month with 3 habits). Use a geometric curve with named tiers.
- **Effort:** S

### L7. README accuracy
- README says React 18; PostHog isn't installed. Make claims match the code.
- **Effort:** S

---

## Top 3 for a portfolio review

1. **One-click demo with seeded history (C3).** Most reviewers never get past signup and the email wall.
2. **Instant, rewarding check-off, placed first (C4 + H1 + H7).** Optimistic toggle, "+10" animation, confetti on a perfect day, today's habits at the top; remove "Complete All".
3. **Trustworthy numbers (C1 + C2 + H4 + H5).** Local-time day boundaries, one tested `streaks.ts`, all-time achievement data, age-aware rates.

**Quick wins (under an hour total):** `--color-primary` token (H2), focus rings on `Button` (H3), `Input` type bug (M9), remove "coming soon" / `todo` controls (H6).
