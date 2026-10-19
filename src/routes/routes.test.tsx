import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { paths } from './paths.ts'
import { routes } from './routes.tsx'

function setup(initialPath: string = paths.chooseProfile) {
  const user = userEvent.setup()
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  render(<RouterProvider router={router} />)
  return {
    user,
    path: () => router.state.location.pathname,
    navigate: (to: string) => act(() => router.navigate(to)),
  }
}

type User = ReturnType<typeof userEvent.setup>

const panelHeading = () => screen.getByRole('heading', { level: 2 })
const welcomeHeading = () => screen.getByRole('heading', { level: 1 })
const profileButtons = () => within(screen.getByRole('region', { name: /Διάλεξε το προφίλ σου|Το πρώτο σου προφίλ/ })).queryAllByRole('button', { name: /, / })
const nicknameField = () => screen.getByRole('textbox', { name: 'Το ψευδώνυμό σου' })

async function openForm(user: User) {
  await user.click(screen.getByRole('link', { name: 'Νέο προφίλ' }))
}

describe('profile selection route', () => {
  it('shows the example profiles without moving focus on first load', () => {
    const { path } = setup()
    expect(path()).toBe('/')
    expect(welcomeHeading()).toHaveTextContent('Ποιος εξερευνάσήμερα;')
    expect(panelHeading()).toHaveTextContent('Διάλεξε το προφίλ σου')
    expect(profileButtons()).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Ελένη, Καραβάκι' })).toBeInTheDocument()
    expect(document.body).toHaveFocus()
  })

  it('enters the map with the chosen profile', async () => {
    const { user, path } = setup()
    await user.click(screen.getByRole('button', { name: 'Μαρία, Κοχύλι' }))
    expect(path()).toBe('/map')
    expect(welcomeHeading()).toHaveTextContent('Πού θα εξερευνήσεις σήμερα;')
    expect(welcomeHeading()).toHaveFocus()
    expect(screen.getByText('Μαρία')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Άλλαξε προφίλ' }))
    expect(path()).toBe('/')
    expect(panelHeading()).toHaveFocus()
  })

  it('returns to the chooser from the brand link', async () => {
    const { user, path } = setup(paths.newProfile)
    await user.click(screen.getByRole('link', { name: /Το Νησί των/ }))
    expect(path()).toBe('/')
    expect(panelHeading()).toHaveTextContent('Διάλεξε το προφίλ σου')
  })
})

describe('profile creation route', () => {
  it('keeps the welcome layout and focuses the form heading', async () => {
    const { user, path } = setup()
    await openForm(user)
    expect(path()).toBe('/profiles/new')
    expect(panelHeading()).toHaveTextContent('Φτιάξε το προφίλ σου')
    expect(panelHeading()).toHaveFocus()
    expect(welcomeHeading()).toHaveTextContent('Η περιπέτειαξεκινά εδώ.')
    expect(screen.getByRole('img', { name: /Σπίθα/ })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Καραβάκι' })).toBeChecked()
  })

  it('opens directly from its URL', () => {
    setup(paths.newProfile)
    expect(panelHeading()).toHaveTextContent('Φτιάξε το προφίλ σου')
  })

  it('reports an empty nickname and returns focus to the field', async () => {
    const { user, path } = setup(paths.newProfile)
    await user.click(screen.getByRole('button', { name: 'Πάμε στο νησί' }))
    expect(path()).toBe('/profiles/new')
    expect(screen.getByRole('alert')).toHaveTextContent('Γράψε ένα ψευδώνυμο για το προφίλ σου.')
    expect(nicknameField()).toHaveFocus()
    expect(nicknameField()).toHaveAttribute('aria-invalid', 'true')
    expect(nicknameField()).toHaveAccessibleDescription(/Γράψε ένα ψευδώνυμο/)

    await user.type(nicknameField(), 'Α')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
    expect(nicknameField()).toHaveAttribute('aria-invalid', 'false')
  })

  it('rejects a nickname that already exists', async () => {
    const { user, path } = setup(paths.newProfile)
    await user.type(nicknameField(), 'ΝΊΚΟΣ{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent('Αυτό το ψευδώνυμο υπάρχει ήδη.')
    expect(path()).toBe('/profiles/new')
  })

  it('counts nickname characters up to the 24-character limit', async () => {
    const { user } = setup(paths.newProfile)
    await user.type(nicknameField(), 'Αστερίας')
    expect(screen.getByText('8/24')).toBeInTheDocument()
    await user.type(nicknameField(), 'α'.repeat(30))
    expect(nicknameField()).toHaveValue(`Αστερίας${'α'.repeat(16)}`)
    expect(screen.getByText('24/24')).toBeInTheDocument()
  })

  it('creates a profile, enters the map and lists it in the chooser', async () => {
    const { user, path } = setup()
    await openForm(user)
    await user.click(screen.getByRole('radio', { name: 'Ήλιος' }))
    await user.type(nicknameField(), '  Αστερίας  ')
    await user.click(screen.getByRole('button', { name: 'Πάμε στο νησί' }))

    expect(path()).toBe('/map')
    expect(screen.getByText('Αστερίας')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Άλλαξε προφίλ' }))
    expect(profileButtons()).toHaveLength(7)
    expect(screen.getByRole('button', { name: 'Αστερίας, Ήλιος' })).toBeInTheDocument()

    await openForm(user)
    expect(nicknameField()).toHaveValue('')
  })

  it('keeps the draft but clears the error when leaving and returning', async () => {
    const { user } = setup(paths.newProfile)
    await user.type(nicknameField(), 'Νίκος{Enter}')
    expect(screen.getByRole('alert')).not.toBeEmptyDOMElement()
    await user.click(screen.getByRole('link', { name: 'Πίσω στα προφίλ' }))
    await openForm(user)
    expect(nicknameField()).toHaveValue('Νίκος')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
  })
})

describe('preview controls', () => {
  it('switches between the first-visit and example previews from any route', async () => {
    const { user, path } = setup(paths.newProfile)
    await user.type(nicknameField(), 'Αστ')
    await user.click(screen.getByRole('button', { name: 'Πρώτη επίσκεψη' }))

    expect(path()).toBe('/')
    expect(panelHeading()).toHaveTextContent('Το πρώτο σου προφίλ')
    expect(profileButtons()).toHaveLength(0)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Κάθε εξερευνητής,η δική του αρχή.')

    await user.click(screen.getByRole('link', { name: 'Δημιούργησε προφίλ' }))
    expect(nicknameField()).toHaveValue('')
    await user.type(nicknameField(), 'Ελένη{Enter}')
    expect(path()).toBe('/map')

    await user.click(screen.getByRole('button', { name: 'Με προφίλ' }))
    expect(path()).toBe('/')
    expect(profileButtons()).toHaveLength(6)
  })

  it('forgets the current profile on reset', async () => {
    const { user, navigate, path } = setup()
    await user.click(screen.getByRole('button', { name: 'Ελένη, Καραβάκι' }))
    await user.click(screen.getByRole('button', { name: 'Με προφίλ' }))
    await navigate(paths.map)
    expect(path()).toBe('/')
  })
})

describe('profile-only routes', () => {
  it.each([paths.map, paths.topic('electricity'), paths.mission('electricity', 'light-the-bulb')])('redirects %s to the chooser without a profile', path => {
    const { path: current } = setup(path)
    expect(current()).toBe('/')
    expect(panelHeading()).toHaveTextContent('Διάλεξε το προφίλ σου')
  })

  it('redirects the old island URLs and unknown topics or missions', async () => {
    const { user, navigate, path } = setup()
    await user.click(screen.getByRole('button', { name: 'Νίκος, Φάρος' }))
    await navigate('/island/missions/electricity')
    expect(path()).toBe('/map')
    await navigate('/map/volcanoes')
    expect(path()).toBe('/map')
    await navigate('/map/electricity/volcanoes')
    expect(path()).toBe('/map/electricity')
  })
})

it('redirects unknown URLs to the chooser', () => {
  const { path } = setup('/nowhere')
  expect(path()).toBe('/')
})
