import { useEffect, useRef, useState } from 'react'

const avatars = ['Καραβάκι', 'Φάρος', 'Κοχύλι', 'Φύλλο', 'Ήλιος', 'Ψαράκι']
const examples = ['Ελένη', 'Νίκος', 'Μαρία', 'Άρης', 'Δανάη', 'Πέτρος'].map((name, avatar) => ({ id: `sample-${avatar}`, name, avatar }))

function Avatar({ index, large = false }) {
  return <span className={`avatar avatar-${index}${large ? ' avatar-large' : ''}`} aria-hidden="true"><span className="avatar-art" style={{ backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%` }} /></span>
}
function Icon({ kind }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind === 'plus' ? <path d="M12 5v14M5 12h14" /> : kind === 'back' ? <path d="m10 5-7 7 7 7M3 12h18" /> : <path d="m14 5 7 7-7 7M21 12H3" />}</svg>
}

export default function App() {
  const [profiles, setProfiles] = useState(examples)
  const [view, setView] = useState('choose')
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(0)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const heading = useRef(null)
  const nicknameInput = useRef(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    heading.current?.focus()
  }, [view])
  function openForm() { setError(''); setView('create') }
  function selectProfile(profile) { setSelected(profile); setView('selected') }
  function resetPreview(empty) {
    setProfiles(empty ? [] : examples)
    setNickname(''); setAvatar(0); setError(''); setSelected(null); setView('choose')
  }
  function createProfile(event) {
    event.preventDefault()
    const name = nickname.trim()
    if (!name) { setError('Γράψε ένα ψευδώνυμο για το προφίλ σου.'); nicknameInput.current?.focus(); return }
    if (profiles.some(profile => profile.name.toLocaleLowerCase('el') === name.toLocaleLowerCase('el'))) {
      setError('Αυτό το ψευδώνυμο υπάρχει ήδη. Διάλεξε ένα διαφορετικό.'); nicknameInput.current?.focus(); return
    }
    const profile = { id: crypto.randomUUID(), name, avatar }
    setProfiles(previous => [...previous, profile]); setNickname(''); selectProfile(profile)
  }
  const isEmpty = profiles.length === 0
  return <>
    <a className="skip-link" href="#main">Πήγαινε στο περιεχόμενο</a>
    <aside className="preview-bar" aria-label="Εργαλεία προεπισκόπησης">
      <span><strong>Προεπισκόπηση σχεδίου</strong><span className="preview-description"> · Δοκιμαστικά προφίλ, χωρίς αποθήκευση</span></span>
      <div><button type="button" onClick={() => resetPreview(false)}>Με προφίλ</button><button type="button" onClick={() => resetPreview(true)}>Πρώτη επίσκεψη</button></div>
    </aside>
    <header className="site-header"><a className="brand" href="#main" onClick={() => setView('choose')}><span className="brand-mark" aria-hidden="true"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M15 1 3 17h9l-2 12 13-18h-9z" fill="currentColor" /></svg></span><span>Το Νησί των<br />Ανακαλύψεων</span></a><span className="header-note">Μικρές απορίες.<br />Μεγάλες ανακαλύψεις.</span></header>
    <main id="main" className="profile-layout">
      <section className="welcome" aria-labelledby="welcome-title">
        <div className="welcome-copy"><h1 id="welcome-title">{view === 'create' ? <>Η περιπέτεια<br /><span>ξεκινά εδώ.</span></> : view === 'selected' ? <>Έτοιμοι για<br /><span>ανακαλύψεις;</span></> : <>Ποιος εξερευνά<br /><span>σήμερα;</span></>}</h1><p>{view === 'create' ? 'Ένα ψευδώνυμο και μια εικόνα. Κάτι δικό σου, για κάθε ανακάλυψη.' : view === 'selected' ? 'Η Σπίθα σε περιμένει για την επόμενη ανακάλυψη.' : 'Είμαι η Σπίθα! Διάλεξε το προφίλ σου και έλα να εξερευνήσουμε μαζί.'}</p></div>
        <img className="mascot" src="/assets/spitha.webp" alt="Η Σπίθα, το χαμογελαστό ρομπότ που μας καθοδηγεί" width="480" height="480" />
      </section>
      <section className="profile-panel" aria-labelledby="panel-title">
        {view === 'choose' && <>
          <h2 id="panel-title" className="panel-title" ref={heading} tabIndex="-1">{isEmpty ? 'Το πρώτο σου προφίλ' : 'Διάλεξε το προφίλ σου'}</h2>
          {isEmpty ? <div className="empty-state"><div className="empty-avatars"><Avatar index={0} /><Avatar index={2} /><Avatar index={5} /></div><h3>Κάθε εξερευνητής,<br />η δική του αρχή.</h3><p>Διάλεξε μια εικόνα από το νησί και ένα ψευδώνυμο που θα αναγνωρίζεις.</p><button className="button primary" onClick={openForm}>Δημιούργησε προφίλ <Icon kind="arrow" /></button></div> : <><div className="profile-grid">{profiles.map(profile => <button className="profile-choice" key={profile.id} onClick={() => selectProfile(profile)} aria-label={`${profile.name}, ${avatars[profile.avatar]}`}><Avatar index={profile.avatar} /><span className="profile-name">{profile.name}</span><span className="choice-arrow"><Icon kind="arrow" /></span></button>)}</div><button className="button new-profile" onClick={openForm}><Icon kind="plus" /> Νέο προφίλ</button></>}
          <p className="privacy-note">Χωρίς email ή κωδικό. Ένα ψευδώνυμο αρκεί.</p>
        </>}
        {view === 'create' && <>
          <button className="back-button" onClick={() => setView('choose')}><Icon kind="back" /> Πίσω στα προφίλ</button>
          <h2 id="panel-title" className="form-title" ref={heading} tabIndex="-1">Φτιάξε το προφίλ σου</h2>
          <form onSubmit={createProfile} noValidate>
            <fieldset><legend>Διάλεξε την εικόνα σου</legend><div className="avatar-options">{avatars.map((label, index) => <label key={label} className={`avatar-option ${avatar === index ? 'is-selected' : ''}`}><input type="radio" name="avatar" value={index} checked={avatar === index} onChange={() => setAvatar(index)} /><Avatar index={index} /><span>{label}</span><span className="selection-mark" aria-hidden="true">{avatar === index ? '✓' : ''}</span></label>)}</div></fieldset>
            <div className="nickname-field"><label htmlFor="nickname">Το ψευδώνυμό σου</label><p id="nickname-help">Κάτι που θα θυμάσαι. Δεν χρειάζεται το αληθινό σου όνομα.</p><input ref={nicknameInput} id="nickname" name="nickname" value={nickname} onChange={event => { setNickname(event.target.value); setError('') }} maxLength={24} autoComplete="off" spellCheck="false" placeholder="π.χ. Αστερίας" aria-invalid={Boolean(error)} aria-describedby={`nickname-help nickname-count${error ? ' nickname-error' : ''}`} /><div className="field-bottom"><span id="nickname-error" className="field-error" role="alert">{error}</span><span id="nickname-count">{nickname.length}/24</span></div></div>
            <button className="button primary form-submit" type="submit">Πάμε στο νησί <Icon kind="arrow" /></button>
            <p className="privacy-note">Στην προεπισκόπηση, το προφίλ είναι προσωρινό.</p>
          </form>
        </>}
        {view === 'selected' && selected && <div className="selected-state"><Avatar index={selected.avatar} large /><h2 id="panel-title" ref={heading} tabIndex="-1">Γεια σου, {selected.name}!</h2><p>Το προφίλ σου επιλέχθηκε.</p><p className="preview-next">Η προεπισκόπηση τελειώνει εδώ.<br />Επόμενη οθόνη: ο χάρτης του νησιού.</p><button className="button primary" onClick={() => setView('choose')}><Icon kind="back" /> Πίσω στα προφίλ</button></div>}
      </section>
    </main>
    <footer className="site-footer"><span>Ένας ολόκληρος κόσμος για να τον ανακαλύψεις.</span><span>Με τη Σπίθα, βήμα βήμα.</span></footer>
  </>
}
