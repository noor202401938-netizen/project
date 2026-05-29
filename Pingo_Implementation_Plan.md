**🐧 PINGO**

Feature Implementation Plan — Enhanced v1.1

*Building a Habit-Forming Social Platform for Gen-Z*

Version 1.1 | 2025 | For Engineering & Product Teams

**⚡ v1.1 Enhancements:** Full badge trigger logic, server-side Vibe Journey validation, detailed leaderboard implementation, game win conditions, quest streaks, XP multiplier events, Hall of Fame, seasonal badges.

---

**SECTION 00 EXECUTIVE SUMMARY**

> **Executive Summary**

Pingo is a Gen-Z social platform engineered for high retention and daily engagement. Inspired by the addictive loop mechanics of Duolingo, Pingo wraps social connection — matching, chat, and shared games — inside a gamification engine that rewards users every single day they open the app.

The core thesis is simple: make socialising feel like progress. Every interaction earns XP. Every day builds a streak. Every milestone unlocks a badge or levels up the user's Vibe Journey. The result is a platform users return to not just to chat, but to grow their digital identity.

> **🎯 North Star Metric:** Daily Active Users maintaining a 7-day streak.

**Design Pillars**

-   Habit Loop — trigger, action, reward on every session
-   Social Accountability — streaks and leaderboards create gentle peer pressure
-   Identity Building — Vibe Journey levels give users a profile they are proud of
-   Play First — games are first-class citizens, not an afterthought
-   Progressive Depth — casual users can lurk; power users have deep systems to master

---

**SECTION 01 GAMIFICATION ENGINE**

> **1. Gamification Engine**

The gamification engine is the heartbeat of Pingo. Every other feature feeds into or draws from it. It is composed of four tightly coupled sub-systems: XP & Levelling, Streaks, Daily Quests, and Badges.

**1.1 XP & Levelling**

XP (Experience Points) is the universal currency of engagement. It is earned through virtually every action on the platform and is never lost. The XP system must feel generous at low levels to hook new users and progressively more challenging to retain veterans.

**XP Award Flow (Server-side Only - CRITICAL)**

```
User performs action 
→ Service fires XPService.award(userId, amount, reason)
→ UPDATE users SET xp = xp + amount (atomic transaction)
→ newLevel = computeLevel(newXP)
→ if newLevel > oldLevel → LevelUpService.onLevelUp(userId, newLevel)
→ Emit xp:awarded + level:up socket events
→ NO client-side XP calculation — server is source of truth
```

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

**Level Thresholds**

Levels are branded as Vibe Levels (see Section 3). The XP curve follows a modified square root progression so early levels feel fast and satisfying while later levels provide a genuine long-term goal.

| **Level** | **Vibe Title** | **Total XP Required** | **XP to Next Level** | **Unlock** |
|---|---|---|---|---|
| 1 | Vibe Seedling | 0 | 200 | Base features |
| 2 | Vibe Spark | 200 | 350 | Custom profile border |
| 3 | Vibe Pulse | 550 | 550 | Animated avatar frame |
| 4 | Vibe Wave | 1,100 | 800 | Exclusive chat theme |
| 5 | Vibe Glow | 1,900 | 1,100 | Priority matching queue |
| 6 | Vibe Current | 3,000 | 1,500 | Beta game access |
| 7 | Vibe Storm | 4,500 | 2,000 | Custom status emoji |
| 8 | Vibe Nova | 6,500 | 2,600 | Leaderboard Hall of Fame |
| 9 | Vibe Legend | 9,100 | 3,400 | Exclusive Legend badge |
| 10 | Vibe Infinite | 12,500 | — | Infinite badge + dev AMA access |

> **⚡ Implementation Note:** Store cumulative XP as a single integer; derive level server-side from a lookup table. Never subtract XP — use separate 'streak shields' for forgiveness mechanics.

**1.2 Streak System**

Streaks are the most powerful retention tool in Pingo's arsenal. A streak increments when a user completes at least one qualifying action each calendar day. Missing a day breaks the streak — unless a Streak Shield is used.

**Streak Rules**

-   A streak day is defined by the user's local timezone midnight boundary.
-   Qualifying actions: sending a message, playing a game, completing a quest, or matching.
-   A push notification fires at 20:00 local time if no qualifying action has been taken that day.
-   A second notification fires at 22:30 as a final reminder.
-   Streak milestones: 3, 7, 14, 30, 60, 100, 365 days — each grants bonus XP and a milestone badge.

**Streak Shield (Forgiveness Mechanic)**

Streak Shields prevent a streak from breaking when a user misses a day. They are modelled on Duolingo's streak freeze. Shields are earned (not purchased) to keep the app free-to-play fair.

| **Shield Source** | **Shields Awarded** | **Max Held** | **Notes** |
|---|---|---|---|
| Reach 7-day streak | 1 shield | 3 | Auto-granted |
| Complete 5 quests/week | 1 shield | 3 | Weekly cadence |
| Level up | 1 shield | 3 | Celebration reward |
| Win 3 games/day | 1 shield | 3 | Gameplay incentive |
| Refer friend who joins | 2 shields | 3 | Viral growth reward |

