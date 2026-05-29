# 🐧 PINGO
## Feature Implementation Plan — Enhanced Edition
**Building a Habit-Forming Social Platform for Gen-Z**

Version 1.1 | 2025 | For Engineering & Product Teams

---

## SECTION 00: EXECUTIVE SUMMARY

Pingo is a Gen-Z social platform engineered for high retention and daily engagement. Inspired by Duolingo's addictive loop mechanics, Pingo wraps social connection—matching, chat, and shared games—inside a gamification engine that rewards users every single day they open the app.

**🎯 North Star Metric:** Daily Active Users maintaining a 7-day streak.

### Design Pillars
- Habit Loop — trigger, action, reward on every session
- Social Accountability — streaks and leaderboards create gentle peer pressure
- Identity Building — Vibe Journey levels give users a profile they are proud of
- Play First — games are first-class citizens, not an afterthought
- Progressive Depth — casual users can lurk; power users have deep systems to master

---

## SECTION 01: GAMIFICATION ENGINE

### 1.1 XP & Levelling

XP is the universal currency of engagement, earned through virtually every action and never lost.

**XP Sources**

| **Action** | **XP Awarded** | **Daily Cap** | **Notes** |
|---|---|---|---|
| Send a chat message | 2 XP | 40 XP | Caps after 20 messages/day |
| Receive a reply | 3 XP | 30 XP | Rewards quality conversation |
| Complete a Daily Quest | 25–100 XP | No cap | Scales with quest difficulty |
| Play a mini-game | 10 XP | 50 XP | Win bonus: +15 XP |
| Win a game | 15 XP | 60 XP | Stacks with play XP |
| Send a game invite | 5 XP | 25 XP | Encourages social gaming |
| Accept a game invite | 5 XP | 25 XP | Both sides rewarded |
| Maintain a streak | 20 XP | No cap | Awarded at midnight |
| Complete onboarding | 200 XP | One-time | Strong first-session hook |
| Earn a badge | 50 XP | — | One-time per badge |
| Match with someone | 15 XP | 60 XP | First match of day is double |
| Log in (daily) | 10 XP | 10 XP | Bare minimum engagement |
| Profile view received | 1 XP | 10 XP | Passive social proof |
| Send a friend invite | 20 XP | 40 XP | Viral growth mechanic |
| Friend joins via invite | 100 XP | — | Referral bonus |

**XP Award Flow (Server-side Only)**

```
User performs action 
→ Service fires XPService.award(userId, amount, reason)
→ UPDATE users SET xp = xp + amount (atomic transaction)
→ newLevel = computeLevel(newXP)
→ if newLevel > oldLevel → LevelUpService.onLevelUp(userId, newLevel)
→ Emit xp:awarded + level:up socket events
→ NO client-side XP calculation — server is source of truth
```

⚡ **Critical Rule:** XP is ONLY modified server-side via `XPService.award()`. Client-side displays derived values only. Never trust client XP updates.

### 1.2 Streak System

A streak increments when a user completes at least one qualifying action each calendar day.

**Streak Rules**
- Defined by user's local timezone midnight boundary
- Qualifying actions: send message, play game, complete quest, or match
- Push notification at 20:00 if no action taken that day
- Final reminder at 22:30
- Streak milestones: 3, 7, 14, 30, 60, 100, 365 days — each grants bonus XP + badge

**Streak Shield (Forgiveness Mechanic)**

| **Shield Source** | **Shields Awarded** | **Max Held** | **Notes** |
|---|---|---|---|
| Reach 7-day streak | 1 shield | 3 | Auto-granted |
| Complete 5 quests/week | 1 shield | 3 | Weekly cadence |
| Level up | 1 shield | 3 | Celebration reward |
| Win 3 games/day | 1 shield | 3 | Gameplay incentive |
| Refer friend who joins | 2 shields | 3 | Viral growth |

### 1.3 Daily Quests

Quests reset at midnight and provide clear daily engagement goals.

**Quest Tier Design**

| **Tier** | **Difficulty** | **XP Range** | **Time** | **Examples** |
|---|---|---|---|---|
| Easy | Low | 25 XP | 2–5 min | Send 3 messages, Log in, View 2 profiles |
| Medium | Moderate | 50 XP | 10–20 min | Play a game, Match with someone |
| Hard | Challenging | 100 XP | 20–40 min | Win 2 games, Chat 15 min, Earn badge |

**Daily Quest Pool (Expanded — 45 Total Quests)**

*Easy (15 quests):*
1. Send your first message of the day
2. View 2 user profiles
3. Log in today
4. Send 3 messages
5. Receive 2 replies
6. React with emoji to 1 message
7. View the leaderboard
8. Complete your Vibe Check
9. Check your Vibe Journey progress
10. Visit the games section
11. Send a message with a GIF
12. Open a chat with a friend
13. Accept one game invite
14. View your badges
15. Share your profile

*Medium (15 quests):*
1. Play any mini-game
2. Win a game of Truth or Dare
3. Match with 2 new people
4. Keep your streak alive
5. Invite a friend to a game (in-chat)
6. Complete 2 easy quests
7. Win a game of Emoji Challenge
8. Send a voice message
9. Complete your onboarding (first time only)
10. Participate in a debate round (Would You Rather)
11. Win 1 game
12. Chat for 10 minutes
13. React to 5 messages
14. View 5 user profiles
15. Accept 2 game invites

