import { formulas } from '../data/config'

type Answers = Record<string, string | string[]>

// Tune these weights to change how strongly each answer influences a match.
export function scoreFormulas(answers: Answers) {
  const scores = new Map<number, number>(formulas.map((formula) => [formula.id, 0]))
  const add = (id: number, points: number) => scores.set(id, (scores.get(id) ?? 0) + points)
  const concerns = Array.isArray(answers.concerns) ? answers.concerns : []
  const priorities = Array.isArray(answers.priorities) ? answers.priorities : []
  const has = (value: string) => concerns.includes(value)

  if (has('Dandruff')) add(1, 6)
  if (has('Oily scalp')) add(2, 5)
  if (has('Dry scalp')) add(3, 5)
  if (has('Itchy scalp')) { add(1, 1); add(4, 2) }
  if (has('Irritated scalp')) add(4, 5)
  if (has('Dry or rough hair')) add(5, 4)
  if (has('Frizz')) add(5, 4)
  if (has('Chemically treated')) add(6, 5)
  if (has('Flat or lifeless')) add(7, 5)
  if (has('Breakage')) { add(5, 1); add(6, 2) }
  if (has('Hair fall')) add(4, 1)

  const scalp = answers.scalp
  if (scalp === 'Very oily' || scalp === 'Slightly oily') add(2, 4)
  if (scalp === 'Dry') add(3, 4)
  if (scalp === 'Sensitive') add(4, 5)
  if (scalp === 'A bit of everything') { add(4, 1); add(5, 1) }
  if (answers.oilTiming === 'By the next day') add(2, 3)
  if (answers.oilTiming === 'After 2 days') add(2, 1)
  if (answers.flakes === 'Often') add(1, 3)
  if (answers.flakes === 'Sometimes') add(1, 1)
  if (answers.flakeType === 'Oily or sticky') add(1, 2)
  if (answers.flakeType === 'Dry and powdery') add(3, 1)
  if (answers.flakeType === 'Usually itchy too') { add(1, 1); add(4, 1) }
  if (answers.flakeType === 'Usually sensitive or irritated') add(4, 2)
  if (answers.afterShampoo === 'Often') { add(3, 1); add(4, 2) }
  if (answers.lengths === 'Dry or rough') add(5, 3)
  if (answers.lengths === 'Frizzy') add(5, 3)
  if (answers.lengths === 'Flat or limp') add(7, 3)
  if (answers.treated === 'Yes, recently') add(6, 4)
  if (answers.treated === 'Yes, but not recently') add(6, 2)
  if (answers.volume === 'It falls flat' || answers.volume === 'I’d like a little more lift') add(7, 3)
  if (answers.water === 'Hard') { add(1, 1); add(5, 1) }

  const priorityMap: Record<string, number[]> = {
    'A calmer scalp': [3, 4], 'Fewer visible flakes': [1], 'Less oily roots': [2],
    'More comfortable moisture': [3], 'Less frizz': [5], 'Gentler on treated hair': [6],
    'Lightweight volume': [7], 'A simple, gentle wash': [4], 'Less breakage': [6, 5],
  }
  priorities.forEach((priority) => (priorityMap[priority] ?? []).forEach((id) => add(id, 2)))

  return formulas
    .map((formula) => ({ formula, score: scores.get(formula.id) ?? 0 }))
    .sort((a, b) => b.score - a.score || a.formula.id - b.formula.id)
}

export function getMatchReason(answers: Answers, formulaId: number) {
  const reasons: string[] = []
  const concerns = Array.isArray(answers.concerns) ? answers.concerns : []
  const priorities = Array.isArray(answers.priorities) ? answers.priorities : []
  const formulaReason: Record<number, string> = {
    1: 'you mentioned flakes or an itchy scalp',
    2: 'your roots tend to get oily sooner',
    3: 'your scalp is asking for more comfort',
    4: 'you said your scalp can feel sensitive or unsettled',
    5: 'your lengths could use a little less frizz or roughness',
    6: 'you told us your hair has been chemically treated',
    7: 'you’re looking for a lighter feel and more lift',
  }
  if (formulaReason[formulaId] && (concerns.length || answers.scalp || answers.lengths || answers.treated || answers.volume)) reasons.push(formulaReason[formulaId])
  if (answers.scalp && answers.scalp !== 'Not sure') reasons.push(`your scalp feels ${String(answers.scalp).toLowerCase()}`)
  if (priorities[0]) reasons.push(`your first priority is ${String(priorities[0]).toLowerCase()}`)
  if (answers.water === 'Hard') reasons.push('you flagged hard water in your routine')
  if (!reasons.length) reasons.push('you deserve a formula that starts with your own routine')
  return reasons.slice(0, 3)
}