> **🛡️ UX Note:** Show shield count prominently on the streak display. When a shield is consumed, show a satisfying animation and a message like 'Your Streak Shield saved you!'

**1.3 Daily Quests (Expanded)**

Daily Quests are Pingo's primary engagement driver. They reset at midnight and ensure users have a clear, achievable goal every time they open the app.

**Quest Tier Design**

| **Tier** | **Difficulty** | **XP Range** | **Time** | **Examples** |
|---|---|---|---|---|
| Easy | Low | 25 XP | 2–5 min | Send 3 messages, Log in, View 2 profiles |
| Medium | Moderate | 50 XP | 10–20 min | Play a game, Match with someone |
| Hard | Challenging | 100 XP | 20–40 min | Win 2 games, Chat 15 min, Earn badge |

**Daily Quest Pool (45 Total Quests - Prevents Repetition)**

*Easy Tier (15):* Send first message today, View 2 profiles, Log in today, Send 3 messages, Receive 2 replies, React with emoji to 1 message, View leaderboard, Complete Vibe Check, Check Vibe Journey progress, Visit games section, Send message with GIF, Open chat with friend, Accept game invite, View your badges, Share profile.

*Medium Tier (15):* Play any mini-game, Win Truth or Dare, Match with 2 new people, Keep streak alive, Invite friend to game (in-chat), Complete 2 easy quests, Win Emoji Challenge, Send voice message, Complete onboarding (first-time), Participate in debate round, Win 1 game, Chat for 10 minutes, React to 5 messages, View 5 profiles, Accept 2 game invites.

*Hard Tier (15):* Win 2 games, Chat for 15 minutes, Earn a badge today, Complete all easy quests, Win Quick Match game, Match with 3 new people, Reach top 50 leaderboard, Complete medium + easy quest, Win 2 games in one day, Send 50 messages today, Play all 4 game types, Achieve new Vibe Level, Win Truth or Dare game, Maintain 5-message conversation, Unlock new badge.

**Quest Refresh & Display Rules**

-   Each user receives 3 quests daily: 1 Easy, 1 Medium, 1 Hard — randomly drawn from pool.
-   Users may skip 1 quest/day (24h cooldown).
-   All 3 completed = bonus 50 XP + streak day counts automatically.
-   Quest progress persists server-side.
-   Show progress bar on each quest card.

---

**SECTION 02 BADGES & ACHIEVEMENTS (ENHANCED)**

> **2. Badges & Achievements**

Badges are permanent achievements displayed on a user's profile. They serve as social proof, conversation starters, and long-term engagement targets. Unlike XP, badges tell the story of who a user is on Pingo.

**2.1 Badge Trigger Logic & Implementation**

Every badge needs a defined trigger event and condition check.

**Badge Award Flow:**
```
User action → Relevant Service fires BadgeService.checkEligibility(userId, eventType)
→ Query badge_progress table → Condition met? → Award badge → +50 XP 
→ Emit badge:earned socket event → Store in user_badges with earned_at timestamp
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
| Emoji Virtuoso | Game | Emoji Challenge wins >= 5 | GameService.onGameEnd | ✅ |
| Would You Rather Sage | Game | WYR wins >= 5 | GameService.onGameEnd | ✅ |
| Quick Match Champ | Game | Weekly rank = #1 in Quick Match | LeaderboardService.cron | ❌ Weekly |
| Conversation Starter | Social | total_messages >= 50 | ChatService.sendMessage | ✅ |
| Conversationalist | Social | total_messages >= 500 | ChatService.sendMessage | ✅ |
| Match Maker | Social | total_matches >= 10 | MatchingService.onMatch | ✅ |
| Love Connector | Social | total_matches >= 50 | MatchingService.onMatch | ✅ |
| Invite King/Queen | Social | successful_referrals >= 5 | ReferralService.onJoin | ✅ |
| Quest Rookie | Quest | quests_completed >= 1 | QuestService.completeQuest | ✅ |
| Quest Veteran | Quest | quests_completed >= 50 | QuestService.completeQuest | ✅ |
| 7-Day Quest Streak | Quest | quest_streak >= 7 | QuestService.completeQuest | ✅ |
| Night Owl 🦉 | Hidden | Action 00:00–04:00, 3+ nights | Any service action | ✅ Hidden |
| Early Bird 🌅 | Hidden | Action 05:00–07:00, 3+ mornings | Any service action | ✅ Hidden |
| Secret Handshake 🤝 | Hidden | Both users same Vibe Level | MatchingService.onMatch | ✅ Hidden |

**2.2 Badge Display Rules**

-   Profile shows up to 6 featured badges (user-chosen); rest in 'All Badges' drawer.
-   New badge earned: full-screen celebration animation with share-to-story CTA.
-   Locked badges show silhouette + hint text to drive aspiration.
-   Rare / hidden badges show as '???' until earned — no hint text.

**2.3 Badge Rarity Tiers (NEW - Adds Collectibility)**

| **Tier** | **Visual** | **Examples** | **Glow Effect** |
|---|---|---|---|
| Common | Blue border | First Win, 3-Day Spark | Soft blue |
| Rare | Purple border | Truth or Dare Pro, 7-Day Flame | Vibrant purple |
| Epic | Gold border | 30-Day Inferno, 10 Wins | Warm gold |
| Legendary | Rainbow glow | Secret Handshake, 365-Day Legend | Animated rainbow |

**2.4 Limited-Time / Seasonal Badges (NEW)**

- **Pingo OG** — Auto-awarded to users who joined in first 90 days (creates FOMO for early adoption)
- **Summer Vibes** (Jun–Aug) — Complete 50 quests during summer
- **Winter Warrior** (Dec–Feb) — Maintain 30-day streak
- **Birthday Badge** — Awarded annually on user's account birthday
- **Anniversary Badges** — 1 Year, 2 Years, etc. on account anniversary

> **🏆 Gamification Principle:** Always show users what they are close to earning. A progress bar toward the next badge is more motivating than a list of distant targets.

---

**SECTION 03 VIBE JOURNEY (ENHANCED - Server Validation)**

> **3. Vibe Journey**

The Vibe Journey is Pingo's primary identity system. It is the user's 'character' — a visual, evolving representation of their time and activity on the platform. It replaces a bland 'level X' with a named, themed progression that users genuinely care about.

**3.1 Core Concept**

-   10 Vibe Levels, each with a unique title, colour palette, and unlockable cosmetic.
-   Progress is driven exclusively by XP — no special requirements beyond engagement.
-   A dedicated 'Vibe Journey' page shows the full path, current position, and upcoming rewards.
-   The current Vibe Level appears on the profile card, next to matching cards, and in chat headers.

**3.2 Server-Side Level Calculation (CRITICAL FOR SECURITY)**

**Level Thresholds (Hard-coded):**
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
      → Award Vibe Journey badge (if not already earned)
      → Grant 1 Streak Shield
      → Log event to events table
      → Emit level:up socket event
  → COMMIT TRANSACTION
  → Emit xp:awarded socket event
```

