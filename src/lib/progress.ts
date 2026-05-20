const KEY = 'devreaski.progress.v2'

export type ActivityType = 'complete' | 'quiz_correct' | 'quiz_wrong'

export type Activity = {
  type: ActivityType
  topicId: string
  ts: number
}

type Progress = {
  completedTopics: string[]
  activities: Activity[]
}

function read(): Progress {
  if (typeof localStorage === 'undefined') return { completedTopics: [], activities: [] }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      // migrate from v1
      const v1 = localStorage.getItem('devreaski.progress.v1')
      if (v1) {
        const old = JSON.parse(v1) as { completedTopics?: string[] }
        return { completedTopics: old.completedTopics ?? [], activities: [] }
      }
      return { completedTopics: [], activities: [] }
    }
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      completedTopics: parsed.completedTopics ?? [],
      activities: parsed.activities ?? [],
    }
  } catch {
    return { completedTopics: [], activities: [] }
  }
}

function write(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function getCompleted(): string[] {
  return read().completedTopics
}

export function markCompleted(id: string) {
  const p = read()
  if (!p.completedTopics.includes(id)) {
    p.completedTopics.push(id)
  }
  p.activities.push({ type: 'complete', topicId: id, ts: Date.now() })
  write(p)
}

export function logActivity(type: ActivityType, topicId: string) {
  const p = read()
  p.activities.push({ type, topicId, ts: Date.now() })
  write(p)
}

export function isCompleted(id: string): boolean {
  return read().completedTopics.includes(id)
}

export function resetProgress() {
  write({ completedTopics: [], activities: [] })
}

export function getAllActivities(): Activity[] {
  return read().activities
}

export type PeriodStats = {
  completions: number
  quizCorrect: number
  quizWrong: number
  uniqueTopics: number
}

function cutoffFor(period: 'today' | 'week' | 'month'): number {
  const now = Date.now()
  if (period === 'today') {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  if (period === 'week') return now - 7 * 24 * 60 * 60 * 1000
  return now - 30 * 24 * 60 * 60 * 1000
}

export function getStats(period: 'today' | 'week' | 'month'): PeriodStats {
  const cutoff = cutoffFor(period)
  const acts = read().activities.filter((a) => a.ts >= cutoff)
  let completions = 0
  let quizCorrect = 0
  let quizWrong = 0
  const topics = new Set<string>()
  for (const a of acts) {
    if (a.type === 'complete') { completions++; topics.add(a.topicId) }
    if (a.type === 'quiz_correct') quizCorrect++
    if (a.type === 'quiz_wrong') quizWrong++
  }
  return { completions, quizCorrect, quizWrong, uniqueTopics: topics.size }
}