*Hard (15 quests):*
1. Win 2 games
2. Chat for 15 minutes
3. Earn a badge today
4. Complete all easy quests
5. Win a Quick Match game
6. Match with 3 new people
7. Reach top 50 on leaderboard
8. Complete 1 medium + 1 easy quest
9. Win 2 games in one day
10. Send 50 messages today
11. Play all 4 game types
12. Achieve a new Vibe Level
13. Win a Truth or Dare game
14. Maintain a 5-message conversation
15. Unlock a new badge

**Quest Rules**
- Each user gets 3 quests/day: 1 Easy, 1 Medium, 1 Hard (randomly selected)
- Users can skip 1 quest/day (24h cooldown)
- All 3 completed = bonus 50 XP + streak day counts automatically
- Progress persists server-side
- Show progress bar on each quest (e.g., "Send messages: 2/3")

---

## SECTION 02: BADGES & ACHIEVEMENTS (ENHANCED)

### 2.1 Badge Trigger Logic & Implementation

Every badge needs a defined trigger event and condition check.

**Badge Award Flow:**
```
User action
→ Relevant Service fires BadgeService.checkEligibility(userId, eventType)
→ Query badge_progress table
→ Condition met? → Award badge → +50 XP → Emit badge:earned socket event
→ Store in UserBadges table with earned_at timestamp
```

**Complete Badge Trigger Table**

| **Badge** | **Category** | **Condition** | **Trigger Event** | **One-time?** |
|---|---|---|---|---|
| 3-Day Spark | Streak | streakDays >= 3 | StreakService.cron (midnight) | ✅ |
| 7-Day Flame | Streak | streakDays >= 7 | StreakService.cron | ✅ |
| 14-Day Blaze | Streak | streakDays >= 14 | StreakService.cron | ✅ |
| 30-Day Inferno | Streak | streakDays >= 30 | StreakService.cron | ✅ |
| 60-Day Phoenix | Streak | streakDays >= 60 | StreakService.cron | ✅ |
| 100-Day Century | Streak | streakDays >= 100 | StreakService.cron | ✅ |
| 365-Day Legend | Streak | streakDays >= 365 | StreakService.cron | ✅ |
| First Win | Game | gameWins >= 1 | GameService.onGameEnd | ✅ |
| 10 Wins | Game | gameWins >= 10 | GameService.onGameEnd | ✅ |
| 25 Wins | Game | gameWins >= 25 | GameService.onGameEnd | ✅ |
| Truth or Dare Pro | Game | ToD wins >= 5 | GameService.onGameEnd (gameType=TOD) | ✅ |
| Emoji Virtuoso | Game | Emoji Challenge wins >= 5 | GameService.onGameEnd (gameType=EMOJI) | ✅ |
| Would You Rather Sage | Game | WYR wins >= 5 | GameService.onGameEnd (gameType=WYR) | ✅ |
| Quick Match Champ | Game | Weekly rank = #1 in Quick Match | LeaderboardService.cron (Monday) | ❌ Weekly |
| Conversation Starter | Social | total_messages >= 50 | ChatService.sendMessage | ✅ |
| Conversationalist | Social | total_messages >= 500 | ChatService.sendMessage | ✅ |
| Match Maker | Social | total_matches >= 10 | MatchingService.onMatch | ✅ |
| Love Connector | Social | total_matches >= 50 | MatchingService.onMatch | ✅ |
| Invite King/Queen | Social | successful_referrals >= 5 | ReferralService.onJoin | ✅ |
| Quest Rookie | Quest | quests_completed >= 1 | QuestService.completeQuest | ✅ |
| Quest Veteran | Quest | quests_completed >= 50 | QuestService.completeQuest | ✅ |
| 7-Day Quest Streak | Quest | quest_streak >= 7 (≥1 quest/day) | QuestService.completeQuest | ✅ |
| Night Owl 🦉 | Hidden | Action between 00:00–04:00 local, 3+ separate nights | Any service action | ✅ Hidden |
| Early Bird 🌅 | Hidden | Action between 05:00–07:00 local, 3+ separate mornings | Any service action | ✅ Hidden |
| Secret Handshake 🤝 | Hidden | Both users in match have same Vibe Level | MatchingService.onMatch | ✅ Hidden |

