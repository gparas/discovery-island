import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

function setup() {
  const user = userEvent.setup()
  render(<App />)
  return user
}

const panelHeading = () => screen.getByRole('heading', { level: 2 })
const welcomeHeading = () => screen.getByRole('heading', { level: 1 })
const profileButtons = () => within(screen.getByRole('region', { name: /Διάλεξε το προφίλ σου|Το πρώτο σου προφίλ/ })).queryAllByRole('button', { name: /, / })

async function openForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Νέο προφίλ' }))
}

describe('App', () => {
  it('shows the example profiles without moving focus on first render', () => {
    setup()
    expect(welcomeHeading()).toHaveTextContent('Ποιος εξερευνάσήμερα;')
    expect(panelHeading()).toHaveTextContent('Διάλεξε το προφίλ σου')
    expect(profileButtons()).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Ελένη, Καραβάκι' })).toBeInTheDocument()
    expect(document.body).toHaveFocus()
  })

  it('greets the selected profile and focuses the panel heading', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Μαρία, Κοχύλι' }))
    expect(panelHeading()).toHaveTextContent('Γεια σου, Μαρία!')
    expect(panelHeading()).toHaveFocus()
    expect(welcomeHeading()).toHaveTextContent('Έτοιμοι γιαανακαλύψεις;')

    await user.click(screen.getByRole('button', { name: 'Πίσω στα προφίλ' }))
    expect(panelHeading()).toHaveTextContent('Διάλεξε το προφίλ σου')
    expect(panelHeading()).toHaveFocus()
  })

  it('opens the creation form with its heading focused', async () => {
    const user = setup()
    await openForm(user)
    expect(panelHeading()).toHaveTextContent('Φτιάξε το προφίλ σου')
    expect(panelHeading()).toHaveFocus()
    expect(welcomeHeading()).toHaveTextContent('Η περιπέτειαξεκινά εδώ.')
    expect(screen.getByRole('radio', { name: 'Καραβάκι' })).toBeChecked()
  })

  it('reports an empty nickname and returns focus to the field', async () => {
    const user = setup()
    await openForm(user)
    await user.click(screen.getByRole('button', { name: 'Πάμε στο νησί' }))
    const nickname = screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' })
    expect(screen.getByRole('alert')).toHaveTextContent('Γράψε ένα ψευδώνυμο για το προφίλ σου.')
    expect(nickname).toHaveFocus()
    expect(nickname).toHaveAttribute('aria-invalid', 'true')
    expect(nickname).toHaveAccessibleDescription(/Γράψε ένα ψευδώνυμο/)

    await user.type(nickname, 'Α')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
    expect(nickname).toHaveAttribute('aria-invalid', 'false')
  })

  it('rejects a nickname that already exists', async () => {
    const user = setup()
    await openForm(user)
    await user.type(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' }), 'ΝΊΚΟΣ{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent('Αυτό το ψευδώνυμο υπάρχει ήδη.')
    expect(panelHeading()).toHaveTextContent('Φτιάξε το προφίλ σου')
  })

  it('counts nickname characters up to the 24-character limit', async () => {
    const user = setup()
    await openForm(user)
    const nickname = screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' })
    await user.type(nickname, 'Αστερίας')
    expect(screen.getByText('8/24')).toBeInTheDocument()
    await user.type(nickname, 'α'.repeat(30))
    expect(nickname).toHaveValue(`Αστερίας${'α'.repeat(16)}`)
    expect(screen.getByText('24/24')).toBeInTheDocument()
  })

  it('creates a profile with the chosen avatar and adds it to the chooser', async () => {
    const user = setup()
    await openForm(user)
    await user.click(screen.getByRole('radio', { name: 'Ήλιος' }))
    expect(screen.getByRole('radio', { name: 'Ήλιος' })).toBeChecked()
    await user.type(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' }), '  Αστερίας  ')
    await user.click(screen.getByRole('button', { name: 'Πάμε στο νησί' }))

    expect(panelHeading()).toHaveTextContent('Γεια σου, Αστερίας!')
    expect(panelHeading()).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Πίσω στα προφίλ' }))
    expect(profileButtons()).toHaveLength(7)
    expect(screen.getByRole('button', { name: 'Αστερίας, Ήλιος' })).toBeInTheDocument()

    await openForm(user)
    expect(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' })).toHaveValue('')
  })

  it('keeps a typed nickname when leaving and reopening the form', async () => {
    const user = setup()
    await openForm(user)
    await user.type(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' }), 'Αστ')
    await user.click(screen.getByRole('button', { name: 'Πίσω στα προφίλ' }))
    await openForm(user)
    expect(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' })).toHaveValue('Αστ')
  })

  it('switches between the first-visit and example previews', async () => {
    const user = setup()
    await openForm(user)
    await user.type(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' }), 'Αστ')
    await user.click(screen.getByRole('button', { name: 'Πρώτη επίσκεψη' }))

    expect(panelHeading()).toHaveTextContent('Το πρώτο σου προφίλ')
    expect(profileButtons()).toHaveLength(0)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Κάθε εξερευνητής,η δική του αρχή.')

    await user.click(screen.getByRole('button', { name: 'Δημιούργησε προφίλ' }))
    expect(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' })).toHaveValue('')
    await user.type(screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' }), 'Ελένη{Enter}')
    expect(panelHeading()).toHaveTextContent('Γεια σου, Ελένη!')

    await user.click(screen.getByRole('button', { name: 'Με προφίλ' }))
    expect(profileButtons()).toHaveLength(6)
  })

  it('returns to the chooser from the brand link', async () => {
    const user = setup()
    await openForm(user)
    await user.click(screen.getByRole('link', { name: /Το Νησί των/ }))
    expect(panelHeading()).toHaveTextContent('Διάλεξε το προφίλ σου')
  })
})
