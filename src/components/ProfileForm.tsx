import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { avatarIndexes, avatarLabels, NICKNAME_MAX_LENGTH } from '../profiles/profiles.ts'
import { useProfiles } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import { Avatar } from './Avatar.tsx'
import { BackLink } from './BackLink.tsx'
import { Icon } from './Icon.tsx'

export function ProfileForm() {
  const { draft: { nickname, avatar }, setNickname, setAvatar, submitDraft } = useProfiles()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  const nicknameInput = useRef<HTMLInputElement>(null)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = submitDraft()
    if (result.ok) { void navigate(paths.island); return }
    setError(result.error)
    nicknameInput.current?.focus()
  }
  return <>
    <BackLink className="back-button" to={paths.chooseProfile}>Πίσω στα προφίλ</BackLink>
    <h2 id="panel-title" className="form-title" ref={heading} tabIndex={-1}>Φτιάξε το προφίλ σου</h2>
    <form onSubmit={handleSubmit} noValidate>
      <fieldset><legend>Διάλεξε την εικόνα σου</legend><div className="avatar-options">{avatarIndexes.map(index => {
        const label = avatarLabels[index]
        const isSelected = avatar === index
        return <label key={label} className={`avatar-option ${isSelected ? 'is-selected' : ''}`}><input type="radio" name="avatar" value={index} checked={isSelected} onChange={() => setAvatar(index)} /><Avatar index={index} /><span>{label}</span><span className="selection-mark" aria-hidden="true">{isSelected ? '✓' : ''}</span></label>
      })}</div></fieldset>
      <div className="nickname-field">
        <label htmlFor="nickname">Το ψευδώνυμό σου</label>
        <p id="nickname-help">Κάτι που θα θυμάσαι. Δεν χρειάζεται το αληθινό σου όνομα.</p>
        <input ref={nicknameInput} id="nickname" name="nickname" value={nickname} onChange={event => { setNickname(event.target.value); setError('') }} maxLength={NICKNAME_MAX_LENGTH} autoComplete="off" spellCheck="false" placeholder="π.χ. Αστερίας" aria-invalid={Boolean(error)} aria-describedby={`nickname-help nickname-count${error ? ' nickname-error' : ''}`} />
        <div className="field-bottom"><span id="nickname-error" className="field-error" role="alert">{error}</span><span id="nickname-count">{nickname.length}/{NICKNAME_MAX_LENGTH}</span></div>
      </div>
      <button className="button primary form-submit" type="submit">Πάμε στο νησί <Icon kind="arrow" /></button>
      <p className="privacy-note">Στην προεπισκόπηση, το προφίλ είναι προσωρινό.</p>
    </form>
  </>
}
