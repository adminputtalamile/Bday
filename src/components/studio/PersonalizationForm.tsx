import type { BirthdayData } from '../../types'
import FormField, { inputClass } from './FormField'

interface PersonalizationFormProps {
  data: BirthdayData
  onChange: (patch: Partial<BirthdayData>) => void
}

export default function PersonalizationForm({ data, onChange }: PersonalizationFormProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Recipient's name">
          <input
            className={inputClass}
            value={data.recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            placeholder="e.g. Maya"
            maxLength={40}
          />
        </FormField>
        <FormField label="Your name (sender)">
          <input
            className={inputClass}
            value={data.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            placeholder="e.g. Sam"
            maxLength={40}
          />
        </FormField>
      </div>

      <FormField label="Birthday date" hint="Optional — shown nowhere yet, reserved for future reminders.">
        <input
          type="date"
          className={inputClass}
          value={data.birthdayDate}
          onChange={(e) => onChange({ birthdayDate: e.target.value })}
        />
      </FormField>

      <FormField
        label="Main birthday message"
        hint="Appears early on, revealed word by word, and again in the finale."
      >
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          value={data.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Wishing you a day filled with everything that makes you smile..."
        />
      </FormField>

      <FormField label="Secret message" hint="Optional — hidden behind a tap-to-reveal envelope.">
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={data.specialMessage}
          onChange={(e) => onChange({ specialMessage: e.target.value })}
          placeholder="A little something just for their eyes..."
        />
      </FormField>

      <FormField
        label="Background music URL"
        hint="Optional — link to a royalty-free MP3 you have rights to use. Leave blank to skip music."
      >
        <input
          className={inputClass}
          value={data.musicUrl}
          onChange={(e) => onChange({ musicUrl: e.target.value })}
          placeholder="https://example.com/song.mp3"
          type="url"
        />
      </FormField>
    </div>
  )
}