### 2.2 Badge Database Schema

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  badge_type VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30),
  icon_url VARCHAR(255),
  rarity_tier VARCHAR(20) -- COMMON, RARE, EPIC, LEGENDARY
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  featured_order INT,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE badge_progress (
  user_id UUID REFERENCES users(id),
  badge_type VARCHAR(50),
  current_value INT DEFAULT 0,
  target_value INT NOT NULL,
  last_checked_at TIMESTAMP,
  PRIMARY KEY (user_id, badge_type)
);
```

### 2.3 Badge Rarity Tiers

Badges now have visual rarity to add collectibility psychology:

| **Tier** | **Visual** | **Examples** | **Glow** |
|---|---|---|---|
| Common | Blue border | First Win, 3-Day Spark | Soft blue |
| Rare | Purple border | Truth or Dare Pro, 7-Day Flame | Vibrant purple |
| Epic | Gold border | 30-Day Inferno, 10 Wins | Warm gold |
| Legendary | Rainbow glow | Secret Handshake, 365-Day Legend | Animated rainbow |

### 2.4 Limited-Time / Seasonal Badges

- **Pingo OG** (First 90 days) — Auto-awarded to users who joined in launch window
- **Summer Vibes** (June 1–Aug 31) — Complete 50 quests during summer
- **Birthday Buddy** (User's birthday) — Special badge once per calendar year
- **Pingo Anniversary** (Yearly milestone) — Awarded on user's account anniversary

---

## SECTION 03: VIBE JOURNEY (ENHANCED)

### 3.1 Core Concept & Architecture

Vibe Journey is Pingo's identity system — users don't just grind XP, they progress through a named, themed journey.

- 10 Vibe Levels, each with unique cosmetics and perks
- Progress driven exclusively by XP (server-calculated only)
- Dedicated Vibe Journey page showing full path + upcoming rewards
- Current level displayed on profile, chat headers, and match cards

### 3.2 Server-Side Level Calculation (Critical for Security)

**Level Thresholds (Hard-coded)**
```
const LEVEL_THRESHOLDS = [
  0,      // Level 1: Vibe Seedling
  200,    // Level 2: Vibe Spark
  550,    // Level 3: Vibe Pulse
  1100,   // Level 4: Vibe Wave
  1900,   // Level 5: Vibe Glow
  3000,   // Level 6: Vibe Current
  4500,   // Level 7: Vibe Storm
  6500,   // Level 8: Vibe Nova
  9100,   // Level 9: Vibe Legend
  12500   // Level 10: Vibe Infinite
];

function computeLevel(totalXP) {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}
```

**XP Award Flow with Level-Up:**
```
XPService.award(userId, amount, reason)
  → START TRANSACTION
  → oldLevel = SELECT level FROM users WHERE id = userId
  → UPDATE users SET xp = xp + amount, updated_at = NOW()
  → newLevel = computeLevel(newXP from SELECT)
  → if newLevel > oldLevel:
      → LevelUpService.onLevelUp(userId, oldLevel, newLevel)
      → Award Vibe Journey badge for newLevel (if not already earned)
      → Grant 1 Streak Shield
      → Log event to events table
      → Emit level:up socket event
  → COMMIT TRANSACTION
  → Emit xp:awarded socket event
```

### 3.3 Level-Up Service

**On Level Up, Execute:**
1. Award the corresponding Vibe Journey badge (one-time per level)
2. Unlock cosmetic (add to `unlocked_cosmetics[]` array on user profile)
3. Grant 1 Streak Shield (max 3)
4. Store `pendingLevelUp = true` flag in Redis
5. Send push notification: "🎉 You reached Vibe [Level]!"
6. Emit socket event: `{ event: 'level:up', newLevel, cosmetic }`

**Client-side on app resume:**
- Check `pendingLevelUp` flag
- Show confetti animation + celebration popup
- Display cosmetic preview
- Show share sheet: "I just hit Vibe Storm on Pingo! 🌪️"
- Clear flag after animation

### 3.4 Level Thresholds & Cosmetics

| **Level** | **Title** | **Total XP** | **XP to Next** | **Profile Border** | **Avatar Frame** | **Chat Theme** | **Special Perk** |
|---|---|---|---|---|---|---|---|
| 1 | Vibe Seedling | 0 | 200 | Simple white ring | — | Default purple | — |
| 2 | Vibe Spark | 200 | 350 | Glowing yellow | Spark particles | Warm amber | Custom bio emoji |
| 3 | Vibe Pulse | 550 | 550 | Pulsing pink | Heartbeat wave | Neon pink | — |
| 4 | Vibe Wave | 1,100 | 800 | Ocean gradient | Wave animation | Ocean teal | 'Wave' reaction |
| 5 | Vibe Glow | 1,900 | 1,100 | Aurora ring | Glow halo | Aurora green | Priority match queue |
| 6 | Vibe Current | 3,000 | 1,500 | Electric ring | Lightning frame | Electric blue | Beta game early access |
| 7 | Vibe Storm | 4,500 | 2,000 | Storm swirl | Thunder bolts | Dark stormy grey | Custom status emoji |
| 8 | Vibe Nova | 6,500 | 2,600 | Supernova burst | Nova explosion | Deep indigo | Hall of Fame listing |
| 9 | Vibe Legend | 9,100 | 3,400 | Golden halo | Legend crown | Royal gold | Exclusive Legend badge |
| 10 | Vibe Infinite | 12,500 | — | Infinite loop | Cosmic portal | Cosmic black/gold | Dev AMA access |

### 3.5 Vibe Journey API & Database

**GET /api/vibe-journey**
```json
{
  "currentLevel": 4,
  "currentXP": 1350,
  "xpToNextLevel": 550,
  "percentComplete": 31,
  "levels": [
    {
      "level": 1,
      "title": "Vibe Seedling",
      "xpRequired": 0,
      "status": "completed",
      "cosmetics": { "border": "white_ring" },
      "badgeId": "seedling_badge"
    },
    {
      "level": 4,
      "title": "Vibe Wave",
      "xpRequired": 1100,
      "status": "current",
      "xpProgress": 250,
      "percentToNext": 31,
      "cosmetics": { "border": "ocean_gradient", "frame": "wave", "theme": "teal" }
    },
    {
      "level": 5,
      "title": "Vibe Glow",
      "xpRequired": 1900,
      "status": "locked",
      "cosmetics": { "border": "aurora", "perk": "priority_matching" }
    }
  ]
}
```

**User Profile Table Update:**
```sql
ALTER TABLE users ADD COLUMN (
  xp INT DEFAULT 0,
  unlocked_cosmetics JSONB DEFAULT '[]',
  featured_cosmetics JSONB DEFAULT '{}'
);
```

---

## SECTION 04: LEADERBOARD (ENHANCED — Implementation Details)

### 4.1 Ranking Logic

**Weekly Rank Calculation (Real-time):**
```sql
SELECT 
  u.user_id,
  u.username,
  u.vibe_level,
  u.weekly_xp,
  RANK() OVER (ORDER BY u.weekly_xp DESC) AS rank,
  COUNT(*) OVER () AS total_players
