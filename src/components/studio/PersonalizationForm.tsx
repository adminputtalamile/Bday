import type { BirthdayData } from '../../types'
import FormField, { inputClass } from './FormField'
import MusicPicker from './MusicPicker'

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

      <FormField label="Main birthday message" hint="Appears early on, revealed page by page like a book.">
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
        label="Final message"
        hint="Shown beneath 'Happy Birthday' in the grand finale, in place of the main message."
      >
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={data.finalMessage}
          onChange={(e) => onChange({ finalMessage: e.target.value })}
          placeholder="One last thing before you go..."
        />
      </FormField>

      <FormField label="Background music">
        <MusicPicker value={data.musicUrl} onChange={(musicUrl) => onChange({ musicUrl })} />
      </FormField>
    </div>
  )
}
