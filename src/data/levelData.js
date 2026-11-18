// DEMO DATA ONLY. Replace with API data when the backend is ready.
export const user = { name: 'VeLooper', xp: 6420, streak: 7, tasksDone: 4, tasksTotal: 8, xpToday: 215 }

// "xp" is the total XP needed to reach that level.
export const levels = [
  { level: 1, name: 'Starter',  xp: 0,     reward: '50 VEs' },
  { level: 2, name: 'Explorer', xp: 500,   reward: '100 VEs' },
  { level: 3, name: 'Climber',  xp: 1500,  reward: '10 Gems' },
  { level: 4, name: 'Achiever', xp: 3500,  reward: '250 VEs' },
  { level: 5, name: 'Pro',      xp: 5500,  reward: '500 VEs + 25 Gems' },
  { level: 6, name: 'Elite',    xp: 8000,  reward: '750 VEs + 40 Gems' },
  { level: 7, name: 'Master',   xp: 11000, reward: '1,000 VEs' },
  { level: 8, name: 'Legend',   xp: 15000, reward: '2,000 VEs' },
]

// status: 'live' = existing feature, 'soon' = concept / coming soon
export const earnItems = [
  { id: 'watch',  title: 'Watch & Earn', text: 'Watch ads and earn',      xp: '+50 XP',  status: 'live' },
  { id: 'daily',  title: 'Daily Tasks',  text: 'Complete daily tasks',    xp: '+30 XP',  status: 'live' },
  { id: 'refer',  title: 'Refer & Earn', text: 'Invite friends and earn', xp: '+100 XP', status: 'live' },
  { id: 'game',   title: 'XP Catcher',   text: 'Catch orbs and coins',    xp: '+10 XP',  status: 'live' },
  { id: 'mini',   title: 'Mini Games',   text: 'More games on the way',   xp: '+75 XP',  status: 'soon' },
  { id: 'streak', title: 'Streak Bonus', text: 'Maintain your streak',    xp: '+25 XP',  status: 'soon' },
]

export const activity = [
  { id: 1, xp: '+20 XP', title: 'Referral Bonus',          time: 'Today, 10:45 AM' },
  { id: 2, xp: '+50 XP', title: 'Daily Mission Completed', time: 'Today, 09:12 AM' },
  { id: 3, xp: '+75 XP', title: 'Mini Game Win',           time: 'Today, 08:30 AM' },
  { id: 4, xp: '+25 XP', title: 'Streak Bonus',            time: 'Today, 07:20 AM' },
]

// Game rules shown to the user (demo values until the product team approves them)
export const gameRules = {
  seconds: 20,
  plays: 'Unlimited in this demo (the real limit will come from the backend).',
  scoring: 'XP orb = 10 points, VE coin = 5 points, gem = 15 points.',
  reward: 'XP reward = score ÷ 4 (max 30 XP). Score 80+ also gives +12 VEs.',
}

export function getLevel(xp) {
  let current = levels[0]
  levels.forEach((l) => { if (xp >= l.xp) current = l })
  return current
}
export function getNextLevel(level) {
  return levels.find((l) => l.level === level + 1) || null
}

// VE Dash rules (DEMO values until the product team approves real ones)
export const dashRules = {
  seconds: 30,
  lives: 3,
  scoring: 'VE coin = 10, XP orb = 20, gem = 30 points, multiplied by your combo (up to x5).',
  reward: 'XP reward = score ÷ 40 (max 40 XP). Score 800+ also shows +15 VEs.',
  plays: 'Unlimited in this demo (the real limit will come from the backend).',
}