**3.3 Level-Up Service**

On Level Up, Execute:
1. Award the corresponding Vibe Journey badge (one-time per level)
2. Unlock cosmetic (add to `unlocked_cosmetics[]`)
3. Grant 1 Streak Shield (max 3)
4. Store `pendingLevelUp = true` flag in Redis
5. Send push: "🎉 You reached Vibe [Level]!"
6. Emit socket event with cosmetic data

**Client-side on app resume:**
- Check `pendingLevelUp` flag
- Show confetti animation + celebration popup
- Display cosmetic preview
- Show share sheet: "I just hit Vibe Storm on Pingo! 🌪️"
- Clear flag after animation

**3.4 Level Cosmetics & Rewards**

| **Level** | **Title** | **Profile Border** | **Avatar Frame** | **Chat Theme** | **Special Perk** |
|---|---|---|---|---|---|
| 1 | Vibe Seedling | Simple white ring | — | Default purple | — |
| 2 | Vibe Spark | Glowing yellow | Spark particles | Warm amber | Custom bio emoji |
| 3 | Vibe Pulse | Pulsing pink | Heartbeat wave | Neon pink | — |
| 4 | Vibe Wave | Ocean gradient | Wave animation | Ocean teal | 'Wave' reaction |
| 5 | Vibe Glow | Aurora ring | Glow halo | Aurora green | Priority match queue |
| 6 | Vibe Current | Electric ring | Lightning frame | Electric blue | Beta game early access |
| 7 | Vibe Storm | Storm swirl | Thunder bolts | Dark stormy grey | Custom status emoji |
| 8 | Vibe Nova | Supernova burst | Nova explosion | Deep indigo | Hall of Fame listing |
| 9 | Vibe Legend | Golden halo | Legend crown | Royal gold | Exclusive Legend badge |
| 10 | Vibe Infinite | Infinite loop | Cosmic portal | Cosmic black/gold | Dev AMA access |

**3.5 Vibe Journey API & Database**

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
      "percentToNext": 31
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

**SECTION 04 LEADERBOARD (ENHANCED - Implementation Ready)**

> **4. Leaderboard**

The Leaderboard creates healthy competition and gives users a reason to maximise their XP each week. It is scoped to prevent top players from permanently dominating and discouraging new users.

**4.1 Ranking Logic (Real-time)**

**Weekly Rank Calculation:**
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

**Tie-Breaking Rule:** Same XP → ranked by who reached that XP first using `last_xp_awarded_at` timestamp.

**4.2 Weekly Reset Cron (Runs Monday 00:00 UTC)**

```javascript
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
    
    // 2. Award prizes to #1
    const champ = top10[0];
    await XPService.award(champ.user_id, 500, 'weekly_champion_bonus');
    await BadgeService.awardBadge(champ.user_id, 'weekly_champ');
    
    // 3. Reset weekly XP
    await conn.query(`UPDATE users SET weekly_xp = 0`);
    
    // 4. Emit socket event
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

**4.3 Newcomer League (First 30 Days)**

Users who joined in last 30 days see a separate leaderboard with peers of similar tenure — prevents discouragement.

```sql
-- Newcomer League query
SELECT u.user_id, u.weekly_xp, 
  RANK() OVER (ORDER BY u.weekly_xp DESC) AS rank
