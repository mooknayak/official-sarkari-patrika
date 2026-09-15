// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/(site)/tools/resume-builder/ResumeBuilderClient.tsx
//
// बाकी Tools की तरह यह भी किसी npm Library या Server के बिना काम करता है।
// Resume Preview हमेशा दिखता रहता है (सिर्फ़ Print के वक़्त नहीं) ताकि User
// अपनी जानकारी भरते हुए Result Live देख सके। "Print / Save as PDF" दबाने पर
// सिर्फ़ Form का हिस्सा छुप जाता है (print:hidden), और Preview अकेला Print
// होता है।
'use client'

import { useState } from 'react'

type Education = { degree: string; institution: string; year: string; percentage: string }
type Experience = { role: string; company: string; duration: string; description: string }

function emptyEducation(): Education {
  return { degree: '', institution: '', year: '', percentage: '' }
}
function emptyExperience(): Experience {
  return { role: '', company: '', duration: '', description: '' }
}

export default function ResumeBuilderClient() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [objective, setObjective] = useState('')
  const [skills, setSkills] = useState('')
  const [languages, setLanguages] = useState('')
  const [education, setEducation] = useState<Education[]>([emptyEducation()])
  const [experience, setExperience] = useState<Experience[]>([emptyExperience()])

  const skillList = skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const languageList = languages
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  function updateEducation(idx: number, field: keyof Education, value: string) {
    setEducation((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)))
  }
  function updateExperience(idx: number, field: keyof Experience, value: string) {
    setExperience((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ===== फॉर्म (सिर्फ़ Screen पर, Print में नहीं) ===== */}
      <div className="bg-white border border-blue-100 rounded-lg p-4 space-y-5 print:hidden">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">व्यक्तिगत जानकारी</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="पूरा नाम"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-slate-200 rounded px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-slate-200 rounded px-3 py-2 text-sm"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-slate-200 rounded px-3 py-2 text-sm"
            />
            <textarea
              placeholder="पता (Address)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="border border-slate-200 rounded px-3 py-2 text-sm sm:col-span-2"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Career Objective / Summary</p>
          <textarea
            placeholder="अपने बारे में 2-3 लाइन में लिखें..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">शिक्षा (Education)</p>
            <button
              type="button"
              onClick={() => setEducation((prev) => [...prev, emptyEducation()])}
              className="text-xs font-semibold text-brand-blue hover:underline"
            >
              + और जोड़ें
            </button>
          </div>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="border border-slate-100 rounded-md p-3 space-y-2 relative">
                {education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setEducation((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-red-500 text-xs"
                  >
                    ✕ हटाएँ
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="डिग्री / परीक्षा (जैसे 12वीं, B.A.)"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="School / College / University"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="साल (जैसे 2023)"
                    value={edu.year}
                    onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="% / CGPA"
                    value={edu.percentage}
                    onChange={(e) => updateEducation(idx, 'percentage', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">अनुभव (Experience) - वैकल्पिक</p>
            <button
              type="button"
              onClick={() => setExperience((prev) => [...prev, emptyExperience()])}
              className="text-xs font-semibold text-brand-blue hover:underline"
            >
              + और जोड़ें
            </button>
          </div>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="border border-slate-100 rounded-md p-3 space-y-2 relative">
                {experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExperience((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-red-500 text-xs"
                  >
                    ✕ हटाएँ
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="पद (Role)"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="कंपनी / संस्था"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="अवधि (जैसे Jan 2023 - Present)"
                    value={exp.duration}
                    onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                    className="border border-slate-200 rounded px-3 py-2 text-sm sm:col-span-2"
                  />
                  <textarea
                    placeholder="काम का संक्षिप्त विवरण"
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    rows={2}
                    className="border border-slate-200 rounded px-3 py-2 text-sm sm:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Skills</p>
            <input
              type="text"
              placeholder="Comma से अलग करें: MS Office, Typing, English"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">भाषाएँ (Languages)</p>
            <input
              type="text"
              placeholder="जैसे: Hindi, English"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="bg-brand-pinkAccent text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* ===== Live Preview (Screen पर भी दिखता है, Print में यही अकेला दिखेगा) ===== */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 print:border-0 print:p-0 print:shadow-none shadow-sm">
        <div className="border-b-2 border-brand-blueDark pb-3 mb-3 text-center">
          <h2 className="text-2xl font-bold text-brand-blueDark">{fullName || 'आपका नाम'}</h2>
          <p className="text-xs text-slate-600 mt-1">
            {[phone, email, address].filter(Boolean).join(' | ') || 'Phone | Email | Address'}
          </p>
        </div>

        {objective && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-brand-blueDark uppercase border-b border-slate-200 pb-1 mb-1">
              Career Objective
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line">{objective}</p>
          </div>
        )}

        {education.some((e) => e.degree || e.institution) && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-brand-blueDark uppercase border-b border-slate-200 pb-1 mb-1">
              Education
            </h3>
            {education
              .filter((e) => e.degree || e.institution)
              .map((edu, idx) => (
                <div key={idx} className="text-sm text-slate-700 mb-1.5">
                  <span className="font-semibold">{edu.degree || 'डिग्री'}</span>
                  {edu.institution && <> — {edu.institution}</>}
                  {(edu.year || edu.percentage) && (
                    <span className="text-slate-500">
                      {' '}
                      ({[edu.year, edu.percentage].filter(Boolean).join(', ')})
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}

        {experience.some((e) => e.role || e.company) && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-brand-blueDark uppercase border-b border-slate-200 pb-1 mb-1">
              Experience
            </h3>
            {experience
              .filter((e) => e.role || e.company)
              .map((exp, idx) => (
                <div key={idx} className="text-sm text-slate-700 mb-2">
                  <p>
                    <span className="font-semibold">{exp.role || 'पद'}</span>
                    {exp.company && <> — {exp.company}</>}
                    {exp.duration && <span className="text-slate-500"> ({exp.duration})</span>}
                  </p>
                  {exp.description && <p className="text-slate-600 mt-0.5">{exp.description}</p>}
                </div>
              ))}
          </div>
        )}

        {skillList.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-brand-blueDark uppercase border-b border-slate-200 pb-1 mb-1">
              Skills
            </h3>
            <p className="text-sm text-slate-700">{skillList.join(' • ')}</p>
          </div>
        )}

        {languageList.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-brand-blueDark uppercase border-b border-slate-200 pb-1 mb-1">
              Languages
            </h3>
            <p className="text-sm text-slate-700">{languageList.join(' • ')}</p>
          </div>
        )}

        {!fullName && !objective && !skillList.length && (
          <p className="text-sm text-slate-400 text-center py-8">
            बाईं तरफ़ (या नीचे) जानकारी भरना शुरू कीजिए - Preview यहीं Live बनता जाएगा
          </p>
        )}
      </div>
    </div>
  )
}
