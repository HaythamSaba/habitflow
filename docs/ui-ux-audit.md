# HabitFlow UI/UX Audit

Audit date: 2026-10-03. Based on reading the source (routes, pages, components, hooks, `index.css` theme, API layer) plus a `vite build` to inspect generated CSS and bundle size. The live site was not clicked through.

Notes: the repo runs React 19 (README says 18), and PostHog is not installed (only Vercel Analytics).

Round 2: 2026-10-16. A re-read of the source after most round-1 fixes landed, adding items N1–N16 (see [Round 2](#round-2-2026-10-16)). The live site was not clicked through and no build was run for this round. Where a round-2 item expands an open round-1 item, work from the N item.

## Progress tracker

Mark items as they are fixed so work can resume in a new session.

| ID | Title | Effort | Status |
|----|-------|--------|--------|
| C1 | "Today" is a UTC date | S | Done |
| C2 | Achievements and Habits-page stats only see today's completions | S | Done |
| C3 | No demo / guest path for recruiters | M | Dropped (owner's decision) |
| C4 | Check-off is slow and gives no reward | M | Done |
| H1 | Habit list buried on dashboard | M | Open (superseded by N1) |
| H2 | Bare `primary` color token missing | S | Done |
| H3 | Keyboard and screen-reader access broken | M | Done |
| H4 | Five inconsistent streak calculations | M | Done (daily rules for all frequencies; weekly/custom hidden for now, see N3) |
| H5 | Analytics numbers misleading or wrong | M | Done (daily rules for all frequencies, like H4) |
| H6 | Unfinished features visible in the UI | S each | Done (via N2 and N3) |
| H7 | "Complete All" undermines motivation | S | Done (removed; no demo account yet) |
| H8 | Enter on "Cancel" in delete confirmation deletes | S–M | Done (Delete now hard-deletes; Archive archives) |
| H9 | Dark mode unfinished | S–M | Done |
| M1 | No reduced-motion support | S | Done |
| M2 | Global 300 ms color transition on every element | S | Done |
| M3 | Creating a habit takes 4+ taps, no defaults | S–M | Done (template chips deferred: template icons are emojis, see notes) |
| M4 | Generic first-run experience | M | Done |
| M5 | Mobile navigation and sidebar layout shift | M | Done |
| M6 | Heatmap awkward on phones | S | Open (superseded by N8) |
| M7 | Dashboard "today" numbers contradict each other | S | Done |
| M8 | Inconsistent loading / error / success states | M | Done (check_in / undo_check_in RPCs; the SQL in schema.sql must be applied in Supabase) |
| M9 | `Input` breaks email fields on mobile | S | Done |
| M10 | Contrast failures | S | Done (primary button fixed in N6) |
| M11 | Links that reload the whole app | S | Done |
| M12 | Single 1.49 MB JS bundle | S–M | Done |
| L1 | Code polish a reviewer will notice | S | Done |
| L2 | Font setup | S | Done |
| L3 | Achievement toast styling | S | Done |
| L4 | Navbar details | S | Done (via N13) |
| L5 | Copy and emoji | S | Done |
| L6 | Level curve ends early | S | Done |
| L7 | README accuracy | S | Done (LICENSE file decision pending) |
| N1 | Dashboard isn't built around today's check-ins | M | Dropped (owner's decision: no UI/layout changes); "Still to unlock" bug fixed |
| N2 | Controls that look real but do nothing | S | Done (Forgot password link removed, not wired: no reset page yet) |
| N3 | Weekly/custom frequencies behave as daily | S | Done (frequency field removed; weekly templates made daily) |
| N4 | Same habit shows different completion % per page | S | Done |
| N5 | No level-up moment, invisible streak risk, cluttered habit card | M | Done |
| N6 | Primary button and habit-colored text fail contrast | S | Done (primary-700 / primary-800) |
| N7 | Charts hard to read, trend dips every morning | S–M | Done (today marked in progress, fixed 0–100% bar scale; vertical bars and no chart text summaries by owner's decision) |
| N8 | Heatmap busy and awkward on phones | S–M | Open |
| N9 | Mobile shell rough edges | S–M | Done (h-dvh, merged celebration toasts; hamburger and toast position kept by owner's decision) |
| N10 | Navbar and sidebar remount on every page change | S–M | Done |
| N11 | Loading buttons lose their label | S | Done |
| N12 | First impression outside the app (login copy, meta tags) | S | Done (preview image is the logo until a 1200×630 screenshot exists) |
| N13 | Navbar details | S | Done (clock updates each minute; headings fixed; level badge links to Achievements) |
| N14 | Visual consistency across pages | S–M | Done (shared Card surface: rounded-3xl, gray border, p-4 sm:p-6) |
| N15 | Achievements page doesn't point to the next goal | S | Done (locked sorted by progress; other parts not wanted by owner) |
| N16 | Tab left open past midnight shows yesterday as today | S | Done |

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

---

# Round 2 (2026-10-16)

A re-read of the current source after most round-1 items were fixed. Verified working from round 1: optimistic check-off with Undo toast, "+10" burst and perfect-day confetti; one shared local-day rule set for streaks and rates; focus-trapped dialogs with Cancel focused first; reduced-motion support; dark theme applied before first paint; bottom tab bar on phones; route code splitting.

Core loop as of this round: creating a habit is 2 taps plus typing (open the form, type a name, press Enter). Checking off on a phone is 1 tap, but only after scrolling past about 7 blocks.

## Decisions (owner, 2026-10-16)

- **N3, weekly/custom frequencies:** hide them for now (option a). Remove "weekly" and "custom" from the selector only; keep the code paths (schema enum, types, DB values) so they can return when their rules exist.
  - Follow-up (2026-10-23): with only "daily" left, the Frequency field is removed from the habit form (the value stays registered as a hidden field, so existing weekly/custom habits keep theirs when edited; `FrequencySelector` is kept for later). The 5 weekly templates become daily with a target of 1; "Weekly Review" is renamed "Daily Review".
- **N1, dashboard layout:** don't change the dashboard's UI or layout. The restructure is dropped. The only change made under N1 is a logic fix: the "Still to unlock" preview filtered locked achievements with `unlockedAchievements.includes(achievement.id)`, comparing objects to an id, so it listed every achievement (including unlocked ones) and its "+N" counted all of them. It now uses `lockedAchievements` from `useAchievements`.
- **N2, Forgot password:** remove the link instead of wiring it. `resetPassword` redirects to `/reset-password`, which doesn't exist, so the email link would land on the 404 page. A full reset flow (request form plus a set-new-password page, and the URL added to Supabase's allowed redirect URLs) is M effort and left for later.
- **N6, primary button color:** primary buttons use `primary-700` (#047857) for the background and `primary-800` (#065f46) for hover. `primary-500` stays for fills, rings and accents. Reason: white text on `primary-600` is about 3.8:1, below the 4.5:1 WCAG AA minimum for normal-size text; white on `primary-700` is about 5.5:1 and on `primary-800` about 7.6:1. (The round-2 audit reply had suggested `primary-600` was enough for 16px bold; that was wrong, since bold text only counts as large from about 18.7px.)

## 🔴 Critical

### N1. The dashboard isn't built around today's check-ins (expands H1)
- **Problem:**
  - On a phone, `src/pages/DashboardPage.tsx` shows the header with "Browse Templates", the level card, 4 stat tiles, Today's Progress, the achievement count, and sometimes the Step 2 prompt before the first checkbox. The list (`src/components/habits/HabitsContainer.tsx`) then opens with its own search bar and All/Completed/Incomplete chips (`src/components/habits/HabitList.tsx:46-130`).
  - The category chips that filter the list are rendered at the bottom of the page (`DashboardPage.tsx:316-326`), below the achievement blocks. The list has three separate filter controls.
  - "Today" appears twice with the same number: the stat card (`DashboardPage.tsx:162`) and the `TodayProgress` card.
  - Achievements take three blocks: the count card, Recent Achievements, and "Still to unlock" with an endless `animate-pulse` glow (`DashboardPage.tsx:246`).
  - The header's main button is "Browse Templates", not "New habit". Featured Templates also shows to users who already have habits.
- **Why it matters:** Streaks, Finch and Habitica open on the list. A recruiter on a phone sees a stats page and has to hunt for the product.
- **Solution:**
  1. Order: compact strip (Today ring x/y, 🔥 best streak, level chip), then Today's Habits, then everything else.
  2. Move the category chips into the list header. Drop the search bar and status chips from the dashboard list (the Habits page has search).
  3. Sort habits that are done today to the bottom.
  4. Merge the three achievement blocks into one "Next achievement" card (closest locked one, with progress).
  5. Header button becomes "New habit". Show Featured Templates only when the user has fewer than 3 habits.
- **Effort:** M

### N2. Controls that look real but do nothing (expands H6)
- **Problem:**
  - "Delete Account" is a live red `Button` with no handler (`src/pages/SettingsPage.tsx:250`).
  - "Forgot password?" has no handler (`src/pages/LoginPage.tsx:86`), though `resetPassword` exists in `useAuth`.
  - "Profile" in the account menu goes to `/habits` (`src/components/layout/Navbar.tsx:167`).
  - The ⭐ favorite is `useState` only and resets on reload (`src/components/habits/HabitOverviewCard.tsx:44`).
  - Sort by "streak" and "rate" returns 0 (`src/pages/HabitsPage.tsx:86-91`).
  - List and Table views show "coming in a future update ✨" (`HabitsPage.tsx:262-282`).
  - Settings has four "Coming soon!" rows with fake grey toggles.
- **Why it matters:** Reviewers click everything. Dead controls read as an unfinished project; a dead danger button reads as broken.
- **Solution:** Remove the Delete Account row, the notification / change-password / 2FA rows, the List and Table toggles, the star and the Profile menu item. Wire up Forgot password with the existing `resetPassword`. Implement sort by streak (`getHabitStreaks`) and rate (`getHabitRate`).
- **Effort:** S

## 🟠 High

### N3. Weekly and custom frequencies can be picked but behave as daily
- **Problem:** `src/components/habits/FrequencySelector.tsx:15` offers daily, weekly and custom, but everything downstream uses daily rules (`src/lib/streaks.ts:14`, `src/lib/analytics.ts:13`). A weekly habit shows in "Today's Habits" every day, counts toward "perfect day", loses its streak after one day, and rates about 14%.
- **Why it matters:** The first weekly habit a user creates fails every day.
- **Decision:** Hide weekly and custom (see [Decisions](#decisions-owner-2026-10-16)).
- **Solution:** Offer only "daily" in `FrequencySelector` (or remove the selector if a single option looks odd, and keep "Daily" in the More options summary). Keep the `frequency` enum, types and DB values unchanged; existing weekly/custom habits must still load and edit without errors.
- **Effort:** S

### N4. The same habit shows a different completion % on different pages
- **Problem:**
  - Habits-page cards use `calculateCompletionRate` in `src/hooks/useHabitStats.ts:52+`: unique days since creation, ignoring `target_count` (1 of 3 counts as a full day).
  - Analytics uses `getHabitRate` (`src/lib/analytics.ts`): 30-day window, capped at the daily target.
  - The 7-day sparkline in `HabitOverviewCard.tsx` scales to its own maximum, so 1/1 every day looks like 3/3 every day, and it has no day labels.
- **Why it matters:** Undoes the H4/H5 "one set of numbers" work in the view where users compare habits.
- **Solution:** Use `getHabitRate(habit, completions)` in `useHabitStats`. Scale the sparkline to `target_count`; add M T W… labels with today highlighted.
- **Effort:** S

### N5. Gamification is missing its two strongest moments
- **Problem:**
  - No level-up moment: nothing in `src` reacts to crossing one of the 11 tiers; the level card just changes text.
  - Streak risk is invisible: `calculateCurrentStreak` keeps yesterday's streak alive, and `HabitCard` shows the same 🔥 N (`src/components/habits/HabitCard.tsx:157-165`) whether today is done or the streak ends at midnight.
  - `HabitCard` shows up to 7 chips next to the name (count, "daily", category, "1x per day", 🔥, 🏆, 🎉), and on phones the name is capped at `max-w-30` (120px, `HabitCard.tsx:112`).
- **Why it matters:** "Streak at risk" and "Level up!" drive Duolingo and Finch. Today the reward loop is points-only.
- **Solution:**
  - In `useToggleCompletion.onMutate`, compare the level before and after the points change; on a new level, `celebrate()` and show a level-up toast with the tier's emoji and label.
  - Grey flame and "Keep your N-day streak, check in today" when `current > 0` and today isn't done; orange once it is.
  - Drop the "daily" and "1x per day" chips; remove the name width cap and let chips wrap below the name.
- **Effort:** M

### N6. Primary button and habit-colored text fail contrast (closes the M10 decision)
- **Problem:**
  - Primary buttons are white on `#10b981` (`primary-500`), about 2.5:1 (`src/components/ui/Button.tsx:37`, `.btn-primary` in `src/index.css`). This covers every main CTA (Log In, Create Habit, Add habits).
  - Habit names on the Habits page are drawn in the habit's color (`HabitOverviewCard.tsx:91`); amber `#F59E0B`, lime `#84CC16` and cyan `#06B6D4` are about 2:1 on white.
- **Why it matters:** Lighthouse and axe flag it immediately.
- **Decision:** `primary-700` background, `primary-800` hover; `primary-500` stays for fills, rings and accents (see [Decisions](#decisions-owner-2026-10-16)).
- **Solution:** Update the primary variant in `Button.tsx` and `.btn-primary` in `index.css` to `bg-primary-700 hover:bg-primary-800`. Check other white-on-green text against the same rule (e.g. the active sidebar link `bg-primary-500 text-white` in `Sidebar.tsx`, the active Achievements filter chip). Render habit names in gray-900 / gray-100 with the colored icon chip carrying the color.
- **Effort:** S

## 🟡 Medium

### N7. Charts are hard to read and in places misleading
- **Problem:**
  - The trend line includes today's unfinished day (`getDailyTargetTrend` ends at today), so it drops toward 0% every morning; it also draws 30 dots, even on phones (`src/components/analytics/CompletionTrendChart.tsx`).
  - `src/components/analytics/HabitPerformanceChart.tsx`: vertical bars with names rotated -45° to -60° and cut to 7 characters on phones; 500px tall on desktop; Y axis not fixed to 0–100; a 0% habit has no visible bar.
  - No chart has a text alternative.
- **Solution:** Draw today as a hollow/dashed point, or end the trend at yesterday; hide dots on phones. Horizontal bar chart (`layout="vertical"`) with full names, 0–100 domain, % label at each bar end, about 32px per row. `role="img"` plus an `aria-label` summary (best and lowest habit).
- **Effort:** S–M

### N8. Heatmap is busy and still awkward on phones (expands M6)
- **Problem:** In `src/components/analytics/ActivityHeatmap.tsx`:
  - GitHub's green palette instead of the brand ramp; its own `MutationObserver` instead of `useTheme`.
  - Colors raw check-in counts while every other chart uses % of target.
  - Five tinted stat tiles (amber, green, red, blue, fuchsia) in a 4-column grid leave one orphan; "Total Days" in red reads as an error.
  - "Best Active Streak" here vs "Best Streak" in the page header measure different things with near-identical names.
  - On phones it opens at the oldest end, cells are 8px, and the hint says "Hover over a day".
  - Day labels use `gap-2.5` while cells use `gap-2`, so labels drift from their rows.
  - Cells aren't focusable and have only a `title`.
- **Solution:** Scroll to the end on mount; 4 months on phones. Brand ramp (`primary-100`…`primary-700`), colored by % of target met. Three neutral tiles (active days, busiest day, average per day). Label Mon, Wed, Fri only. "Tap a day" on touch. Visually hidden text summary.
- **Effort:** S–M

### N9. Mobile shell rough edges
- **Problem:**
  - `h-screen` with an inner scroll container (`src/components/layout/DashboardLayout.tsx:42`): on iOS Safari `100vh` exceeds the visible area, and the inner scroller stops the address bar from collapsing.
  - Two menu buttons on phones: the navbar hamburger and the tab bar's "More".
  - Toasts are top-right over the navbar; a check-in that completes the day and unlocks an achievement shows 3 toasts plus confetti at once.
- **Solution:** `h-dvh`, or let the body scroll. Remove the hamburger below `lg`. `position="bottom-center"` above the tab bar on phones; fold the check-in toast into the achievement toast when both fire.
- **Effort:** S–M

### N10. Navbar and sidebar remount on every page change
- **Problem:** Every page renders its own `<DashboardLayout>`, so navigation unmounts and remounts Navbar and Sidebar. Each sidebar link replays its entry animation (`src/components/layout/Sidebar.tsx:90-96`).
- **Why it matters:** Feels like a full reload; a reviewer will look for the layout-route pattern.
- **Solution:** One layout route in `src/App.tsx`: `<Route element={<ProtectedRoute><DashboardLayout><Outlet /></DashboardLayout></ProtectedRoute>}>` with the pages as children; remove the per-page wrappers.
- **Effort:** S–M

### N11. Loading buttons lose their label
- **Problem:** `src/components/ui/Button.tsx:66-70` replaces the label with "Loading..." ("Delete" → "Loading...", "Log In" → "Loading..."), and the width jumps. Settings works around it with its own "Saving..." (`src/pages/SettingsPage.tsx:149`).
- **Solution:** Keep the label, show the spinner in place of the left icon, set `aria-busy`; optional `loadingText` prop.
- **Effort:** S

### N12. First impression outside the app
- **Problem:**
  - Login has no logo or line about what HabitFlow is, only "Welcome back" (`src/pages/LoginPage.tsx`).
  - `index.html` has no `meta description`, Open Graph image, `theme-color` or apple-touch-icon.
  - The favicon is declared `image/svg+xml` but is `logo.png`.
  - The `<title>` says "Habit Flow"; the UI says "HabitFlow".
- **Why it matters:** The live link is shared on LinkedIn, résumés and Slack, where it previews as a bare title. (Separate from the dropped demo account, C3.)
- **Solution:** Logo plus a one-line pitch and 3 feature bullets on login and signup. OG/meta tags with a screenshot, `theme-color #10b981`, correct icon type, consistent name.
- **Effort:** S

## 🟢 Low

### N13. Navbar details (expands L4)
- **Problem:** The time in `src/components/layout/Navbar.tsx:36-42` never updates. A decorative `<h3>` "Happy Monday!" precedes the page `<h1>`, and there are two `<h1>` logos. `LevelBadge` has `cursor-pointer` and `hover:scale` but does nothing; its explanation is only a `title`.
- **Solution:** Date only. Logo text as a `span`. Make the badge a link (achievements/level) or drop its hover styles.
- **Effort:** S

### N14. Visual consistency across pages
- **Problem:** The Habits page uses its own gradient-text title with a Sparkles icon instead of `PageHeader` (`src/pages/HabitsPage.tsx:141-148`); its cards replay a 1s staggered fade after every filter change (`:252`) and use `hover:scale-[1.02]` plus a blur glow. Dashboard stat tiles use 4 different tints. Card surfaces vary (`bg-[#fefefe]` at `DashboardPage.tsx:216`, `.card`, hand-rolled `rounded-3xl`).
- **Solution:** `PageHeader` everywhere, one `Card` surface, neutral stat tiles with colored icons only, animate on first mount only.
- **Effort:** S–M

### N15. Achievements page doesn't point to the next goal
- **Problem:** Locked achievements are in database order; progress bars are hidden at 0% (`src/components/achievements/AchievementCard.tsx:84`); filter chips lack `aria-pressed` (`src/pages/AchievementsPage.tsx:125`); dark rarity backgrounds like `dark:bg-blue-800` are heavy.
- **Solution:** Sort locked by progress, highest first; pin a "Closest to unlocking" row; show progress as "3 / 7"; add `aria-pressed`; lighten dark tints to `/30`.
- **Effort:** S

### N16. A tab left open past midnight shows yesterday as today
- **Problem:** The `["completions", userId]` key in `src/hooks/useCompletions.ts` has no date, so an open tab keeps yesterday's check-ins until something refetches.
- **Solution:** Include `toDayKey(new Date())` in the key, or schedule a refetch at local midnight.
- **Effort:** S

## Top 3 for a portfolio review (round 2)

1. **Rebuild the dashboard around Today's Habits (N1).** The check-off is the best-built part of the app and it's halfway down the page.
2. **Remove or wire up every dead control (N2, N3).** Under an hour; removes the clearest "unfinished" signal.
3. **Add the missing reward moments (N5) and fix button contrast (N6).** Level-up, streak-at-risk, and readable CTAs.

**Quick wins:** N2, N3, N4, N6, N11, N12.