FROM users u
WHERE DATEDIFF(NOW(), u.created_at) < 30
ORDER BY rank
LIMIT 100;
```

After 30 days: User automatically graduates to global leaderboard.

**4.4 Leaderboard Scopes**

| **Scope** | **Reset Cadence** | **Metric** | **Prize / Reward** | **Visibility** |
|---|---|---|---|---|
| Weekly Global | Monday 00:00 UTC | XP/week | 500 XP + Weekly Champ badge | All users |
| Weekly Friends | Monday 00:00 UTC | XP/week | Bragging + 100 XP | Friends only |
| Monthly Global | 1st of month | XP/month | 1000 XP + Monthly Legend | All users |
| All-Time Global | Never resets | Cumulative XP | Hall of Fame (Level 8+) | All users |
| Game-Specific | Weekly | Wins/game | Game Champion badge | All users |

**4.5 Real-Time Rank Updates (Optimized)**

Don't push updates on every XP award — too expensive. Instead, only emit socket event on significant changes:

```javascript
async function onXPAwarded(userId, amount) {
  const oldRank = await getLeaderboardRank(userId);
  const newRank = await getLeaderboardRank(userId);
  
  if (Math.abs(oldRank - newRank) >= 5 || oldRank <= 10 || newRank <= 10) {
    const leaderboardData = await getLeaderboardAroundUser(userId);
    io.to(userId).emit('leaderboard:rank', leaderboardData);
  }
}
```

**4.6 Leaderboard UI States**

- **State 1:** User in top 10 → Show full top 10 with user highlighted
- **State 2:** User ranked 11–100 → Show top 3 + "..." + user ±2 positions
- **State 3:** User ranked 100+ → Show top 3 + "..." + user's row at bottom

**4.7 Leaderboard API**

```
GET /api/leaderboard/weekly?scope=global|friends|newcomer
  → Top 100 + user's position

GET /api/leaderboard/monthly
  → Monthly cumulative rankings

GET /api/leaderboard/all-time
  → All-time total XP (Hall of Fame)

GET /api/leaderboard/me
  → User's current rank, XP, weekly/monthly/all-time position
