import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { paths } from '../routes/paths.ts'
import { routes } from '../routes/routes.tsx'

async function enterMap() {
  const user = userEvent.setup()
  const router = createMemoryRouter(routes, { initialEntries: [paths.chooseProfile] })
  render(<RouterProvider router={router} />)
  await user.click(screen.getByRole('button', { name: 'Νίκος, Φάρος' }))
  return { user, path: () => router.state.location.pathname, navigate: (to: string) => act(() => router.navigate(to)) }
}

const station = (name: RegExp) => screen.getByRole('button', { name })

describe('map', () => {
  it('shows five open topics with their progress', async () => {
    await enterMap()
    const islets = screen.getAllByRole('listitem')
    expect(islets).toHaveLength(5)
    expect(screen.getByRole('link', { name: 'Ηλεκτρισμός, 0 από 3 αποστολές' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Φως, Σύντομα' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Συνέχισε την αποστολή/ })).not.toBeInTheDocument()
  })

  it('features the selected topic in Σπίθα’s panel', async () => {
    const { user } = await enterMap()
    const panel = () => screen.getByRole('region', { name: /Ηλεκτρισμός|Ήχος/ })
    expect(panel()).toHaveTextContent('Ανακάλυψε τι χρειάζεται μια λάμπα για να ανάψει.')
    expect(screen.getByRole('link', { name: 'Εξερεύνησε' })).toHaveAttribute('href', '/map/electricity')

    await user.hover(screen.getByRole('link', { name: 'Ήχος, Σύντομα' }))
    expect(panel()).toHaveTextContent('Οι αποστολές για αυτό το θέμα ετοιμάζονται.')
    expect(screen.getByRole('link', { name: 'Εξερεύνησε' })).toHaveAttribute('href', '/map/sound')
  })

  it('opens a topic without missions as a coming-soon page', async () => {
    const { user, path } = await enterMap()
    await user.click(screen.getByRole('link', { name: /Ήχος/ }))
    expect(path()).toBe('/map/sound')
    expect(screen.getByRole('heading', { level: 1, name: 'Ήχος' })).toHaveFocus()
    expect(screen.getByRole('heading', { level: 2, name: 'Σύντομα' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('link', { name: 'Πίσω στον χάρτη' })[0]!)
    expect(path()).toBe('/map')
  })
})

describe('topic map', () => {
  it('lists missions as stations, locking those that need the first one', async () => {
    const { user } = await enterMap()
    await user.click(screen.getByRole('link', { name: /Ηλεκτρισμός/ }))

    expect(screen.getByRole('heading', { level: 2, name: 'Το μονοπάτι σου 0 / 3' })).toBeInTheDocument()
    expect(station(/^Άναψε τη λάμπα,/)).toHaveAttribute('aria-pressed', 'true')
    expect(station(/^Άναψε τη λάμπα,/)).toHaveTextContent('Έτοιμη για εξερεύνηση')
    expect(screen.getByRole('img', { name: 'Η Σπίθα είναι εδώ' })).toBeInTheDocument()
    expect(station(/^Ποιο υλικό βοηθά;,/)).toHaveTextContent('Πρώτα: Άναψε τη λάμπα')

    await user.click(station(/^Έλεγξε το φως,/))
    expect(screen.getByRole('heading', { level: 2, name: 'Έλεγξε το φως' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ξεκίνα την αποστολή' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Πήγαινε στο «Άναψε τη λάμπα»' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Άναψε τη λάμπα' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ξεκίνα την αποστολή' })).toHaveAttribute('href', '/map/electricity/light-the-bulb')
  })

  it('offers to resume a mission under way from the map and the topic', async () => {
    const { user, path } = await enterMap()
    await user.click(screen.getByRole('link', { name: /Ηλεκτρισμός/ }))
    await user.click(screen.getByRole('link', { name: 'Ξεκίνα την αποστολή' }))
    await user.click(screen.getByRole('button', { name: 'Ας εξερευνήσουμε!' }))
    await user.click(screen.getByRole('link', { name: 'Πίσω στον Ηλεκτρισμό' }))

    expect(station(/^Άναψε τη λάμπα,/)).toHaveTextContent('Σε εξέλιξη')
    await user.click(screen.getAllByRole('link', { name: 'Πίσω στον χάρτη' })[0]!)
    await user.click(screen.getByRole('link', { name: /Συνέχισε την αποστολή: Άναψε τη λάμπα/ }))
    expect(path()).toBe('/map/electricity/light-the-bulb')
  })

  it('explains a locked or unfinished mission reached by URL', async () => {
    const { navigate } = await enterMap()
    await navigate(paths.mission('electricity', 'materials'))
    expect(screen.getByRole('heading', { level: 1, name: 'Ποιο υλικό βοηθά;' })).toBeInTheDocument()
    expect(screen.getByText('Πρώτα: Άναψε τη λάμπα')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Πίσω στον Ηλεκτρισμό' })).toHaveAttribute('href', '/map/electricity')
  })
})
