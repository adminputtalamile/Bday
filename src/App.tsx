import { useEffect, useState } from 'react'
import type { BirthdayData } from './types'
import { emptyBirthdayData } from './types'
import { readDataFromLocation, clearLocationData } from './lib/share'
import { loadDraft, saveDraft } from './lib/storage'
import Studio from './components/studio/Studio'
import Experience from './components/experience/Experience'

export default function App() {
  const [sharedData] = useState<BirthdayData | null>(() => readDataFromLocation())
  const [data, setData] = useState<BirthdayData>(() => loadDraft() ?? emptyBirthdayData)
  const [previewing, setPreviewing] = useState(false)

  useEffect(() => {
    if (sharedData) return
    saveDraft(data)
  }, [data, sharedData])

  if (sharedData) {
    return (
      <Experience
        data={sharedData}
        topAction={{
          label: '✎ Create your own',
          onClick: () => {
            clearLocationData()
            window.location.reload()
          },
        }}
      />
    )
  }

  function patch(update: Partial<BirthdayData>) {
    setData((prev) => ({ ...prev, ...update }))
  }

  if (previewing) {
    return (
      <Experience
        data={data}
        topAction={{ label: '← Back to editing', onClick: () => setPreviewing(false) }}
      />
    )
  }

  return <Studio data={data} onChange={patch} onPreview={() => setPreviewing(true)} />
}
