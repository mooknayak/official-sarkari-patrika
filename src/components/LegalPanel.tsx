// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/LegalPanel.tsx
// Footer में दिखने वाला Organization Chart - बिल्कुल Court/Judiciary की Vanshavali
// जैसा: सबसे ऊपर Founder, उसके नीचे लाइनों से जुड़े हुए Vibhag (Technical/Editorial/
// Legal), हर Vibhag का Head (Photo सहित) और बाकी Members (सिर्फ़ नाम+पद)।
// अगर Sanity में कुछ भी न भरा हो, तो यह Component कुछ नहीं दिखाता (कोई नुकसान नहीं)।
import Image from 'next/image'

type Person = { name?: string; role?: string; photoUrl?: string }
type Member = { name?: string; role?: string }
type Department = { departmentName?: string; head?: Person; members?: Member[] }
type LegalPanelProps = {
  founder?: Person
  departments?: Department[]
}

function PersonCard({ person, size = 'md' }: { person?: Person; size?: 'lg' | 'md' }) {
  if (!person?.name) return null
  const dim = size === 'lg' ? 'h-20 w-20 md:h-24 md:w-24' : 'h-14 w-14'
  const nameSize = size === 'lg' ? 'text-base md:text-lg' : 'text-sm'

  return (
    <div className="flex flex-col items-center text-center">
      {person.photoUrl ? (
        <Image
          src={person.photoUrl}
          alt={person.name}
          width={96}
          height={96}
          className={`${dim} rounded-full object-cover border-2 border-brand-pinkAccent shadow-md`}
        />
      ) : (
        <div
          className={`${dim} rounded-full bg-brand-blueLight border-2 border-brand-pinkAccent flex items-center justify-center text-brand-blueDark font-bold shadow-md`}
        >
          {person.name.charAt(0)}
        </div>
      )}
      <p className={`${nameSize} font-bold text-white mt-2`}>{person.name}</p>
      {person.role && <p className="text-xs text-blue-200">{person.role}</p>}
    </div>
  )
}

export default function LegalPanel({ founder, departments }: LegalPanelProps) {
  const activeDepartments = (departments || []).filter((d) => d.departmentName)
  if (!founder?.name && activeDepartments.length === 0) return null

  return (
    <div className="border-t border-white/10 mt-6 pt-8 pb-6">
      <h2 className="text-center text-white font-bold text-sm md:text-base tracking-widest uppercase mb-8">
        ⚖️ Legal Panel &amp; Organization
      </h2>

      {/* Founder - सबसे ऊपर, बीच में */}
      {founder?.name && (
        <div className="flex flex-col items-center">
          <PersonCard person={founder} size="lg" />
          {activeDepartments.length > 0 && <div className="w-px h-8 bg-white/20 mt-3" />}
        </div>
      )}

      {/* नीचे जोड़ने वाली क्षैतिज रेखा */}
      {activeDepartments.length > 1 && founder?.name && (
        <div className="hidden md:block h-px bg-white/20 max-w-3xl mx-auto" />
      )}

      {/* विभाग (Departments) */}
      {activeDepartments.length > 0 && (
        <div
          className={`grid gap-6 mt-6 max-w-4xl mx-auto ${
            activeDepartments.length === 1
              ? 'grid-cols-1 max-w-xs'
              : activeDepartments.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          }`}
        >
          {activeDepartments.map((dept, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="hidden md:block w-px h-6 bg-white/20 -mt-6 mb-2" />
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 w-full">
                <p className="text-center text-brand-pinkAccent font-bold text-xs uppercase tracking-wide mb-3">
                  {dept.departmentName}
                </p>

                {dept.head?.name && (
                  <div className="mb-3">
                    <PersonCard person={dept.head} />
                  </div>
                )}

                {dept.members && dept.members.length > 0 && (
                  <ul className="space-y-1.5 mt-3 pt-3 border-t border-white/10">
                    {dept.members
                      .filter((m) => m.name)
                      .map((m, mIdx) => (
                        <li key={mIdx} className="flex justify-between text-xs text-blue-100">
                          <span>{m.name}</span>
                          <span className="text-blue-300">{m.role}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