FROM users u
WHERE u.is_active = TRUE 
  AND u.weekly_xp > 0
ORDER BY rank
LIMIT 100;
```

**For Friends Leaderboard:**
```sql
SELECT 
  u.user_id,
  u.username,
  u.weekly_xp,
  u.vibe_level,
  RANK() OVER (ORDER BY u.weekly_xp DESC) AS rank
FROM users u
JOIN friendships f ON f.friend_id = u.user_id OR u.user_id = f.user_id
WHERE (f.user_id = :currentUserId OR f.friend_id = :currentUserId)
   OR u.user_id = :currentUserId
ORDER BY rank;
```

**Tie-Breaking Rule:**
Same XP → ranked by who reached that XP first. Use `last_xp_awarded_at` timestamp.

```sql
SELECT 
  u.user_id,
  u.weekly_xp,
  u.last_xp_awarded_at,
  RANK() OVER (ORDER BY u.weekly_xp DESC, u.last_xp_awarded_at ASC) AS rank
FROM users u
WHERE u.is_active = TRUE
ORDER BY rank;
```

### 4.2 Weekly Reset Cron (Runs Monday 00:00 UTC)

```javascript
// Runs every Monday at 00:00 UTC
async function leaderboardWeeklyReset() {
  const conn = await db.getConnection();
  
  try {
    await conn.beginTransaction();
    
    // 1. Snapshot top 10 for "Your Best Rank" feature
    const top10 = await conn.query(`
      SELECT user_id, rank, weekly_xp 
      FROM (
        SELECT user_id, 
          RANK() OVER (ORDER BY weekly_xp DESC) AS rank,
          weekly_xp
        FROM users WHERE is_active = TRUE
      ) t WHERE rank <= 10
    `);
    
    await conn.query(`
      INSERT INTO leaderboard_snapshots (user_id, rank, weekly_xp, snapshot_date)
      VALUES ${top10.map(r => `('${r.user_id}', ${r.rank}, ${r.weekly_xp}, NOW())`).join(',')}
    `);
    
    // 2. Award prizes
    const champ = top10[0];
    await XPService.award(champ.user_id, 500, 'weekly_champion_bonus');
    await BadgeService.awardBadge(champ.user_id, 'weekly_champ');
    
    const monthlyRank1 = await conn.query(`
      SELECT user_id, SUM(weekly_xp) as monthly_total
      FROM leaderboard_snapshots
      WHERE MONTH(snapshot_date) = MONTH(NOW())
      GROUP BY user_id
      ORDER BY monthly_total DESC
      LIMIT 1
    `);
    
    if (monthlyRank1.length > 0) {
      await XPService.award(monthlyRank1[0].user_id, 1000, 'monthly_legend_bonus');
      await BadgeService.awardBadge(monthlyRank1[0].user_id, 'monthly_legend');
    }
    
    // 3. Reset weekly XP
    await conn.query(`UPDATE users SET weekly_xp = 0`);
    
    // 4. Emit socket event to all connected users
    io.emit('leaderboard:reset', {
      timestamp: new Date(),
      newChamp: champ.user_id
    });
    
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    logger.error('Leaderboard reset failed:', err);
    throw err;
  }
}
```

### 4.3 Newcomer League (First 30 Days)

Users who joined in last 30 days see a separate leaderboard with peers of similar tenure — prevents discouragement.

```javascript
function getLeaderboardScope(userId) {
  const user = await User.findById(userId);
  const daysSinceJoin = (Date.now() - user.created_at) / (1000 * 60 * 60 * 24);
  
  if (daysSinceJoin < 30) {
    // Newcomer League
    return {
      scope: 'newcomer',
      query: `
        SELECT u.user_id, u.weekly_xp, 
          RANK() OVER (ORDER BY u.weekly_xp DESC) AS rank
        FROM users u
        WHERE DATEDIFF(NOW(), u.created_at) < 30
        ORDER BY rank
      `
    };
  } else {
    // Global League
    return {
      scope: 'global',
      query: /* standard global leaderboard query */
    };
  }
}
```

**After 30 days:** User automatically graduates to global leaderboard (automatic, no action needed).

### 4.4 Real-Time Rank Updates (Optimized)

Don't push rank updates on every XP award — too expensive. Instead:

**Strategy:**
- Rank computed on-demand when user opens Leaderboard tab (every 30s cache)
- Push `leaderboard:rank` socket event ONLY on significant changes:
  - User rank changes by >5 positions, OR
  - User enters/leaves top 10, OR
  - User reaches a milestone (every 10 places: 10, 20, 30...)

```javascript
async function onXPAwarded(userId, amount) {
  // ... XP award logic ...
  
  // Only update leaderboard if XP amount is significant or user is in top 100
  const user = await User.findById(userId);
  const oldRank = await getLeaderboardRank(userId);
  
  // Force rank recalc
  const newRank = await getLeaderboardRank(userId);
  
  if (Math.abs(oldRank - newRank) >= 5 || oldRank <= 10 || newRank <= 10) {
    const leaderboardData = await getLeaderboardAroundUser(userId);
    io.to(userId).emit('leaderboard:rank', leaderboardData);
  }
}
```

### 4.5 Leaderboard UI States

**State 1: User in top 10**
→ Show full top 10 with user highlighted + animated position change

**State 2: User ranked 11–100**
→ Show top 3 + "..." + user ±2 positions

**State 3: User ranked 100+**
→ Show top 3 + "..." + user's row at bottom with rank number

**All states show:**
- User's vibe level badge next to name
- XP earned this week
- Position change from last week (↑3, ↓2, → no change)
- User's friends' positions prominently

### 4.6 Leaderboard API

```
GET /api/leaderboard/weekly?scope=global|friends|newcomer
  → Returns top 100 + user's position

