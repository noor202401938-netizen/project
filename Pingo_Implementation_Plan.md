**🐧 PINGO**

Feature Implementation Plan

*Building a Habit-Forming Social Platform for Gen-Z*

Version 1.0 \| 2025 \| For Engineering & Product Teams

**SECTION 00 EXECUTIVE SUMMARY**

> **Executive Summary**

Pingo is a Gen-Z social platform engineered for high retention and daily
engagement. Inspired by the addictive loop mechanics of Duolingo, Pingo
wraps social connection --- matching, chat, and shared games --- inside
a gamification engine that rewards users every single day they open the
app.

The core thesis is simple: make socialising feel like progress. Every
interaction earns XP. Every day builds a streak. Every milestone unlocks
a badge or levels up the user\'s Vibe Journey. The result is a platform
users return to not just to chat, but to grow their digital identity.

> **🎯 North Star Metric:** Daily Active Users maintaining a 7-day
> streak.

**Design Pillars**

-   Habit Loop --- trigger, action, reward on every session

-   Social Accountability --- streaks and leaderboards create gentle
    peer pressure

-   Identity Building --- Vibe Journey levels give users a profile they
    are proud of

-   Play First --- games are first-class citizens, not an afterthought

-   Progressive Depth --- casual users can lurk; power users have deep
    systems to master

**SECTION 01 GAMIFICATION ENGINE**

> **1. Gamification Engine**

The gamification engine is the heartbeat of Pingo. Every other feature
feeds into or draws from it. It is composed of four tightly coupled
sub-systems: XP & Levelling, Streaks, Daily Quests, and Badges.

**1.1 XP & Levelling**

XP (Experience Points) is the universal currency of engagement. It is
earned through virtually every action on the platform and is never lost.
The XP system must feel generous at low levels to hook new users and
progressively more challenging to retain veterans.

**XP Sources**

  ------------------------------------------------------------------------
  **Action**             **XP          **Daily Cap** **Notes**
                         Awarded**                   
  ---------------------- ------------- ------------- ---------------------
  Send a chat message    2 XP          40 XP         Caps after 20
                                                     messages/day

  Receive a reply        3 XP          30 XP         Rewards quality
                                                     conversation

  Complete a Daily Quest 25--100 XP    No cap        Scales with quest
                                                     difficulty

  Play a mini-game       10 XP         50 XP         Win bonus: +15 XP

  Win a game             15 XP         60 XP         Stacks with play XP

  Send a game invite     5 XP          25 XP         Encourages social
                                                     gaming

  Accept a game invite   5 XP          25 XP         Both sides rewarded

  Maintain a streak      20 XP         No cap        Awarded at midnight

  Complete onboarding    200 XP        One-time      Strong first-session
                                                     hook

  Earn a badge           50 XP         ---           One-time per badge

  Match with someone     15 XP         60 XP         First match of day is
                                                     double

  Log in (daily)         10 XP         10 XP         Bare minimum
                                                     engagement reward

  Profile view received  1 XP          10 XP         Passive social proof
                                                     reward

  Send a friend invite   20 XP         40 XP         Viral growth mechanic

  Friend joins via       100 XP        ---           Referral bonus
  invite                                             
  ------------------------------------------------------------------------

**Level Thresholds**

Levels are branded as Vibe Levels (see Section 3). The XP curve follows
a modified square root progression so early levels feel fast and
satisfying while later levels provide a genuine long-term goal.

  -----------------------------------------------------------------------------
  **Level**   **Vibe        **Total XP      **XP to Next    **Unlock**
              Title**       Required**      Level**         
  ----------- ------------- --------------- --------------- -------------------
  1           Vibe Seedling 0               200             Base features

  2           Vibe Spark    200             350             Custom profile
                                                            border

  3           Vibe Pulse    550             550             Animated avatar
                                                            frame

  4           Vibe Wave     1,100           800             Exclusive chat
                                                            theme

  5           Vibe Glow     1,900           1,100           Priority matching
                                                            queue

  6           Vibe Current  3,000           1,500           Beta game access

  7           Vibe Storm    4,500           2,000           Custom status emoji

  8           Vibe Nova     6,500           2,600           Leaderboard Hall of
                                                            Fame

  9           Vibe Legend   9,100           3,400           Exclusive Legend
                                                            badge

  10          Vibe Infinite 12,500          ---             Infinite badge +
                                                            dev AMA access
  -----------------------------------------------------------------------------