```

---

**SECTION 05 CHAT SYSTEM**

> **5. Chat System**

Chat is the core social fabric of Pingo. It is built on Socket.IO for real-time delivery and is deeply integrated with the gamification engine. Every conversation is an opportunity to earn XP, launch a game, and deepen a connection.

**5.1 Chat Feature Matrix**

| **Feature** | **Priority** | **XP Integration** | **Notes** |
|---|---|---|---|
| 1:1 Real-time messaging | P0 | 2 XP/message (cap 40) | Core feature — must be rock solid |
| Message reactions | P0 | 1 XP/reaction given | Long press to react |
| Read receipts | P0 | — | Single tick sent, double tick read |
| Typing indicator | P1 | — | Animated dots |
| Image / GIF sharing | P1 | 3 XP/media sent | GIPHY integration |
| Voice messages | P2 | 5 XP/voice sent | Max 60 seconds |
| Message replies | P1 | — | Swipe right to reply |
| Chat themes | P1 | — | Tied to Vibe Level unlocks |
| In-chat game invite | P0 | 5 XP/invite sent | See Section 6 |
| Message search | P2 | — | Local search first |
| Chat archiving | P2 | — | Swipe left action |
| Block / Report in chat | P0 | — | Safety critical |

**5.2 In-Chat Game Invite**

The in-chat game invite is a key viral loop. When a user sends a game invite from inside a chat, it creates a shared moment that strengthens the social bond and earns XP for both parties.

**Invite Flow**

1.  User taps the '+' button in the chat input bar.
2.  A bottom sheet slides up showing available games with player counts.
3.  User selects a game. An invite card is sent as a chat message.
4.  Recipient sees the invite card with game name, sender's Vibe Level, and 'Accept / Decline' buttons.
5.  On accept: both users are navigated to the game lobby. XP is awarded to both.
6.  On decline: a polite decline message is sent automatically ('Maybe later! 👋').
7.  Invite expires after 5 minutes if not responded to.

> **🎮 Design Note:** The invite card should feel premium — show the game's cover art, an animated shimmer border, and a countdown timer for urgency.

---

**SECTION 06 GAMES (ENHANCED - Win Conditions & Rematch)**

> **6. Mini-Games**

Games are Pingo's secret weapon for retention. They transform passive scrolling into active play, create shared memories between users, and generate XP for both parties.

**6.1 Game Overview**

| **Game** | **Type** | **Players** | **Duration** | **XP (Play)** | **XP (Win)** | **Hook** |
|---|---|---|---|---|---|---|
| Truth or Dare | Social/Party | 2 | 5–15 min | 10 XP | 15 XP | Vulnerability deepens bonds |
| Emoji Challenge | Creative/Puzzle | 2 | 3–8 min | 10 XP | 15 XP | Low barrier, shareable |
| Would You Rather | Opinion/Debate | 2 | 5–10 min | 10 XP | 15 XP | Reveals personality |
| Quick Match | Reaction/Trivia | 2 | 2–5 min | 10 XP | 15 XP | Fast dopamine hit |

**6.2 Truth or Dare — Complete Rules (NEW Win Condition)**

**Win Condition:**
- Each player starts with 0 **Brave Points**
- Per round (5 total):
  - Completing Truth/Dare = +2 Brave Points
  - Opponent votes "Brave" = +1 bonus point
  - Opponent votes "Skipped" = 0 points
- **After 5 rounds:** Highest Brave Points wins
- **Max Brave Points possible:** 15 (5 rounds × 3 points)
- **Tie:** Sudden Death round — 1 final Truth/Dare, both complete it, both vote on who was braver

**Question Decks:**
- **Mild (default):** 200+ light, safe questions
- **Spicy (Level 3+):** 150+ edgy, flirty questions  
- **Deep (Level 5+):** 100+ personal, vulnerable questions

**6.3 Emoji Challenge — Complete Rules**

**Setup:** One player sends 3–5 emojis; other guesses the movie/song/phrase in 30 seconds.

**Scoring:**
- Correct in <10s = 3 points
- Correct in 10–20s = 2 points
- Correct in 20–30s = 1 point
- Incorrect/timeout = 0 points

**Win Condition:** Most points after 5 rounds wins. Ties → Sudden Death (1 bonus emoji, first correct answer wins).

**6.4 Would You Rather — Complete Rules**

**Setup:** Both players shown same question simultaneously, answer privately, reveal at same time.

**Scoring (per question):**
- **Matching answer = 2 pts each** (we think alike!)
- **Different answer = debate round:**
  - Each player has 30s to justify
  - Both vote on whose argument was better
  - Winner gets 3 pts, loser gets 0 pts

**Win Condition:** Most points after 8 questions wins. Tie → 1 tiebreaker question.

**6.5 Quick Match — Complete Rules**

**Setup:** Rapid-fire trivia — pop culture, general knowledge, memes, Pingo meta.

**Mechanics:**
- First to answer correctly earns the point
- Wrong answer = freeze 3s (opponent sees ❌)
- If neither answers in 10s = both get 0 pts
- **15 questions per game**

**Win Condition:** Most points after 15 questions wins.

**6.6 Game Flow State Machine (All Games)**

```
WAITING_FOR_PLAYERS (socket: waiting_for_opponent)
  → Both connected? → COUNTDOWN (3s: 3...2...1...)

COUNTDOWN → ROUND_ACTIVE

ROUND_ACTIVE
  → Gameplay happens (timer running)
  → Responses collected

ROUND_RESULT (2s)
  → Display round result
  → Emit: game:round_complete

[REPEAT × N rounds]

GAME_OVER
  → Final score displayed
  → Winner announced
  → +15 XP (winner), +10 XP (loser)

RESULT_SCREEN (30s)
  → Winner, XP awarded, badges earned
  → CTA: "Rematch?" button
  → Share to story button
  → Back to chat button

REMATCH_PENDING (30s window)
  → If both tap "Rematch?" → auto-create new session
  → Otherwise → archived