GET /api/leaderboard/monthly
  → Returns monthly cumulative rankings

GET /api/leaderboard/all-time
  → Returns all-time total XP (Hall of Fame)

GET /api/leaderboard/me
  → Returns user's current rank, XP, weekly/monthly/all-time position
```

---

## SECTION 05: CHAT SYSTEM
*(Unchanged from original plan)*

---

## SECTION 06: MINI-GAMES (ENHANCED — Win Conditions & Detailed Rules)

### 6.1 Game Overview

| **Game** | **Type** | **Players** | **Duration** | **XP (Play)** | **XP (Win)** | **Hook** |
|---|---|---|---|---|---|---|
| Truth or Dare | Social/Party | 2 | 5–15 min | 10 XP | 15 XP | Vulnerability deepens bonds |
| Emoji Challenge | Creative/Puzzle | 2 | 3–8 min | 10 XP | 15 XP | Low barrier, highly shareable |
| Would You Rather | Opinion/Debate | 2 | 5–10 min | 10 XP | 15 XP | Reveals personality |
| Quick Match | Reaction/Trivia | 2 | 2–5 min | 10 XP | 15 XP | Fast dopamine hit |

### 6.2 Truth or Dare — Complete Rules

**Win Condition (NEW — was missing):**

- Each player starts with 0 **Brave Points**
- Per round (5 total rounds):
  - Completing a Truth or Dare = **+2 Brave Points**
  - Opponent votes "Brave" = **+1 bonus point**
  - Opponent votes "Skipped" = **0 points**
  - Missing answer timer = **0 points**
- **After 5 rounds:** Player with highest Brave Points wins
- **Max Brave Points possible:** 15 (5 rounds × 3 points)
- **Tie after 5 rounds:** Sudden Death round
  - 1 final Truth or Dare
  - Both players must complete it
  - Both vote on who was braver
  - Winner takes game

**Question Decks (3 Tiers):**

| **Deck** | **Unlock** | **Tone** | **Count** |
|---|---|---|---|
| Mild (default) | Level 1 | Light, safe | 200+ questions |
| Spicy | Level 3 | Edgy, flirty | 150+ questions |
| Deep | Level 5 | Personal, vulnerable | 100+ questions |

**Sample Questions (Mild Deck):**
- If you could be friends with anyone, who would it be?
- What's your most embarrassing moment?
- Have you ever lied on a dating profile?
- What's the strangest thing in your room right now?
- If you could have any superpower, what would it be?

**Sample Truths (Spicy Deck):**
- Have you ever ghosted someone?
- What's the most flirty DM you've sent?
- Have you ever catfished someone (even as a joke)?

**Sample Dares (Spicy Deck):**
- Send a funny selfie to our chat
- Screenshot your home screen and send it
- Teach us your go-to pickup line
- Send a video of you dancing for 10 seconds
- Compliment yourself in 3 different languages

### 6.3 Emoji Challenge — Complete Rules

**Setup:**
- One player sends an emoji combination (3–5 emojis)
- Other player guesses the movie, song, phrase, or concept
- 30-second timer per round
- 5 rounds per game

**Scoring:**
- Correct in <10s = **3 points**
- Correct in 10–20s = **2 points**
- Correct in 20–30s = **1 point**
- Incorrect or timeout = **0 points**

**Win Condition:**
- Player with most points after 5 rounds wins
- Ties → Sudden Death: 1 bonus emoji, first correct answer wins
- Both guess wrong or timeout → draw on that round (0–0)

**Win Bonus:**
- Winner gets **15 XP + win badge progress**
- Loser gets **10 XP + play badge progress**

### 6.4 Would You Rather — Complete Rules

**Setup:**
- Both players shown same "Would you rather A or B?" question simultaneously
- They answer privately (opponent can't see)
- Answers revealed at same time

**Scoring (per question):**
- **Matching answer = 2 pts each** (we think alike!)
- **Different answer = debate round:**
  - Each player has 30s to justify choice
  - Both players vote on whose argument was better
  - Winner of debate = 3 pts, loser = 0 pts
  - If both agree = 2 pts each

**Game Length:**
- 8 questions per game
- Max points = 24

**Win Condition:**
- Player with most points after 8 questions wins
- **Tie after 8:** 1 tiebreaker question (same format), first match wins game

**Sample Questions:**
- Would you rather always be 10 minutes late or 20 minutes early?
- Would you rather fight 1 horse-sized duck or 100 duck-sized horses?
- Would you rather have unlimited sushi or unlimited pizza?
- Would you rather live in a world without music or without movies?

### 6.5 Quick Match — Complete Rules

**Setup:**
- Rapid-fire trivia / reaction game
- Questions from pop culture, general knowledge, memes, Pingo meta

**Question Categories:**
- **Pop Culture** (movies, TV, music, celebrities)
- **Memes** (identify memes, complete meme captions)
- **General Knowledge** (geography, history, science)
- **Pingo Trivia** (facts about Pingo features — meta & fun)

**Mechanics:**
- First to answer correctly earns the point
- Wrong answer = **freeze 3s** (opponent sees ❌ animation)
- If neither answers in 10s = both get **0 pts**, next question
- **15 questions per game**
- **10-second window per question**

**Win Condition:**
- Player with most points after 15 questions wins
- Wins contribute to **Quick Match game-specific weekly leaderboard**

**Quick Match Leaderboard:**
- Separate from global leaderboard
- Tracks wins per game type
- Top player weekly gets **"Quick Match Champ"** badge

### 6.6 Game Flow State Machine (All Games)

```
WAITING_FOR_PLAYERS (socket: waiting_for_opponent)
  → Both players connected? 
  → COUNTDOWN (3s visual countdown)
  