> **⚡ Implementation Note:** Store cumulative XP as a single integer;
> derive level client-side from a lookup table. Never subtract XP ---
> use separate \'streak shields\' for forgiveness mechanics.

**1.2 Streak System**

Streaks are the most powerful retention tool in Pingo\'s arsenal. A
streak increments when a user completes at least one qualifying action
each calendar day. Missing a day breaks the streak --- unless a Streak
Shield is used.

**Streak Rules**

-   A streak day is defined by the user\'s local timezone midnight
    boundary.

-   Qualifying actions: sending a message, playing a game, completing a
    quest, or matching.

-   A push notification fires at 20:00 local time if no qualifying
    action has been taken that day.

-   A second notification fires at 22:30 as a final reminder.

-   Streak milestones: 3, 7, 14, 30, 60, 100, 365 days --- each grants
    bonus XP and a milestone badge.

**Streak Shield (Forgiveness Mechanic)**

Streak Shields prevent a streak from breaking when a user misses a day.
They are modelled on Duolingo\'s streak freeze. Shields are earned (not
purchased) to keep the app free-to-play fair.

  ------------------------------------------------------------------------
  **Shield Source**     **Shields       **Max      **Notes**
                        Awarded**       Held**     
  --------------------- --------------- ---------- -----------------------
  Reach 7-day streak    1 shield        3          Auto-granted

  Complete 5 quests in  1 shield        3          Weekly cadence
  a week                                           

  Level up              1 shield        3          Celebration reward

  Win 3 games in one    1 shield        3          Gameplay incentive
  day                                              

  Refer a friend who    2 shields       3          Viral growth reward
  joins                                            
  ------------------------------------------------------------------------

> **🛡️ UX Note:** Show shield count prominently on the streak display.
> When a shield is consumed, show a satisfying animation and a message
> like \'Your Streak Shield saved you!\'

**1.3 Daily Quests**

Daily Quests are Pingo\'s primary engagement driver. They reset at
midnight and ensure users have a clear, achievable goal every time they
open the app. Quest design follows three tiers to cater to both casual
and power users.

**Quest Tier Design**

  ---------------------------------------------------------------------------------
  **Tier**   **Difficulty**   **XP      **Time to       **Example Quests**
                              Range**   Complete**      
  ---------- ---------------- --------- --------------- ---------------------------
  Easy       Low              25 XP     2--5 min        Send 3 messages, Log in
                                                        today, View 2 profiles

  Medium     Moderate         50 XP     10--20 min      Play a game, Match with
                                                        someone, Complete 2 easy
                                                        quests

  Hard       Challenging      100 XP    20--40 min      Win 2 games, Chat for 15
                                                        min, Earn a badge today
  ---------------------------------------------------------------------------------

**Daily Quest Pool (Sample)**

-   Send your first message of the day

-   Play any mini-game

-   Win a game of Truth or Dare

-   Match with 2 new people

-   Keep your streak alive

-   Invite a friend to a game

-   React to 3 messages in chat

-   Complete your Vibe Check (daily mood status update)

-   View the leaderboard

-   Send a game invite from inside a chat

**Quest Refresh & Display Rules**

-   Each user receives 3 quests daily: 1 Easy, 1 Medium, 1 Hard ---
    randomly drawn from the pool.

-   Users may skip one quest per day (24h cooldown) --- replaced with
    another of the same tier.

-   All 3 completed = bonus XP of 50 + a streak day counts
    automatically.

-   Quest progress persists through app restarts; store progress
    server-side.