```

**6.7 Rematch Flow (NEW - Dramatically Increases Sessions per DAU)**

After result screen, add **"Rematch?" button**. If both players tap within 30s:

```javascript
async function initiateRematch(sessionId) {
  const oldSession = await GameSession.findById(sessionId);
  
  if (rematchVotes >= 2 && rematchVotesAt < 30s_old) {
    const newSession = await GameSession.create({
      gameType: oldSession.gameType,
      player1Id: oldSession.player1Id,
      player2Id: oldSession.player2Id,
      status: 'PENDING'
    });
    
    io.to([player1, player2]).emit('game:rematch_started', {
      sessionId: newSession.id,
      gameType: oldSession.gameType
    });
  }
}
```

**Impact:** Dramatically increases games-per-DAU and session length.

**6.8 Graceful Disconnect Handling**

If opponent disconnects for >60s during active game:

```javascript
setTimeout(async () => {
  if (!player.isConnected) {
    const winner = session.getOtherPlayer(userId);
    await XPService.award(winner, 11, 'game_win_disconnect');
    io.to(winner).emit('game:won_by_disconnect');
  }
}, 60000);
```

Winner gets 75% of win XP (11 XP instead of 15).

**6.9 Game Technical Architecture**

-   Games run over Socket.IO using a dedicated `/game` namespace.
-   Game state held server-side in Redis (TTL = 30 min) for graceful reconnects.
-   Each game session has unique ID; results persisted to PostgreSQL on completion.

---

**SECTION 07 MATCHING & DISCOVERY**

> **7. Matching & Discovery**

Matching is how new connections begin on Pingo. The matching algorithm prioritises Vibe Compatibility (onboarding quiz answers) and mutual engagement signals to surface the most relevant users.

**7.1 Matching Algorithm Signals**

| **Signal** | **Weight** | **Notes** |
|---|---|---|
| Vibe Compatibility Score | 40% | Derived from onboarding quiz overlap |
| Activity Level Match | 20% | Active users match with active users |
| Shared Game Preferences | 15% | Based on game history |
| Geographic Proximity | 10% | Optional; user can disable |
| Mutual Friends | 10% | Friends of friends get a boost |
| Recent Activity Recency | 5% | Penalises inactive accounts |

**7.2 Match Card UI**

-   Swipe right = express interest; swipe left = pass.
-   Match card shows: profile photo, username, Vibe Level badge, top 3 badges, Vibe Compatibility % score.
-   Mutual interest = instant match notification + 50 XP each.
-   Priority match queue (Level 5+ perk): shown first in other users' stacks.

---

**SECTION 08 PUSH NOTIFICATIONS**

> **8. Push Notification Strategy**

Push notifications are the bridge between Pingo and the user's real life. They must be timely, personal, and valuable — never spammy.

**8.1 Notification Types & Triggers**

| **Notification** | **Trigger** | **Time** | **Message Example** |
|---|---|---|---|
| Streak Warning | No action by 20:00 local | 20:00 | Your streak is in danger! 🔥 Log in before midnight |
| Streak Final Warning | No action by 22:30 | 22:30 | Last chance! X-day streak ends in 90 min 😬 |
| New Match | Mutual match event | Immediate | You matched with [name]! Start chatting 💜 |
| New Message | Message received | Immediate | [name]: [first 30 chars] |
| Game Invite | Invite sent via chat | Immediate | [name] wants to play Truth or Dare! 🎮 |
| Quest Ready | Daily midnight reset | 08:00 local | Your daily quests are ready! Earn 175 XP ✨ |
| Leaderboard | Weekly reset | Sunday 20:00 | Top 10 this week! Can you hold your rank? 🏆 |
| Level Up Tease | 85% of next level | Contextual | You're SO close to Vibe Storm! [X] XP away ⚡ |
| Badge Tease | 80% of badge requirement | Contextual | One more win for Truth or Dare Pro badge! 🥇 |
| Weekly Recap | Every Monday | 09:00 local | Your week: [X] XP, [Y] games, [Z]-day streak 🐧 |

**8.2 Notification Frequency Rules**

-   Maximum 3 push notifications per day per user (excluding DMs).
-   Direct messages always delivered (user can opt out per conversation).
-   Users can snooze all non-DM notifications for 24h, 3 days, or 1 week.
-   Never send between 23:00 and 08:00 local time (except streak final warning).

---

**SECTION 09 ADDITIONAL FEATURES (NEW)**

> **9. Additional Features & Growth Mechanics**

**9.1 Quest Streaks (NEW)**

Track consecutive days with at least 1 completed quest — separate from activity streaks.

**Database:**
```sql
ALTER TABLE users ADD COLUMN (
  quest_streak INT DEFAULT 0,
  quest_streak_frozen BOOLEAN DEFAULT FALSE
);
```

**Logic:**
- Increment `quest_streak` when user completes first quest of the day
- Reset to 0 if user misses a full day
- Can use quest streak freeze once/week (separate from activity streaks)
- **"Quest Veteran"** badge at 7-day quest streak

**Cron (midnight UTC):**
```javascript
async function updateQuestStreaks() {
  const lastQuestDay = await getLastQuestCompletionDate(userId);
  const today = getUTCDate();
  
  if (lastQuestDay < today - 1) {
    if (user.quest_streak_frozen) {
      user.quest_streak_frozen = false;
    } else {
      user.quest_streak = 0;
    }
  }
}
```

**9.2 XP Multiplier Events (NEW - "Double XP Weekend")**

2x XP for all actions for 48h — massive engagement spike tool.

**Setup:**
```sql
ALTER TABLE system_config ADD COLUMN (
  xp_multiplier FLOAT DEFAULT 1.0,
  multiplier_active_until TIMESTAMP
);
```

**Trigger:** Friday 18:00 local time
- Push: "🚀 Double XP Weekend Starts Now!"
- Active: Friday 18:00 → Sunday 23:59
- All XP awards doubled: `XPService.award(userId, amount * xp_multiplier)`

**Client-side:** Add XP multiplier badge to activity feed ("2x ✨"), show countdown timer.

**9.3 Hall of Fame Page (NEW - Level 8+ Perk)**

Static page listing top all-time users — aspirational content for long-term retention.

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
    }
  ],
  "yourRank": 47,
  "unlockLevel": 8
}
```

**UI:** Scrollable top 50 all-time users with Vibe Level, total XP, badge count. User's current rank highlighted. Locked until Level 8.

**9.4 Seasonal / Limited-Time Badges (NEW - Creates FOMO)**

- **Pingo OG** — First 90 days only
- **Summer Vibes** (Jun–Aug) — Complete 50 quests
- **Winter Warrior** (Dec–Feb) — Maintain 30-day streak
- **Spring Awakening** (Mar–May) — Win 10 games
- **Autumn Ascent** (Sep–Nov) — Reach Level 7+

