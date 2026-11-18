// Level design. 20 themed levels, then the same themes repeat with harder numbers (infinite levels).
const NAMES = ['Sunrise Start','Coin Valley','Amber Hills','Purple Haze','Silver Lake','Gem Garden','Copper Canyon','Midnight Run','Jade Temple','Frost Peak','Ruby Ridge','Golden Bridge','Misty Woods','Ocean Drift','Desert Gold','Starlight Road','Crystal Cave','Velvet Sky','Emerald Gate','Royal Summit']
const HUES = [35,45,25,265,210,140,20,240,160,195,350,48,120,200,40,225,180,285,150,50]
export const BOOST_UNLOCK = 15 // complete this many levels to reveal the Boost power-up

export function levelConfig(n) {
  const i = (n - 1) % 20
  const round = Math.floor((n - 1) / 20)
  const type = ['score', 'coins', 'gems'][(n - 1) % 3]
  const goal =
    type === 'score' ? { type, amount: Math.min(1400, 150 + n * 40), label: 'Reach the target score' }
    : type === 'coins' ? { type, amount: 8 + Math.min(Math.floor(n / 3), 8), label: 'Collect VE coins' }
    : { type, amount: 3 + Math.min(Math.floor(n / 6), 5), label: 'Collect gems' }
  return {
    n, goal, hue: HUES[i], pattern: i % 4,
    name: NAMES[i] + (round > 0 ? ` ${round + 1}` : ''),
    seconds: 30, lives: 3,
    speed: 1.5 + Math.min(n, 60) * 0.035,      // items fall faster in later levels
    hazard: Math.min(0.5, 0.2 + n * 0.01),     // more dark blocks in later levels
    gap: Math.max(7, 14 - Math.floor(n / 5)),
  }
}

// Milestone rewards (DEMO values)
export const milestones = [
  { level: 5, text: '100 VEs' }, { level: 10, text: '10 Gems + 200 VEs' },
  { level: 15, text: 'New power-up: Boost' }, { level: 20, text: '500 VEs' },
  { level: 30, text: '25 Gems' }, { level: 40, text: '1,000 VEs' }, { level: 50, text: '50 Gems' },
]