COUNTDOWN
  → 3... 2... 1...
  → ROUND_ACTIVE

ROUND_ACTIVE
  → Gameplay happens (Truth/Dare, Emoji guessing, etc.)
  → Timer running
  → Responses collected

ROUND_RESULT (2s)
  → Display round result (points, winner of round)
  → Emit: game:round_complete with score

[REPEAT ROUND_ACTIVE + ROUND_RESULT × N rounds]

GAME_OVER
  → Final score displayed
  → Winner announced
  → +15 XP (winner), +10 XP (loser)
  → Emit: game:ended with results

RESULT_SCREEN (30s default)
  → Show winner, XP awarded, badges earned
  → CTA: "Rematch?" button
  → Share to story button
  → Back to chat button

REMATCH_PENDING (30s window)
  → If both tap "Rematch?" → auto-create new session
  → Otherwise → archived

ARCHIVED
  → Game session persisted to PostgreSQL
  → Redis key deleted (TTL expired)
  → Results available in game history
```

### 6.7 Rematch Flow (NEW)

After result screen, add **"Rematch?" button**. If both players tap within 30s:

```javascript
async function initiateRematch(sessionId) {
  const oldSession = await GameSession.findById(sessionId);
  
  if (rematchVotes >= 2 && rematchVotesAt < 30s_old) {
    const newSession = await GameSession.create({
      gameType: oldSession.gameType,
      player1Id: oldSession.player1Id,
      player2Id: oldSession.player2Id,
      status: 'PENDING',
      createdAt: NOW()
    });
    
    io.to([player1, player2]).emit('game:rematch_started', {
      sessionId: newSession.id,
      gameType: oldSession.gameType
    });
    
    // Navigate both players to new game lobby
  }
}
```

**Impact:** Dramatically increases games-per-DAU and session length.

### 6.8 Graceful Disconnect Handling

If opponent disconnects for >60s during active game:

```javascript
async function handleDisconnect(userId, sessionId) {
  const session = await GameSession.findById(sessionId);
  
  if (session.status === 'ACTIVE') {
    // Wait 60 seconds for reconnect
    setTimeout(async () => {
      const player = await User.findById(userId);
      
      if (!player.isConnected) {
        // Opponent doesn't reconnect → disconnect wins
        const winner = session.getOtherPlayer(userId);
        
        const finalResult = {
          winner,
          loser: userId,
          winnerXP: 11, // 75% of 15 XP
          loserXP: 0,
          reason: 'opponent_disconnect',
          timestamp: NOW()
        };
        
        await GameSession.update(sessionId, { 
          status: 'COMPLETE',
          result: finalResult
        });
        
        await XPService.award(winner, 11, 'game_win_disconnect');
        
        io.to(winner).emit('game:won_by_disconnect');
      }
    }, 60000);
  }
}
```

---

## SECTION 07: MATCHING & DISCOVERY
*(Unchanged from original plan)*

---

## SECTION 08: PUSH NOTIFICATIONS
*(Unchanged from original plan)*

---

## SECTION 09: TECHNICAL IMPLEMENTATION

### 9.1 Data Models (Updated)

**UserGameification**
```sql
CREATE TABLE user_gamification (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  xp INT DEFAULT 0,
  level INT GENERATED ALWAYS AS (
    CASE 
      WHEN xp >= 12500 THEN 10
      WHEN xp >= 9100 THEN 9
      WHEN xp >= 6500 THEN 8
      WHEN xp >= 4500 THEN 7
      WHEN xp >= 3000 THEN 6
      WHEN xp >= 1900 THEN 5
      WHEN xp >= 1100 THEN 4
      WHEN xp >= 550 THEN 3
      WHEN xp >= 200 THEN 2
      ELSE 1
    END
  ) STORED,
  streak_days INT DEFAULT 0,
  streak_shields INT DEFAULT 0 CHECK (streak_shields <= 3),
  last_qualifying_action_at TIMESTAMP,
  weekly_xp INT DEFAULT 0,
  monthly_xp INT DEFAULT 0,
  unlocked_cosmetics JSONB DEFAULT '[]',
  pending_level_up BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**DailyQuest**
```sql
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  quest_type VARCHAR(50),
  tier VARCHAR(10) CHECK (tier IN ('EASY', 'MEDIUM', 'HARD')),
  progress_current INT DEFAULT 0,
  progress_target INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  xp_reward INT,
  assigned_date DATE,
  skipped BOOLEAN DEFAULT FALSE,
  skipped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Badge & BadgeProgress**
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  badge_type VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100),
  description TEXT,
  category VARCHAR(30),
  rarity_tier VARCHAR(20) DEFAULT 'COMMON',
  icon_url VARCHAR(255)
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE badge_progress (
  user_id UUID REFERENCES users(id),
  badge_type VARCHAR(50),
  current_value INT DEFAULT 0,
  target_value INT NOT NULL,
  last_checked_at TIMESTAMP,
  PRIMARY KEY (user_id, badge_type)
);
```

**GameSession**
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY,
  game_type VARCHAR(20) CHECK (game_type IN ('TOD', 'EMOJI', 'WYR', 'QUICKMATCH')),
  player1_id UUID REFERENCES users(id),
  player2_id UUID REFERENCES users(id),
  status VARCHAR(20) CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETE', 'ABANDONED')),
  winner_id UUID REFERENCES users(id),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  game_state JSONB,
  xp_awarded_p1 INT DEFAULT 0,
  xp_awarded_p2 INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 9.2 New API Endpoints

```
GET  /api/gamification/me
     → Returns XP, level, streak, shields, weekly_rank

GET  /api/quests/daily
     → Returns 3 quests with progress

POST /api/quests/:id/complete
     → Mark quest complete, award XP

POST /api/quests/:id/skip
     → Skip quest (1x/day)

GET  /api/badges/me
     → All earned + locked with progress

PATCH /api/badges/featured
     → Set featured badges (array of 6 max)

GET  /api/vibe-journey
     → Full Vibe Journey data with cosmetics

GET  /api/leaderboard/weekly?scope=global|friends|newcomer
     → Top 100 + user position

GET  /api/leaderboard/me
     → User's current rank + stats

GET  /api/games/:gameId/invite
     → Create game invite (for in-chat)

POST /api/games/:sessionId/result
     → Submit game result, award XP
```

### 9.3 Socket.IO Events

**Gamification Events:**
```
xp:awarded → { userId, amount, reason, newXP, newLevel }
level:up → { userId, newLevel, cosmetic, shields }
badge:earned → { userId, badgeId, badgeTitle, xpBonus }
streak:updated → { userId, days, shields }
quest:completed → { userId, questId, xpReward, bonusXP }
leaderboard:rank → { userId, rank, position, weeklyXP }
leaderboard:reset → { timestamp, topPlayer }
game:ended → { result, xpAwarded, badgeProgress }
rematch:started → { sessionId, gameType }
```

---

## SECTION 10: ADDITIONAL FEATURES (NEW)

### 10.1 Quest Streaks

Track consecutive days with at least 1 completed quest.

**Database:**
```sql
ALTER TABLE users ADD COLUMN quest_streak INT DEFAULT 0;
ALTER TABLE users ADD COLUMN quest_streak_frozen BOOLEAN DEFAULT FALSE;
```

**Logic:**
- Increment `quest_streak` when user completes first quest of the day
- Reset to 0 if user misses a full day (midnight UTC)
- Can use quest streak freeze once/week (separate from activity streaks)
- **"Quest Veteran"** badge at 7-day quest streak

**Cron (midnight UTC):**
```javascript
async function updateQuestStreaks() {
  // For each user:
  const lastQuestDay = await getLastQuestCompletionDate(userId);
  const today = getUTCDate();
  
  if (lastQuestDay < today - 1) {
    // Missed a day
    if (user.quest_streak_frozen) {
      user.quest_streak_frozen = false;
      // Don't reset streak
    } else {
      user.quest_streak = 0;
    }
  }
}
```

### 10.2 XP Multiplier Events

**"Double XP Weekend"** — 2x XP for all actions for 48h.

**Setup:**
```sql
ALTER TABLE system_config ADD COLUMN (
  xp_multiplier FLOAT DEFAULT 1.0,
  multiplier_active_until TIMESTAMP
);
```

**Trigger:**
- Announced Friday 18:00 local time via push: "🚀 Double XP Weekend Starts Now!"
- Active: Friday 18:00 → Sunday 23:59
- All XP awards doubled: `XPService.award(userId, amount * xp_multiplier)`
- Massive engagement spike tool — schedule strategically (around holidays, season launches)

**Client-side:**
- Add XP multiplier badge to activity feed: "2x ✨"
- Show countdown timer in XP indicator

### 10.3 Hall of Fame Page

Level 8+ perk — static page listing top all-time users.

**GET /api/hall-of-fame**
```json
{
  "topPlayers": [
    {
      "rank": 1,
      "userId": "...",
      "username": "...",
      "vibeLevel": 10,
      "totalXP": 50000,
      "badges": ["...", "..."],
      "joinedAt": "2025-01-15"
    },
    // ... top 50 ...
  ],
  "yourRank": 47,
  "unlockLevel": 8
}
```

**UI:**
- Scrollable list of top 50 all-time users
- Shows Vibe Level, total XP, badge count
- User's current rank highlighted
- Aspirational content — drives long-term retention
- Locked until Level 8

### 10.4 Seasonal / Limited-Time Badges

**Pingo OG Badge**
- Auto-awarded to users who joined within first 90 days of launch
- One-time, non-repeatable
- Creates urgency for early adoption: "Join the launch cohort"
- Display: Special ⭐ icon, "Original Pingo User"

**Seasonal Badges (Quarterly)**
- **Summer Vibes** (Jun 1–Aug 31) — Complete 50 quests during summer
- **Winter Warrior** (Dec 1–Feb 28) — Maintain 30-day streak
- **Spring Awakening** (Mar 1–May 31) — Win 10 games
- **Autumn Ascent** (Sep 1–Nov 30) — Reach Level 7+

**Birthday Badge**
- Awarded on user's birthday (annually)
- Shows actual date in badge
- Special notification: "🎂 It's your Pingo birthday! Celebrate with +50 XP"

**Anniversary Badge**
- Awarded on account anniversary date
- Yearly milestone: "1 Year Pingo," "2 Years Pingo," etc.

---

## SECTION 11: IMPLEMENTATION ROADMAP (Updated)

### Phase 1 — Foundation (Weeks 1–3)
✅ XP engine with server-side validation
✅ Streaks + Streak Shield system
✅ Daily Quests (30–50 per tier)
✅ Basic badge triggers

### Phase 2 — Identity & Competition (Weeks 4–6)
✅ Full Badge system with rarity tiers
✅ Vibe Journey with cosmetics + server validation
✅ Leaderboard (weekly + friends + newcomer league)
✅ Quest Streaks + OG badge

### Phase 3 — Games (Weeks 7–10)
✅ All 4 games with detailed win conditions
✅ Game state machine + rematch flow
✅ In-chat game invites
✅ Game-specific leaderboards

### Phase 4 — Polish & Growth (Weeks 11–14)
✅ Push notification strategy
✅ XP multiplier events
✅ Hall of Fame page
✅ Seasonal badges
✅ Full analytics dashboard
✅ Onboarding flow design
✅ COPPA/GDPR compliance layer
✅ Performance optimization

---

## SECTION 12: SUCCESS METRICS

| **Metric** | **Target (4 weeks)** | **Target (8 weeks)** | **Health Threshold** |
|---|---|---|---|
| Daily Active Users | 5K | 15K | >70% of registered |
| 7-Day Retention | 45% | 55% | >50% |
| Avg Session Length | 8 min | 12 min | >6 min |
| XP per Daily User | 150 | 250 | >100 |
| Avg Quests/Day | 1.8 | 2.5 | >1.5 |
| Games Played/DAU | 0.6 | 1.2 | >0.8 |
| Badge Earn Rate | 2.5 badges/user | 5+ badges/user | Growing |
| Streak Maintenance | 30% of users | 50% of users | >25% |
| Leaderboard Engagement | 40% view weekly | 70% view weekly | >30% |

---

## APPENDIX A: Database Initialization Script

```sql
-- Core tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_gamification (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  streak_shields INT DEFAULT 0 CHECK (streak_shields <= 3),
  weekly_xp INT DEFAULT 0,
  monthly_xp INT DEFAULT 0,
  last_qualifying_action_at TIMESTAMP,
  unlocked_cosmetics JSONB DEFAULT '[]',
  quest_streak INT DEFAULT 0,
  quest_streak_frozen BOOLEAN DEFAULT FALSE
);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_type VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  rarity_tier VARCHAR(20) DEFAULT 'COMMON'
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_type VARCHAR(50),
  tier VARCHAR(10),
  progress_current INT DEFAULT 0,
  progress_target INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  xp_reward INT,
  assigned_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type VARCHAR(20),
  player1_id UUID REFERENCES users(id),
  player2_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'PENDING',
  winner_id UUID REFERENCES users(id),
  game_state JSONB,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_gamification_xp ON user_gamification(xp DESC);
CREATE INDEX idx_daily_quests_user_date ON daily_quests(user_id, assigned_date);
CREATE INDEX idx_game_sessions_players ON game_sessions(player1_id, player2_id);
CREATE INDEX idx_user_badges_featured ON user_badges(user_id, is_featured);
```

---

## APPENDIX B: Badge Trigger Checklist

Engineering team use this checklist to ensure all badge triggers are implemented:

- [ ] StreakService fires badge checks on daily cron (3, 7, 14, 30, 60, 100, 365 day badges)
- [ ] GameService fires badge checks on game end (First Win, 10 Wins, game-specific wins)
- [ ] ChatService fires badge check on 50th message (Conversation Starter)
- [ ] MatchingService fires badge check on 10th match (Match Maker)
- [ ] QuestService fires badge check on 50th quest + quest streak logic
- [ ] LeaderboardService fires badge check on weekly reset (Weekly Champ)
- [ ] AuthService tracks time-of-day for Night Owl / Early Bird (requires timezone logic)
- [ ] ReferralService fires badge check on successful join
- [ ] All badge awards emit socket event with animation trigger
- [ ] BadgeProgress table updated atomically with award
- [ ] XP awarded (50 XP) on badge earn
- [ ] Push notification sent if app in background

---

## APPENDIX C: XP Award Command Reference

Use this in all XP award locations:

```javascript
// Always use this method — never directly UPDATE xp
await XPService.award(userId, amount, reason);

// Reasons: 
// - 'message_sent', 'message_received'
// - 'game_play', 'game_win'
// - 'quest_completed'
// - 'match_made'
// - 'daily_login'
// - 'streak_maintained'
// - 'weekly_champion_bonus'
// - 'badge_earned'
// - etc.
```

---

*End of Document — Pingo Implementation Plan v1.1 (Enhanced)*