---

**SECTION 10 TECHNICAL IMPLEMENTATION**

> **10. Technical Implementation Plan**

**10.1 Data Models (Updated)**

**UserGameification**
```sql
CREATE TABLE user_gamification (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  xp INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  streak_shields INT DEFAULT 0 CHECK (streak_shields <= 3),
  weekly_xp INT DEFAULT 0,
  monthly_xp INT DEFAULT 0,
  quest_streak INT DEFAULT 0,
  quest_streak_frozen BOOLEAN DEFAULT FALSE,
  last_qualifying_action_at TIMESTAMP,
  unlocked_cosmetics JSONB DEFAULT '[]',
  pending_level_up BOOLEAN DEFAULT FALSE
);
```

**Badges & Badge Progress**
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  badge_type VARCHAR(50) UNIQUE,
  title VARCHAR(100),
  category VARCHAR(30),
  rarity_tier VARCHAR(20) DEFAULT 'COMMON'
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
  PRIMARY KEY (user_id, badge_type)
);
```

**DailyQuest**
```sql
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  quest_type VARCHAR(50),
  tier VARCHAR(10),
  progress_current INT DEFAULT 0,
  progress_target INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  xp_reward INT,
  assigned_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**GameSession**
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY,
  game_type VARCHAR(20),
  player1_id UUID REFERENCES users(id),
  player2_id UUID REFERENCES users(id),
  status VARCHAR(20),
  winner_id UUID REFERENCES users(id),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  game_state JSONB,
  xp_awarded_p1 INT DEFAULT 0,
  xp_awarded_p2 INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**10.2 API Endpoints (Complete)**

```
GET  /api/gamification/me
     → XP, level, streak, shields, weekly_rank

GET  /api/quests/daily
     → 3 quests with progress

POST /api/quests/:id/complete
     → Mark complete, award XP

POST /api/quests/:id/skip
     → Skip quest (1x/day)

GET  /api/badges/me
     → All earned + locked with progress

PATCH /api/badges/featured
     → Set 6 featured badges

GET  /api/vibe-journey
     → Full journey with cosmetics

GET  /api/leaderboard/weekly?scope=global|friends|newcomer
     → Top 100 + user position

GET  /api/leaderboard/me
     → User's current rank + stats

GET  /api/hall-of-fame
     → Top 50 all-time users (Level 8+ only)

POST /api/games/invite
     → Create game invite

POST /api/games/:sessionId/result
     → Submit game result, award XP

POST /api/games/:sessionId/rematch
     → Initiate rematch
```

**10.3 Socket.IO Events**

```
xp:awarded → { amount, reason, newXP, newLevel }
level:up → { newLevel, cosmetic, shields }
badge:earned → { badgeId, title, xpBonus }
streak:updated → { days, shields }
quest:completed → { questId, xpReward, bonusXP }
leaderboard:rank → { rank, position, weeklyXP }
leaderboard:reset → { timestamp, topPlayer }
game:ended → { result, xpAwarded, badgeProgress }
rematch:started → { sessionId, gameType }
```

---

**SECTION 11 DELIVERY ROADMAP**

> **11. Delivery Roadmap**

**Phase 1 — Foundation (Weeks 1–3)**

Goal: Ship XP engine, streaks, daily quests. Minimum viable gamification loop.

| **Task** | **Owner** | **Effort** | **Priority** |
|---|---|---|---|
| XP data model + service | Backend | 3 days | P0 |
| Level calculation service | Backend | 1 day | P0 |
| Streak tracking + cron | Backend | 3 days | P0 |
| Streak Shield logic | Backend | 1 day | P0 |
| Daily Quest assignment + progress | Backend | 4 days | P0 |
| XP sources integration | Backend | 3 days | P0 |
| XP + streak UI components | Frontend | 3 days | P0 |
| Daily Quest cards UI | Frontend | 3 days | P0 |
| Push notifications: streak warnings | Backend | 2 days | P0 |

**Phase 2 — Identity & Competition (Weeks 4–6)**

Goal: Ship badges, Vibe Journey, leaderboard.

| **Task** | **Owner** | **Effort** | **Priority** |
|---|---|---|---|
| Badge data model + 24-badge engine | Backend | 4 days | P0 |
| Badge unlock triggers | Backend | 3 days | P0 |
| Badge profile display | Frontend | 3 days | P0 |
| Vibe Journey page (full road UI) | Frontend | 4 days | P0 |
| Level cosmetics system | Frontend | 4 days | P1 |
| Weekly leaderboard (global + friends) | Backend | 3 days | P0 |
| Leaderboard UI + rank display | Frontend | 2 days | P0 |
| Weekly cron: reset + prizes | Backend | 2 days | P0 |
| Quest Streaks implementation | Backend | 2 days | P1 |

**Phase 3 — Games (Weeks 7–10)**

Goal: Ship all 4 games + in-chat invites.

