import { useState, useEffect, useCallback } from 'react'
import { BarChart2, Trash2, Users, Plus, RefreshCw, Power, UserX, Lock } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import { getAllActivities, getStats, resetProgress, type Activity } from '../lib/progress'
import { supabase } from '../lib/supabase'
import { sha256 } from '../lib/auth'

// ── Types ────────────────────────────────────────────────────────────────
type LicenseUser = {
  id: string
  username: string
  device_id: string | null
  is_active: boolean
  notes: string
  created_at: string
}

// ── Local stats helpers ──────────────────────────────────────────────────
const topicNames: Record<string, string> = {
  'aa-devre': 'AA Devre', segment: '7-Segment', mux: 'MUX',
  sayicilar: 'Sayıcılar', alarm: 'Alarm', 'adc-dac': 'ADC/DAC',
}

function typeBadge(type: Activity['type']) {
  if (type === 'complete') return <span className="chip bg-mint-100 text-mint-500 text-xs">✓ Tamamlandı</span>
  if (type === 'quiz_correct') return <span className="chip bg-lavender-100 text-lavender-500 text-xs">Doğru</span>
  return <span className="chip bg-blush-100 text-blush-500 text-xs">Yanlış</span>
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Admin password gate ─────────────────────────────────────────────────
function AdminGate({ onVerified }: { onVerified: (hash: string) => void }) {
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function check() {
    if (!pw) return
    setLoading(true)
    try {
      const hash = await sha256(pw)
      // Try fetching users — if it throws "Unauthorized", password is wrong
      const { error } = await supabase.rpc('admin_get_users', { p_admin_hash: hash })
      if (error) {
        setError('Admin şifresi hatalı.')
      } else {
        onVerified(hash)
      }
    } catch {
      setError('Bir hata oluştu.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <PlainCard className="p-8 text-center">
        <Lock className="w-8 h-8 text-lavender-400 mx-auto mb-4" />
        <h2 className="font-display font-bold text-ink mb-1">Admin Paneli</h2>
        <p className="text-sm text-inkSoft mb-6">Devam etmek için admin şifresini gir.</p>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Admin şifresi"
          autoFocus
          className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink mb-3 focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <button
          onClick={check}
          disabled={loading || !pw}
          className="w-full py-2 bg-lavender text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? 'Kontrol ediliyor…' : 'Giriş Yap'}
        </button>
      </PlainCard>
    </div>
  )
}

// ── User management tab ─────────────────────────────────────────────────
function UsersTab({ adminHash }: { adminHash: string }) {
  const [users, setUsers] = useState<LicenseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.rpc('admin_get_users', { p_admin_hash: adminHash })
    if (data) setUsers(data as LicenseUser[])
    setLoading(false)
  }, [adminHash])

  useEffect(() => { load() }, [load])

  async function createUser() {
    if (!newUsername.trim() || !newPassword) return
    setCreating(true)
    setCreateError(null)
    const hash = await sha256(newPassword)
    const { data } = await supabase.rpc('admin_create_user', {
      p_admin_hash: adminHash,
      p_username: newUsername.trim(),
      p_password_hash: hash,
      p_notes: newNotes.trim(),
    })
    const result = data as { success: boolean; error?: string }
    if (result?.success) {
      setNewUsername(''); setNewPassword(''); setNewNotes('')
      load()
    } else {
      setCreateError(result?.error ?? 'Bir hata oluştu.')
    }
    setCreating(false)
  }

  async function resetDevice(username: string) {
    await supabase.rpc('admin_reset_device', { p_admin_hash: adminHash, p_username: username })
    load()
  }

  async function toggleActive(username: string, current: boolean) {
    await supabase.rpc('admin_set_active', { p_admin_hash: adminHash, p_username: username, p_active: !current })
    load()
  }

  async function deleteUser(username: string) {
    if (!window.confirm(`"${username}" kullanıcısı silinsin mi?`)) return
    await supabase.rpc('admin_delete_user', { p_admin_hash: adminHash, p_username: username })
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Create user */}
      <PlainCard>
        <h3 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Kullanıcı Oluştur
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            placeholder="Kullanıcı adı"
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Şifre"
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          />
          <input
            value={newNotes}
            onChange={e => setNewNotes(e.target.value)}
            placeholder="Notlar (opsiyonel)"
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          />
        </div>
        {createError && <p className="text-xs text-red-500 mb-2">{createError}</p>}
        <button
          onClick={createUser}
          disabled={creating || !newUsername.trim() || !newPassword}
          className="px-4 py-2 bg-lavender text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition"
        >
          {creating ? 'Oluşturuluyor…' : 'Oluştur'}
        </button>
      </PlainCard>

      {/* User list */}
      <PlainCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink flex items-center gap-2">
            <Users className="w-4 h-4" /> Kullanıcılar ({users.length})
          </h3>
          <button onClick={load} className="p-1.5 rounded-full hover:bg-lavender-50 transition" title="Yenile">
            <RefreshCw className="w-4 h-4 text-inkSoft" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-inkSoft py-6 text-center">Yükleniyor…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-inkSoft py-6 text-center">Henüz kullanıcı yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-inkSoft border-b border-lavender-100">
                  <th className="text-left py-2 pr-3">Kullanıcı</th>
                  <th className="text-left py-2 pr-3">Cihaz</th>
                  <th className="text-left py-2 pr-3">Durum</th>
                  <th className="text-left py-2 pr-3">Notlar</th>
                  <th className="text-left py-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-lavender-50 hover:bg-lavender-50/40 transition-colors">
                    <td className="py-2 pr-3 font-semibold text-ink">{u.username}</td>
                    <td className="py-2 pr-3">
                      {u.device_id
                        ? <span className="chip bg-mint-100 text-mint-600 text-xs">Bağlı</span>
                        : <span className="chip bg-ink/5 text-inkSoft text-xs">Boş</span>
                      }
                    </td>
                    <td className="py-2 pr-3">
                      {u.is_active
                        ? <span className="chip bg-mint-100 text-mint-600 text-xs">Aktif</span>
                        : <span className="chip bg-blush-100 text-blush-500 text-xs">Pasif</span>
                      }
                    </td>
                    <td className="py-2 pr-3 text-inkSoft text-xs">{u.notes || '—'}</td>
                    <td className="py-2">
                      <div className="flex gap-1.5 flex-wrap">
                        {u.device_id && (
                          <button
                            onClick={() => resetDevice(u.username)}
                            title="Cihazı sıfırla"
                            className="p-1.5 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 transition"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleActive(u.username, u.is_active)}
                          title={u.is_active ? 'Pasif yap' : 'Aktif yap'}
                          className={`p-1.5 rounded-lg transition ${u.is_active ? 'bg-blush-100 text-blush-500 hover:bg-blush-200' : 'bg-mint-100 text-mint-600 hover:bg-mint-200'}`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteUser(u.username)}
                          title="Kullanıcıyı sil"
                          className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PlainCard>
    </div>
  )
}

// ── Stats tab ────────────────────────────────────────────────────────────
type Period = 'today' | 'week' | 'month' | 'all'

function StatsTab() {
  const [period, setPeriod] = useState<Period>('week')
  const [cleared, setCleared] = useState(false)
  const allActivities = getAllActivities()
  const cutoff = (() => {
    const now = Date.now()
    if (period === 'today') { const d = new Date(now); d.setHours(0, 0, 0, 0); return d.getTime() }
    if (period === 'week') return now - 7 * 24 * 60 * 60 * 1000
    if (period === 'month') return now - 30 * 24 * 60 * 60 * 1000
    return 0
  })()
  const filtered = [...allActivities].filter(a => a.ts >= cutoff).reverse()
  const today = getStats('today')
  const week = getStats('week')
  const month = getStats('month')

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Bugün', s: today }, { label: 'Bu Hafta', s: week }, { label: 'Bu Ay', s: month }]
          .map(({ label, s }) => (
            <PlainCard key={label} className="text-center">
              <p className="text-xs font-bold text-inkSoft uppercase tracking-wider mb-3">{label}</p>
              <p className="text-3xl font-bold text-ink">{s.uniqueTopics}</p>
              <p className="text-xs text-inkSoft mt-1">konu tamamlandı</p>
              <div className="mt-3 flex justify-center gap-3 text-xs">
                <span className="text-mint-500 font-semibold">{s.quizCorrect} ✓</span>
                <span className="text-blush-500 font-semibold">{s.quizWrong} ✗</span>
              </div>
            </PlainCard>
          ))}
      </div>

      <PlainCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-semibold text-ink">Aktivite Geçmişi</h3>
          <div className="flex gap-1 flex-wrap">
            {(['today', 'week', 'month', 'all'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`chip text-xs transition-all ${period === p ? 'bg-lavender-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
              >
                {{ today: 'Bugün', week: 'Bu Hafta', month: 'Bu Ay', all: 'Tümü' }[p]}
              </button>
            ))}
          </div>
        </div>
        {cleared ? (
          <p className="text-sm text-inkSoft py-8 text-center">Kayıtlar silindi.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-inkSoft py-8 text-center">Bu dönemde aktivite yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-inkSoft border-b border-lavender-100">
                  <th className="text-left py-2 pr-4">Tarih & Saat</th>
                  <th className="text-left py-2 pr-4">Konu</th>
                  <th className="text-left py-2">Tür</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="border-b border-lavender-50 hover:bg-lavender-50/50 transition-colors">
                    <td className="py-2 pr-4 text-inkSoft font-mono text-xs">{formatTime(a.ts)}</td>
                    <td className="py-2 pr-4 text-ink font-semibold">{topicNames[a.topicId] ?? a.topicId}</td>
                    <td className="py-2">{typeBadge(a.type)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PlainCard>

      <div className="card-soft p-4 border border-blush-200">
        <p className="text-xs font-semibold text-inkSoft mb-2">Veri yönetimi</p>
        <button
          onClick={() => { if (!window.confirm('Tüm aktivite ve ilerleme kaydı silinsin mi?')) return; resetProgress(); setCleared(true) }}
          className="flex items-center gap-2 text-sm text-blush-500 hover:text-blush-600 font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Tüm kayıtları sıfırla
        </button>
      </div>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────
type Tab = 'stats' | 'users'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('stats')
  const [adminHash, setAdminHash] = useState<string | null>(null)
  const needsGate = tab === 'users' && !adminHash

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Admin Paneli"
        subtitle="İstatistikler ve kullanıcı yönetimi"
        icon={<BarChart2 className="w-6 h-6" />}
        accent="lavender"
      />
      <div className="flex gap-2 mb-8">
        <TabBtn active={tab === 'stats'} onClick={() => setTab('stats')}><BarChart2 className="w-4 h-4" /> İstatistikler</TabBtn>
        <TabBtn active={tab === 'users'} onClick={() => setTab('users')}><Users className="w-4 h-4" /> Kullanıcılar</TabBtn>
      </div>

      {needsGate && <AdminGate onVerified={setAdminHash} />}
      {!needsGate && tab === 'stats' && <StatsTab />}
      {!needsGate && tab === 'users' && adminHash && <UsersTab adminHash={adminHash} />}
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
        active ? 'bg-lavender-200 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white/90'
      }`}
    >
      {children}
    </button>
  )
}
