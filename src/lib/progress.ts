const KEY = 'devreaski.progress.v1'

type Progress = {
  completedTopics: string[]
}

function read(): Progress {
  if (typeof localStorage === 'undefined') return { completedTopics: [] }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { completedTopics: [] }
    return JSON.parse(raw) as Progress
  } catch {
    return { completedTopics: [] }
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
    write(p)
  }
}

export function isCompleted(id: string): boolean {
  return read().completedTopics.includes(id)
}

export function resetProgress() {
  write({ completedTopics: [] })
}