| **Task** | **Owner** | **Effort** | **Priority** |
|---|---|---|---|
| Game session model + Redis | Backend | 3 days | P0 |
| Socket.IO /game namespace | Backend | 4 days | P0 |
| GameInvite model + endpoints | Backend | 2 days | P0 |
| In-chat invite card component | Frontend | 3 days | P0 |
| Truth or Dare: full implementation | Full-stack | 5 days | P0 |
| Emoji Challenge: full implementation | Full-stack | 4 days | P0 |
| Would You Rather: full implementation | Full-stack | 4 days | P0 |
| Quick Match: full implementation | Full-stack | 5 days | P0 |
| Rematch flow | Full-stack | 2 days | P0 |
| Graceful disconnect handling | Backend | 2 days | P1 |

**Phase 4 — Polish & Growth (Weeks 11–14)**

Goal: Notifications, analytics, XP multipliers, Hall of Fame, seasonal badges.

| **Task** | **Owner** | **Effort** | **Priority** |
|---|---|---|---|
| Full push notification suite | Backend | 4 days | P0 |
| XP multiplier events setup | Backend | 2 days | P1 |
| Hall of Fame page | Full-stack | 2 days | P1 |
| Seasonal badges system | Backend | 2 days | P1 |
| Newcomer Leaderboard | Backend | 2 days | P1 |
| Admin analytics dashboard | Full-stack | 4 days | P1 |
| Performance optimization | Backend | 3 days | P0 |
| A/B testing framework | Backend | 2 days | P2 |

---

**SECTION 12 SUCCESS METRICS**

> **12. Success Metrics**

Track weekly in admin dashboard.

| **Metric** | **Target (Month 1)** | **Target (Month 2)** | **Health Threshold** |
|---|---|---|---|
| Daily Active Users | 5K | 15K | >70% of registered |
| 7-Day Retention | 45% | 55% | >50% |
| Avg Session Length | 8 min | 12 min | >6 min |
| XP per DAU | 150 | 250 | >100 |
| Quests/Day | 1.8 | 2.5 | >1.5 |
| Games Played/DAU | 0.6 | 1.2 | >0.8 |
| Badge Earn Rate | 2.5/user | 5+/user | Growing |
| Streak Maintenance | 30% of users | 50% of users | >25% |
| Leaderboard Engagement | 40% weekly | 70% weekly | >30% |

---

**SECTION A APPENDIX**

> **Appendix A — XP Quick Reference**

| **Trigger Event** | **Service** | **XP Amount** | **Cap** |
|---|---|---|---|
| Send message | ChatService | 2 XP | 40/day |
| Receive reply | ChatService | 3 XP | 30/day |
| Complete easy quest | QuestService | 25 XP | None |
| Complete medium quest | QuestService | 50 XP | None |
| Complete hard quest | QuestService | 100 XP | None |
| Play any game | GameService | 10 XP | 50/day |
| Win a game | GameService | 15 XP | 60/day |
| Send game invite | GameService | 5 XP | 25/day |
| Accept game invite | GameService | 5 XP | 25/day |
| Streak maintained (midnight) | StreakService | 20 XP | None |
| Streak milestone | StreakService | 50–5000 XP | None |
| Badge earned | BadgeService | 50 XP | None |
| Match with user | MatchingService | 15 XP | 60/day |
| Daily login | AuthService | 10 XP | 10/day |
| Onboarding complete | OnboardingService | 200 XP | One-time |
| Friend joins via invite | ReferralService | 100 XP | None |

> **Appendix B — Badge Trigger Checklist**

Engineering team — ensure all badge triggers are implemented:

- [ ] StreakService fires badge checks on daily cron
- [ ] GameService fires badge checks on game end
- [ ] ChatService fires badge checks (Conversation Starter at 50 msgs)
- [ ] MatchingService fires badge checks (Match Maker at 10 matches)
- [ ] QuestService fires badge checks (50 quests, quest streaks)
- [ ] LeaderboardService fires badge checks (weekly champ)
- [ ] AuthService tracks time-of-day for Night Owl / Early Bird
- [ ] ReferralService fires badge checks on successful join
- [ ] All badge awards emit socket event
- [ ] BadgeProgress table updated atomically
- [ ] 50 XP awarded on badge earn
- [ ] Push notification sent if app in background

> **Appendix C — XP Award Command Reference**

Always use this method — never directly UPDATE xp:

```javascript
await XPService.award(userId, amount, reason);

// Reasons: message_sent, message_received, game_play, game_win, 
// quest_completed, match_made, daily_login, streak_maintained, 
// weekly_champion_bonus, badge_earned, referral_bonus, etc.
```

---

*End of Document — Pingo Feature Implementation Plan v1.1 (Full Integration)*

*This document integrates all v1.0 core features with enhanced v1.1 additions:*
*- Enhanced Badge System with trigger logic & rarity tiers*
*- Server-side Vibe Journey validation (anti-exploit)*
*- Complete Leaderboard implementation with SQL & crons*
*- Game win conditions, state machines & rematch flows*
*- Additional features: Quest Streaks, XP Multipliers, Hall of Fame, Seasonal Badges*
