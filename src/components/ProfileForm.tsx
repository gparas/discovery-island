import { useRef, type FormEvent, type Ref } from 'react'
import { avatarIndexes, avatarLabels, NICKNAME_MAX_LENGTH } from '../profiles/profiles.ts'
import type { AvatarIndex, ProfileDraft } from '../types.ts'
import { Avatar } from './Avatar.tsx'
import { BackButton } from './BackButton.tsx'
import { Icon } from './Icon.tsx'

interface ProfileFormProps {
  draft: ProfileDraft
  headingRef: Ref<HTMLHeadingElement>
  onNicknameChange: (nickname: string) => void
  onAvatarChange: (avatar: AvatarIndex) => void
  /** Returns false when the draft was rejected, so the form can return focus to the nickname. */
  onSubmit: () => boolean
  onBack: () => void
}

export function ProfileForm({ draft: { nickname, avatar, error }, headingRef, onNicknameChange, onAvatarChange, onSubmit, onBack }: ProfileFormProps) {
  const nicknameInput = useRef<HTMLInputElement>(null)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!onSubmit()) nicknameInput.current?.focus()
  }
  return <>
    <BackButton className="back-button" onClick={onBack} />
    <h2 id="panel-title" className="form-title" ref={headingRef} tabIndex={-1}>Φτιάξε το προφίλ σου</h2>
    <form onSubmit={handleSubmit} noValidate>
      <fieldset><legend>Διάλεξε την εικόνα σου</legend><div className="avatar-options">{avatarIndexes.map(index => {
        const label = avatarLabels[index]
        const isSelected = avatar === index
        return <label key={label} className={`avatar-option ${isSelected ? 'is-selected' : ''}`}><input type="radio" name="avatar" value={index} checked={isSelected} onChange={() => onAvatarChange(index)} /><Avatar index={index} /><span>{label}</span><span className="selection-mark" aria-hidden="true">{isSelected ? '✓' : ''}</span></label>
      })}</div></fieldset>
      <div className="nickname-field">
        <label htmlFor="nickname">Το ψευδώνυμό σου</label>
        <p id="nickname-help">Κάτι που θα θυμάσαι. Δεν χρειάζεται το αληθινό σου όνομα.</p>
        <input ref={nicknameInput} id="nickname" name="nickname" value={nickname} onChange={event => onNicknameChange(event.target.value)} maxLength={NICKNAME_MAX_LENGTH} autoComplete="off" spellCheck="false" placeholder="π.χ. Αστερίας" aria-invalid={Boolean(error)} aria-describedby={`nickname-help nickname-count${error ? ' nickname-error' : ''}`} />
        <div className="field-bottom"><span id="nickname-error" className="field-error" role="alert">{error}</span><span id="nickname-count">{nickname.length}/{NICKNAME_MAX_LENGTH}</span></div>
      </div>
      <button className="button primary form-submit" type="submit">Πάμε στο νησί <Icon kind="arrow" /></button>
      <p className="privacy-note">Στην προεπισκόπηση, το προφίλ είναι προσωρινό.</p>
    </form>
  </>
}
