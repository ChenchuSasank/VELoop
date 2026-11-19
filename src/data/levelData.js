export const user = { name: 'VeLooper', xp: 0, streak: 0, tasksDone: 0, tasksTotal: 8, xpToday: 0 }

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

export const earnItems = [
  { id: 'watch',  title: 'Watch & Earn', text: 'Watch ads and earn',      xp: '+50 XP',  status: 'live' },
  { id: 'daily',  title: 'Daily Tasks',  text: 'Complete daily tasks',    xp: '+30 XP',  status: 'live' },
  { id: 'refer',  title: 'Refer & Earn', text: 'Invite friends and earn', xp: '+100 XP', status: 'live' },
  { id: 'game',   title: 'VE Dash',      text: 'Dash, collect and earn',  xp: '+10 XP',  status: 'live' },
  { id: 'mini',   title: 'Mini Games',   text: 'More games on the way',   xp: '+75 XP',  status: 'soon' },
  { id: 'streak', title: 'Streak Bonus', text: 'Maintain your streak',    xp: '+25 XP',  status: 'soon' },
]

export const activity = []

export function getLevel(xp) {
  let current = levels[0]
  levels.forEach((l) => { if (xp >= l.xp) current = l })
  return current
}

export function getNextLevel(level) {
  return levels.find((l) => l.level === level + 1) || null
}

export const dashRules = {
  seconds: 30,
  lives: 3,
  scoring: 'VE coin = 10, XP orb = 20, gem = 30 points, multiplied by your combo (up to x5).',
  reward: 'XP reward = score ÷ 40 (max 40 XP). Score 800+ also shows +15 VEs.',
  plays: 'Unlimited in this demo (the real limit will come from the backend).',
}
