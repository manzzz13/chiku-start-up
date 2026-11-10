export const brand = {
  name: 'chiku',
  tagline: 'A little more you.',
  homeHeadline: 'Shampoo that actually knows you.',
  intro: 'Your scalp has a personality. Your shampoo should know it.',
  note: 'Made for your scalp, your strands, your very specific shower routine.',
  footerLine: 'Good hair days start with a good question.',
}

export type Formula = {
  id: number
  name: string
  concern: string
  forWho: string
  description: string
  color: string
  wash: string
}

export const formulas: Formula[] = [
  { id: 1, name: 'Flake Reset', concern: 'Dandruff control', forWho: 'Flakes that keep making an appearance.', description: 'A considered reset for a flaky, unsettled scalp.', color: '#d8a66c', wash: 'A fresh start, not a fresh identity.' },
  { id: 2, name: 'Oil Balance', concern: 'Oily scalp', forWho: 'Roots that clock out before the day does.', description: 'A lighter-feeling cleanse for roots that get oily quickly.', color: '#c4c797', wash: 'Clean roots. No squeaky-clean drama.' },
  { id: 3, name: 'Hydra Calm', concern: 'Dry scalp', forWho: 'A scalp that prefers a little extra comfort.', description: 'A gentle, comfort-first wash for dry-feeling days.', color: '#b7c8c0', wash: 'Softly does it.' },
  { id: 4, name: 'Gentle Ground', concern: 'Sensitive scalp', forWho: 'Scalps that like things uncomplicated.', description: 'A thoughtful, low-fuss cleanse for easily bothered scalps.', color: '#d9b8a6', wash: 'Less fuss. More feeling like yourself.' },
  { id: 5, name: 'Silk Slip', concern: 'Frizz & roughness', forWho: 'Hair that could use a softer landing.', description: 'A smoothing-minded wash for dry, rough or frizzy lengths.', color: '#d4a9b5', wash: 'A little less puff. A little more polish.' },
  { id: 6, name: 'Repair Room', concern: 'Treated & damaged hair', forWho: 'Hair with a colourist, heat tool or a story.', description: 'A gentle-feeling wash for colour-treated and heat-styled hair.', color: '#b6a4c6', wash: 'Your lengths have been through enough.' },
  { id: 7, name: 'Lift', concern: 'Fine, flat hair', forWho: 'Fine strands ready for a little lift-off.', description: 'A light-touch cleanse for hair that falls a bit flat.', color: '#e0b66f', wash: 'Airy, not overachieving.' },
]

export const prices = [
  { size: '50 ml', amount: 100 },
  { size: '200 ml', amount: 300 },
  { size: '400 ml', amount: 600 },
]

export const fragrances = ['Nimbu, Naturally', 'Fig About It', 'No Added Drama', 'Softly Sandalwood', 'Fragrance-free, please']

export type QuizQuestion = {
  id: string
  section: string
  title: string
  helper: string
  type: 'single' | 'multiple' | 'text' | 'priority'
  options?: string[]
  max?: number
}

export const quizQuestions: QuizQuestion[] = [
  { id: 'age', section: 'A little about you', title: 'First up, what age group are you in?', helper: 'Only helps us keep your recommendation relevant.', type: 'single', options: ['Under 18', '18–24', '25–34', '35–44', '45+', 'Prefer not to say'] },
  { id: 'city', section: 'A little about you', title: 'Where do your showers happen?', helper: 'City helps us make sense of your water and weather.', type: 'text' },
  { id: 'scalp', section: 'Your scalp, specifically', title: 'How does your scalp usually feel by wash day?', helper: 'Go with your usual, not your best-hair-day answer.', type: 'single', options: ['Very oily', 'Slightly oily', 'Normal', 'Dry', 'Sensitive', 'A bit of everything', 'Not sure'] },
  { id: 'strand', section: 'Your scalp, specifically', title: 'How would you describe each strand?', helper: 'If you’re unsure, “not sure” is a very good answer.', type: 'single', options: ['Fine', 'Medium', 'Thick', 'Not sure'] },
  { id: 'concerns', section: 'The current situation', title: 'Anything your hair has been dealing with?', helper: 'Pick all that feel familiar. No judgment, ever.', type: 'multiple', options: ['Dandruff', 'Oily scalp', 'Dry scalp', 'Itchy scalp', 'Irritated scalp', 'Hair fall', 'Breakage', 'Dry or rough hair', 'Frizz', 'Chemically treated', 'Flat or lifeless'] },
  { id: 'oilTiming', section: 'The current situation', title: 'How soon do your roots get oily after a wash?', helper: 'We’re talking your actual roots, not your calendar.', type: 'single', options: ['By the next day', 'After 2 days', 'After 3–4 days', 'Almost never', 'Not sure'] },
  { id: 'flakes', section: 'The current situation', title: 'How often do you notice flakes?', helper: 'Small detail, useful clue.', type: 'single', options: ['Often', 'Sometimes', 'Rarely', 'Never'] },
  { id: 'flakeType', section: 'The current situation', title: 'If flakes show up, what are they like?', helper: 'Choose the closest match, or skip the guesswork.', type: 'single', options: ['Oily or sticky', 'Dry and powdery', 'Usually itchy too', 'Usually sensitive or irritated', 'No flakes / not sure'] },
  { id: 'afterShampoo', section: 'The current situation', title: 'After shampoo, does your scalp itch or feel tight?', helper: 'Think about the hour after you rinse.', type: 'single', options: ['Often', 'Sometimes', 'Rarely', 'Never'] },
  { id: 'lengths', section: 'The current situation', title: 'What do your lengths feel like after washing?', helper: 'The ends have opinions too.', type: 'single', options: ['Dry or rough', 'Frizzy', 'Mostly comfortable', 'Flat or limp', 'A mix of these'] },
  { id: 'treated', section: 'Your routine', title: 'Any colour, bleach or chemical treatments?', helper: 'We’re not asking what you got done, promise.', type: 'single', options: ['Yes, recently', 'Yes, but not recently', 'No', 'Not sure'] },
  { id: 'volume', section: 'Your routine', title: 'How are you feeling about your hair’s volume?', helper: 'Big hair energy is optional.', type: 'single', options: ['It falls flat', 'I’d like a little more lift', 'Volume is not a concern', 'Not sure'] },
  { id: 'washFrequency', section: 'Your routine', title: 'How often do you wash your hair?', helper: 'There’s no gold-star answer here.', type: 'single', options: ['Every day', 'Every 2–3 days', 'Twice a week', 'About once a week', 'It depends'] },
  { id: 'sweat', section: 'Your routine', title: 'How much do workouts or sweat shape wash day?', helper: 'A walk to the metro counts if it’s hot enough.', type: 'single', options: ['A lot — most days', 'Some weeks', 'Not much', 'It varies'] },
  { id: 'water', section: 'Your routine', title: 'What kind of water comes out of your tap?', helper: 'Hard water can leave a mineral feel. Not sure is fine.', type: 'single', options: ['Hard', 'Soft', 'Filtered', 'Not sure'] },
  { id: 'priorities', section: 'One last thing', title: 'Pick up to three things you want from your shampoo.', helper: 'The top three matter most. We’ll take it from here.', type: 'priority', max: 3, options: ['A calmer scalp', 'Fewer visible flakes', 'Less oily roots', 'More comfortable moisture', 'Less frizz', 'Gentler on treated hair', 'Lightweight volume', 'A simple, gentle wash', 'Less breakage'] },
]
