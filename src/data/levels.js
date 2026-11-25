const NAMES = ['Sunrise Start','Coin Valley','Amber Hills','Purple Haze','Silver Lake','Gem Garden','Copper Canyon','Midnight Run','Jade Temple','Frost Peak','Ruby Ridge','Golden Bridge','Misty Woods','Ocean Drift','Desert Gold','Starlight Road','Crystal Cave','Velvet Sky','Emerald Gate','Royal Summit']
const HUES = [35,45,25,265,210,140,20,240,160,195,350,48,120,200,40,225,180,285,150,50]
export const BOOST_UNLOCK = 15

export function levelConfig(n) {
  const i = (n - 1) % 20
  const round = Math.floor((n - 1) / 20)
  const type = n % 3 === 2 ? 'perfects' : 'floors'
  const goal = type === 'floors'
    ? { type, amount: 8 + Math.min(n, 30), label: 'Build the tower. Floors to stack' }
    : { type, amount: 3 + Math.min(Math.floor(n / 3), 8), label: 'Land perfect drops' }
  return {
    n, goal, hue: HUES[i], pattern: i % 4,
    name: NAMES[i] + (round > 0 ? ` ${round + 1}` : ''),
    speed: 0.55 + Math.min(n, 50) * 0.03,
  }
}

export const milestones = [
  { level: 5, text: '100 VEs' }, { level: 10, text: '10 Gems + 200 VEs' },
  { level: 15, text: 'New power-up: Boost' }, { level: 20, text: '500 VEs' },
  { level: 30, text: '25 Gems' }, { level: 40, text: '1,000 VEs' }, { level: 50, text: '50 Gems' },
]

export function levelReward(n) {
  const m = milestones.find((x) => x.level === n)
  return m ? m.text : `${n * 10} VEs`
}

export function nextMilestone(completed) {
  return milestones.find((m) => m.level > completed) || null
}