-   Show a progress bar on each quest card (e.g., \'Send messages:
    2/3\').

**SECTION 02 BADGES & ACHIEVEMENTS**

> **2. Badges & Achievements**

Badges are permanent achievements displayed on a user\'s profile. They
serve as social proof, conversation starters, and long-term engagement
targets. Unlike XP, badges tell the story of who a user is on Pingo.

**2.1 Badge Categories**

  -------------------------------------------------------------------------
  **Category**    **Theme**       **Example Badges**         **Total
                                                             Count**
  --------------- --------------- -------------------------- --------------
  Streak Badges   Loyalty /       3-Day Spark, 7-Day Flame,  8
                  Consistency     30-Day Inferno, 365-Day    
                                  Legend                     

  Game Badges     Skill /         First Win, 10 Wins, Truth  12
                  Competition     or Dare Pro, Quick Match   
                                  Champ                      

  Social Badges   Connection /    Conversation Starter,      10
                  Warmth          Match Maker, Invite        
                                  King/Queen                 

  Quest Badges    Dedication      Quest Rookie, Quest        6
                                  Veteran, 7-Day Quest       
                                  Streak                     

  Vibe Journey    Identity /      One per Vibe Level         10
                  Progression     (auto-awarded)             

  Special /       Discovery       Night Owl, Early Bird,     8
  Hidden                          Secret Handshake           
  -------------------------------------------------------------------------

**2.2 Badge Display Rules**

-   Profile shows up to 6 featured badges (user-chosen); rest in \'All
    Badges\' drawer.

-   New badge earned: full-screen celebration animation with
    share-to-story CTA.

-   Locked badges show silhouette + hint text to drive aspiration.

-   Rare / hidden badges show as \'???\' until earned --- no hint text.

> **🏆 Gamification Principle:** Always show users what they are close
> to earning. A progress bar toward the next badge is more motivating
> than a list of distant targets.

**SECTION 03 VIBE JOURNEY**

> **3. Vibe Journey**

The Vibe Journey is Pingo\'s primary identity system. It is the user\'s
\'character\' --- a visual, evolving representation of their time and
activity on the platform. It replaces a bland \'level X\' with a named,
themed progression that users genuinely care about.

**3.1 Core Concept**

-   10 Vibe Levels, each with a unique title, colour palette, and
    unlockable cosmetic.

-   Progress is driven exclusively by XP --- no special requirements
    beyond engagement.

-   A dedicated \'Vibe Journey\' page shows the full path, current
    position, and upcoming rewards.

-   The current Vibe Level appears on the profile card, next to matching
    cards, and in chat headers.

**3.2 Level Cosmetics & Rewards**

  -------------------------------------------------------------------------------
  **Level**   **Title**   **Profile    **Avatar    **Chat Theme   **Special
                          Border**     Frame**     Color**        Perk**
  ----------- ----------- ------------ ----------- -------------- ---------------
  1           Vibe        Simple white ---         Default purple ---
              Seedling    ring                                    

  2           Vibe Spark  Glowing      Spark       Warm amber     Custom bio
                          yellow ring  particles                  emoji

  3           Vibe Pulse  Pulsing pink Heartbeat   Neon pink      ---
                          ring         wave                       

  4           Vibe Wave   Ocean        Wave        Ocean teal     Unlock \'Wave\'
                          gradient     animation                  reaction
                          ring                                    

  5           Vibe Glow   Aurora ring  Glow halo   Aurora green   Priority match
                                                                  queue

  6           Vibe        Electric     Lightning   Electric blue  Beta game early
              Current     ring         frame                      access

  7           Vibe Storm  Storm swirl  Thunder     Dark stormy    Custom status
                          ring         bolts       grey           emoji

  8           Vibe Nova   Supernova    Nova        Deep space     Hall of Fame
                          burst ring   explosion   indigo         listing

  9           Vibe Legend Golden halo  Legend      Royal gold     Exclusive
                          ring         crown                      Legend badge

  10          Vibe        Infinite     Cosmic      Cosmic         Dev AMA access
              Infinite    loop ring    portal      black/gold     
  -------------------------------------------------------------------------------

**3.3 Vibe Journey UI Spec**

-   Full-page vertical scroll showing all 10 levels as a \'road\'.

-   Completed levels: solid fill with checkmark; current: animated
    pulse; future: greyed out.

-   Each level node is tappable --- shows title, XP threshold,
    cosmetics, and perks.

-   Progress bar between nodes shows % completion to next level.

-   Animated confetti on level-up with share sheet (\'I just hit Vibe
    Storm on Pingo!\').

**SECTION 04 LEADERBOARD**

> **4. Leaderboard**

The Leaderboard creates healthy competition and gives users a reason to
maximise their XP each week. It is scoped to prevent top players from
permanently dominating and discouraging new users.

**4.1 Leaderboard Scopes**

  --------------------------------------------------------------------------------
  **Scope**       **Reset          **Metric**    **Prize /        **Visibility**
                  Cadence**                      Reward**         
  --------------- ---------------- ------------- ---------------- ----------------
  Weekly Global   Every Monday     XP earned     500 XP + Weekly  All users
                  00:00 UTC        this week     Champ badge      

  Weekly Friends  Every Monday     XP earned     Bragging         Friends only
                  00:00 UTC        this week     rights + 100 XP  

  Monthly Global  1st of each      XP earned     1000 XP +        All users
                  month            this month    Monthly Legend   
                                                 badge            

  All-Time Global Never resets     Cumulative XP Hall of Fame at  All users
                                                 Level 8+         

  Game-Specific   Weekly           Wins per game Game Champion    All users
                                   type          badge            
  --------------------------------------------------------------------------------

**4.2 Anti-Discouragement Design**

-   New users always see their rank relative to peers who joined within
    the same 30-day window (\'Newcomer League\') for the first month.

-   Show \'Your Best Rank This Month\' on the profile even after the
    leaderboard resets.

-   Top 10% gets a gold border on their rank number; top 50% gets
    silver. Everyone else is encouraged with \'You\'re in the top X%\'
    language.

-   A \'Friends Leaderboard\' is the default view --- friends are a
    manageable, motivating pool.

**SECTION 05 CHAT SYSTEM**

> **5. Chat System**

Chat is the core social fabric of Pingo. It is built on Socket.IO for
real-time delivery and is deeply integrated with the gamification
engine. Every conversation is an opportunity to earn XP, launch a game,
and deepen a connection.

**5.1 Chat Feature Matrix**

  -------------------------------------------------------------------------------
  **Feature**              **Priority**   **XP            **Notes**
                                          Integration**   
  ------------------------ -------------- --------------- -----------------------
  1:1 Real-time messaging  P0             2 XP/message    Core feature --- must
                                          (cap 40)        be rock solid

  Message reactions        P0             1 XP/reaction   Long press to react
  (emoji)                                 given           

  Read receipts            P0             ---             Single tick sent,
                                                          double tick read

  Typing indicator         P1             ---             Animated dots

  Image / GIF sharing      P1             3 XP/media sent GIPHY integration
                                                          recommended

  Voice messages           P2             5 XP/voice sent Max 60 seconds

  Message replies (thread) P1             ---             Swipe right to reply

  Chat themes (unlockable) P1             ---             Tied to Vibe Level
                                                          unlocks

  In-chat game invite      P0             5 XP/invite     See Section 6
                                          sent            

  Message search           P2             ---             Local search first

  Chat archiving           P2             ---             Swipe left action

  Block / Report in chat   P0             ---             Safety critical
  -------------------------------------------------------------------------------

**5.2 In-Chat Game Invite**

The in-chat game invite is a key viral loop. When a user sends a game
invite from inside a chat, it creates a shared moment that strengthens
the social bond and earns XP for both parties.

**Invite Flow**

1.  User taps the \'+\' button in the chat input bar.

2.  A bottom sheet slides up showing available games with player counts.

3.  User selects a game. An invite card is sent as a chat message.

4.  Recipient sees the invite card with game name, sender\'s Vibe Level,
    and \'Accept / Decline\' buttons.

5.  On accept: both users are navigated to the game lobby. XP is awarded
    to both.

6.  On decline: a polite decline message is sent automatically (\'Maybe
    later! 👋\').

7.  Invite expires after 5 minutes if not responded to.

> **🎮 Design Note:** The invite card should feel premium --- show the
> game\'s cover art, an animated shimmer border, and a countdown timer
> for urgency.

**SECTION 06 GAMES**

> **6. Mini-Games**

Games are Pingo\'s secret weapon for retention. They transform passive
scrolling into active play, create shared memories between users, and
generate XP for both parties. The four launch games were chosen to cover
a spectrum of moods and social dynamics.

**6.1 Game Overview**

  ----------------------------------------------------------------------------------------
  **Game**     **Type**   **Players**   **Avg       **XP       **XP      **Engagement
                                        Session**   (Play)**   (Win)**   Hook**
  ------------ ---------- ------------- ----------- ---------- --------- -----------------
  Truth or     Social /   2             5--15 min   10 XP      15 XP     Vulnerability +
  Dare         Party                                                     humour deepen
                                                                         bonds

  Emoji        Creative / 2             3--8 min    10 XP      15 XP     Low barrier,
  Challenge    Puzzle                                                    highly shareable

  Would You    Opinion /  2             5--10 min   10 XP      15 XP     Reveals
  Rather       Debate                                                    personality
                                                                         quickly

  Quick Match  Reaction / 2             2--5 min    10 XP      15 XP     Fast dopamine
               Trivia                                                    hit, highly
                                                                         replayable
  ----------------------------------------------------------------------------------------

**6.2 Game Design Specs**

**Truth or Dare**

-   Questions are drawn from a curated, age-appropriate deck (150+
    questions at launch).

-   Decks: Mild (default), Spicy (unlocked at Level 3), Deep (unlocked
    at Level 5).

-   Player chooses Truth or Dare per round; 5 rounds per game.

-   Dare requires photo/video proof (optional, user consent required).

-   Voting: after each answer, both players rate \'Brave\' or
    \'Skipped\' --- skipped = no XP for that round.

**Emoji Challenge**

-   One player sends an emoji combination (3--5 emojis); other player
    guesses the movie/song/phrase.

-   30-second answer timer per round; 5 rounds per game.

-   Point scoring: correct in \<10s = 3pts, 10--20s = 2pts, 20--30s =
    1pt.

-   Most points after 5 rounds wins; ties go to sudden death round.

**Would You Rather**

-   Both players are shown the same \'Would you rather A or B?\'
    question simultaneously.

-   They answer privately, then both answers are revealed at the same
    time.

-   Matching answer = 2 pts each; different answers = debate round (30s
    timer for justification).

-   8 questions per game; most points wins.

**Quick Match**

-   Rapid-fire trivia / reaction game. Questions from pop culture,
    general knowledge, memes.

-   First to answer correctly earns the point; wrong answer freezes that
    player for 3s.

-   15 questions per game; each question has a 10-second window.

-   Leaderboard contribution: Quick Match has its own game-specific
    weekly leaderboard.

**6.3 Game Technical Architecture**

-   Games run over the existing Socket.IO connection using a dedicated
    /game namespace.

-   Game state is held server-side in Redis (TTL = 30 min) to handle
    reconnects gracefully.

-   Each game session has a unique session ID; results are persisted to
    PostgreSQL on completion.

-   Graceful disconnect: if opponent disconnects for \>60s, the
    remaining player wins by default and earns 75% of win XP.

**SECTION 07 MATCHING & DISCOVERY**

> **7. Matching & Discovery**

Matching is how new connections begin on Pingo. The matching algorithm
prioritises Vibe Compatibility (onboarding quiz answers) and mutual
engagement signals to surface the most relevant users.

**7.1 Matching Algorithm Signals**

  ------------------------------------------------------------------------
  **Signal**             **Weight**   **Notes**
  ---------------------- ------------ ------------------------------------
  Vibe Compatibility     40%          Derived from onboarding quiz overlap
  Score                               

  Activity Level Match   20%          Active users match with active users

  Shared Game            15%          Based on game history
  Preferences                         

  Geographic Proximity   10%          Optional; user can disable

  Mutual Friends         10%          Friends of friends get a boost

  Recent Activity        5%           Penalises inactive accounts
  Recency                             
  ------------------------------------------------------------------------

**7.2 Match Card UI**

-   Swipe right = express interest; swipe left = pass.

-   Match card shows: profile photo, username, Vibe Level badge, top 3
    badges, and a Vibe Compatibility % score.

-   Mutual interest = instant match notification + 50 XP each.

-   Priority match queue (Level 5+ perk): shown first in other users\'
    stacks.

**SECTION 08 PUSH NOTIFICATIONS**

> **8. Push Notification Strategy**

Push notifications are the bridge between Pingo and the user\'s real
life. They must be timely, personal, and valuable --- never spammy. The
goal is to re-engage without annoying.

**8.1 Notification Types & Triggers**

  -----------------------------------------------------------------------------
  **Notification**   **Trigger**        **Time**     **Message Copy (Example)**
  ------------------ ------------------ ------------ --------------------------
  Streak Warning     No qualifying      20:00        Your streak is in danger!
                     action by 20:00                 🔥 Log in before midnight
                     local                           

  Streak Final       Still no action by 22:30        Last chance! Your X-day
  Warning            22:30                           streak ends in 90 minutes
                                                     😬

  New Match          Mutual match event Immediate    You matched with \[name\]!
                                                     Start chatting 💜

  New Message        Message received,  Immediate    \[name\]: \[first 30 chars
                     app in background               of message\]

  Game Invite        Invite sent via    Immediate    \[name\] wants to play
                     chat                            Truth or Dare with you! 🎮

  Quest Ready        Daily midnight     08:00 local  Your daily quests are
                     reset                           ready! Earn up to 175 XP
                                                     today ✨

  Leaderboard        Weekly reset       Sunday 20:00 Top 10 this week! Can you
                     approaching                     hold your rank? 🏆

  Level Up Tease     User at 85% of     Contextual   You\'re SO close to Vibe
                     next level XP                   Storm! Just \[X\] XP away
                                                     ⚡

  Badge Tease        User at 80% of     Contextual   One more win for your
                     badge requirement               Truth or Dare Pro badge!
                                                     🥇

  Weekly Recap       Every Monday 09:00 Monday 09:00 Your week: \[X\] XP, \[Y\]
                     local                           games, \[Z\]-day streak 🐧
  -----------------------------------------------------------------------------

**8.2 Notification Frequency Rules**

-   Maximum 3 push notifications per day per user (excluding direct
    message notifications).

-   Direct messages are always delivered (user can opt out per
    conversation).

-   Users can snooze all non-DM notifications for 24h, 3 days, or 1 week
    from the settings screen.

-   Never send a notification between 23:00 and 08:00 local time (except
    streak final warning if streak is at risk).

**SECTION 09 TECHNICAL IMPLEMENTATION**

> **9. Technical Implementation Plan**

**9.1 Data Models (New / Extended)**

**UserGameification (extends User)**

-   xp: Int (cumulative, never decremented)

-   level: Int (derived field; recompute on XP change)

-   streakDays: Int

-   streakShields: Int (max 3)

-   lastQualifyingActionAt: DateTime

-   weeklyXP: Int (reset Mondays by cron)

-   monthlyXP: Int (reset 1st by cron)

**DailyQuest**

-   id, userId, questType, tier (EASY/MEDIUM/HARD)

-   progressCurrent: Int, progressTarget: Int

-   completed: Boolean, completedAt: DateTime

-   xpReward: Int, assignedDate: Date

**Badge**

-   id, userId, badgeType (enum), earnedAt: DateTime

-   featured: Boolean (up to 6 per user)

**GameSession**

-   id, gameType (enum), player1Id, player2Id

-   status (PENDING/ACTIVE/COMPLETE/ABANDONED)

-   winnerId, startedAt, endedAt

-   gameState: Json (Redis-backed during active session, persisted on
    end)

**GameInvite**

-   id, senderId, receiverId, chatId, gameType

-   status (PENDING/ACCEPTED/DECLINED/EXPIRED)

-   createdAt, expiresAt (createdAt + 5 minutes)

**9.2 API Endpoints (New)**

  ------------------------------------------------------------------------------------
  **Method**   **Endpoint**                    **Description**
  ------------ ------------------------------- ---------------------------------------
  GET          /api/gamification/me            Returns XP, level, streak, shields,
                                               weekly rank

  GET          /api/quests/daily               Returns today\'s 3 quests with progress

  POST         /api/quests/:id/skip            Skip quest (once per day)

  GET          /api/badges/me                  All earned badges + locked with
                                               progress

  PATCH        /api/badges/featured            Set featured badges (array of up to 6
                                               IDs)

  GET          /api/leaderboard/weekly         Top 100 weekly global + user\'s rank

  GET          /api/leaderboard/friends        Friends leaderboard

  GET          /api/games                      Available games with player counts

  POST         /api/games/invite               Send game invite (creates GameInvite)

  POST         /api/games/invite/:id/respond   Accept or decline invite

  GET          /api/games/session/:id          Game session state

  POST         /api/games/session/:id/action   Submit game action

  GET          /api/vibe-journey               Full journey with all levels + user
                                               progress
  ------------------------------------------------------------------------------------

**9.3 Socket.IO Events (New)**

  ---------------------------------------------------------------------------------
  **Event**              **Direction**   **Payload**           **Description**
  ---------------------- --------------- --------------------- --------------------
  xp:awarded             Server → Client { amount, reason,     Real-time XP
                                         totalXP, newLevel }   notification

  streak:updated         Server → Client { days, shieldUsed }  Streak change
                                                               notification

  quest:progress         Server → Client { questId, current,   Quest progress
                                         target, completed }   update

  badge:earned           Server → Client { badgeType, xpBonus  Badge award trigger
                                         }                     

  game:invite            Server → Client { inviteId, senderId, Incoming game invite
                                         gameType }            

  game:invite:response   Server → Client { inviteId, accepted  Invite response
                                         }                     

  game:state             Server → Client { sessionId, state }  Game state update

  game:action            Client → Server { sessionId, action,  Player submits
                                         data }                action

  game:end               Server → Client { winnerId, xpAwarded Game over
                                         }                     notification

  leaderboard:rank       Server → Client { weeklyRank,         Rank change push
                                         friendsRank }         
  ---------------------------------------------------------------------------------

**SECTION 10 DELIVERY ROADMAP**

> **10. Delivery Roadmap**

**Phase 1 --- Foundation (Weeks 1--3)**

Goal: Ship the XP engine, streaks, and daily quests. This is the minimum
viable gamification loop.

  ---------------------------------------------------------------------------
  **Task**                          **Owner**     **Effort**   **Priority**
  --------------------------------- ------------- ------------ --------------
  XP data model + service (award,   Backend       3 days       P0
  cap, persist)                                                

  Level calculation service +       Backend       1 day        P0
  lookup table                                                 

  Streak tracking service + cron    Backend       3 days       P0
  jobs                                                         

  Streak Shield logic               Backend       1 day        P0

  Daily Quest assignment (cron) +   Backend       4 days       P0
  progress tracking                                            

  Quest skip endpoint               Backend       0.5 days     P1

  XP sources integration (messages, Backend       3 days       P0
  matches, login)                                              

  XP + streak UI components         Frontend      3 days       P0
  (profile, home screen)                                       

  Daily Quest cards UI with         Frontend      3 days       P0
  progress bars                                                

  Push notification: streak warning Backend       2 days       P0
  (20:00 + 22:30)                                              
  ---------------------------------------------------------------------------

**Phase 2 --- Identity & Competition (Weeks 4--6)**

Goal: Ship badges, Vibe Journey, and leaderboard. Give users a profile
worth showing off.

  ---------------------------------------------------------------------------
  **Task**                          **Owner**     **Effort**   **Priority**
  --------------------------------- ------------- ------------ --------------
  Badge data model + 54-badge award Backend       4 days       P0
  engine                                                       

  Badge unlock triggers (streak,    Backend       3 days       P0
  game, quest, level)                                          

  Badge profile display + featured  Frontend      3 days       P0
  badge picker                                                 

  Badge earn celebration animation  Frontend      2 days       P1

  Vibe Journey page (full level     Frontend      4 days       P0
  road UI)                                                     

  Level cosmetics system (borders,  Frontend      4 days       P1
  frames, themes)                                              

  Weekly XP leaderboard (global +   Backend       3 days       P0
  friends)                                                     

  Leaderboard UI with rank display  Frontend      2 days       P0

  Weekly cron: reset weeklyXP +     Backend       2 days       P0
  award leaderboard prizes                                     
  ---------------------------------------------------------------------------

**Phase 3 --- Games (Weeks 7--10)**

Goal: Ship all four mini-games and the in-chat invite system. This is
the platform\'s biggest differentiator.

  ---------------------------------------------------------------------------
  **Task**                          **Owner**     **Effort**   **Priority**
  --------------------------------- ------------- ------------ --------------
  Game session model + Redis state  Backend       3 days       P0
  management                                                   

  Socket.IO /game namespace +       Backend       4 days       P0
  action handling                                              

  GameInvite model + invite/respond Backend       2 days       P0
  endpoints                                                    

  In-chat invite card component +   Frontend      3 days       P0
  bottom sheet                                                 

  Truth or Dare: question deck +    Full-stack    5 days       P0
  game loop                                                    

  Emoji Challenge: game logic +     Full-stack    4 days       P0
  timer                                                        

  Would You Rather: simultaneous    Full-stack    4 days       P0
  reveal logic                                                 

  Quick Match: trivia question      Full-stack    5 days       P0
  bank + scoring                                               

  Game results screen + XP award    Frontend      2 days       P0
  animation                                                    

  Game-specific leaderboard (Quick  Backend       2 days       P1
  Match)                                                       

  Graceful disconnect handling      Backend       2 days       P1
  ---------------------------------------------------------------------------

**Phase 4 --- Polish & Retention (Weeks 11--13)**

Goal: Full notification strategy, analytics, onboarding improvements,
and performance optimisation.

  ---------------------------------------------------------------------------
  **Task**                          **Owner**     **Effort**   **Priority**
  --------------------------------- ------------- ------------ --------------
  Full push notification suite (all Backend       4 days       P0
  10 types)                                                    

  Notification preference centre    Full-stack    3 days       P1
  (UI + backend)                                               

  Weekly recap notification         Backend       2 days       P1

  Level-up confetti + share sheet   Frontend      2 days       P1

  Newcomer Leaderboard (first 30    Backend       2 days       P1
  days)                                                        

  Admin analytics: DAU, streak      Backend       3 days       P1
  rates, quest completion                                      

  Admin dashboard: game play        Frontend      3 days       P1
  counts + XP distribution                                     

  Performance: XP/streak endpoints  Backend       3 days       P0
  \<100ms P95                                                  

  A/B test: quest difficulty vs     Backend       2 days       P2
  completion rate                                              
  ---------------------------------------------------------------------------

**SECTION 11 SUCCESS METRICS**

> **11. Success Metrics**

These KPIs define success for the gamification and engagement systems.
They should be tracked weekly in the admin dashboard and reviewed at
each sprint retrospective.

  ------------------------------------------------------------------------
  **Metric**            **Target (Month  **Measurement Method**
                        3)**             
  --------------------- ---------------- ---------------------------------
  Day 1 Retention       \> 60%           Cohort analysis: users who return
                                         the day after signup

  Day 7 Retention       \> 35%           Cohort analysis: users who return
                                         on Day 7

  Day 30 Retention      \> 20%           Cohort analysis

  7-Day Streak Rate     \> 25% of DAU    \% of daily active users with
                                         streak \>= 7

  Daily Quest           \> 50% of DAU    \% of DAU completing at least 1
  Completion Rate                        quest

  Game Session per DAU  \> 1.5           Total game sessions / DAU
                        sessions/day     

  In-Chat Game Invite   \> 30% of chats  \% of active chats containing \>=
  Rate                                   1 invite

  Avg Session Length    \> 12 minutes    App analytics

  Push Notification CTR \> 20%           Notifications delivered vs opened

  Streak Shield Usage   10--30% of       Shields consumed / streak break
  Rate                  at-risk users    events
  ------------------------------------------------------------------------

**SECTION A APPENDIX**

> **Appendix A --- XP Earning Quick Reference**

A condensed one-page reference for the engineering team to ensure all XP
award hooks are implemented correctly.

  --------------------------------------------------------------------------------------
  **Trigger Event**   **Service / Module**           **XP         **Cap**
                                                     Amount**     
  ------------------- ------------------------------ ------------ ----------------------
  User sends message  ChatService.sendMessage        2 XP         40/day

  User receives reply ChatService.onReply            3 XP         30/day

  User completes easy QuestService.completeQuest     25 XP        None
  quest                                                           

  User completes      QuestService.completeQuest     50 XP        None
  medium quest                                                    

  User completes hard QuestService.completeQuest     100 XP       None
  quest                                                           

  User plays any game GameService.onGameStart        10 XP        50/day

  User wins a game    GameService.onGameEnd (winner) 15 XP        60/day

  User sends game     GameService.sendInvite         5 XP         25/day
  invite                                                          

  User accepts game   GameService.acceptInvite       5 XP         25/day
  invite                                                          

  Streak maintained   StreakService.cron             20 XP        None
  (midnight)                                                      

  Streak milestone    StreakService.checkMilestone   50--500 XP   None
  hit                                                             

  Badge earned        BadgeService.awardBadge        50 XP        None

  User matches with   MatchingService.onMatch        15 XP        60/day
  someone                                                         

  First match of day  MatchingService.onMatch        +15 XP bonus Once/day

  Daily login         AuthService.onLogin            10 XP        10/day

  Onboarding          OnboardingService.complete     200 XP       One-time
  completed                                                       

  Friend joins via    ReferralService.onJoin         100 XP       None
  invite                                                          
  --------------------------------------------------------------------------------------

> **Appendix B --- Streak Milestone Rewards**

  ------------------------------------------------------------------------
  **Streak      **XP       **Badge          **Extra Reward**
  Length**      Bonus**    Awarded**        
  ------------- ---------- ---------------- ------------------------------
  3 days        50 XP      3-Day Spark      1 Streak Shield

  7 days        150 XP     7-Day Flame      1 Streak Shield + Level XP
                                            boost (24h)

  14 days       300 XP     14-Day Blaze     Custom profile border (14-day
                                            flame)

  30 days       500 XP     30-Day Inferno   Exclusive \'On Fire\' animated
                                            frame

  60 days       750 XP     60-Day Phoenix   Priority leaderboard
                                            visibility (1 week)

  100 days      1000 XP    100-Day Century  Permanent Century ring on
                                            profile

  365 days      5000 XP    365-Day Legend   Hall of Fame permanent listing
  ------------------------------------------------------------------------

*End of Document --- Pingo Feature Implementation Plan v1.0*
