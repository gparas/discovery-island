import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { paths } from '../../routes/paths.ts'
import { routes } from '../../routes/routes.tsx'

type User = ReturnType<typeof userEvent.setup>

async function openLesson() {
  const user = userEvent.setup()
  const router = createMemoryRouter(routes, { initialEntries: [paths.chooseProfile] })
  render(<RouterProvider router={router} />)
  await user.click(screen.getByRole('button', { name: 'Νίκος, Φάρος' }))
  await user.click(screen.getByRole('link', { name: /Ηλεκτρισμός/ }))
  await user.click(screen.getByRole('link', { name: 'Ξεκίνα την αποστολή' }))
  return { user, path: () => router.state.location.pathname }
}

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const status = (text: string | RegExp) => screen.getAllByRole('status').find(element => element.textContent.match(text))

async function connect(user: User, from: string, to: string) {
  await user.click(button(from))
  await user.click(button(to))
}

async function reachBuild(user: User) {
  await user.click(button('Ας εξερευνήσουμε!'))
  await user.click(screen.getByRole('radio', { name: 'Δεν είμαι σίγουρος/η' }))
  await user.click(button('Ας το δοκιμάσουμε'))
}

describe('electricity lesson', () => {
  it('asks for a prediction without revealing the outcome', async () => {
    const { user } = await openLesson()
    await user.click(button('Ας εξερευνήσουμε!'))
    const question = screen.getByRole('heading', { level: 2, name: 'Θα ανάψει η λάμπα με αυτή τη σύνδεση;' })
    expect(question).toHaveFocus()
    expect(screen.queryByText('Η λάμπα είναι σβηστή')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ας το δοκιμάσουμε' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Όχι' }))
    expect(button('Ας το δοκιμάσουμε')).toBeInTheDocument()
  })

  it('keeps the first wire, explains rejected wires and lights the bulb', async () => {
    const { user } = await openLesson()
    await reachBuild(user)

    expect(screen.getByText('Η πρόβλεψή σου: Δεν είμαι σίγουρος/η')).toBeInTheDocument()
    expect(screen.getByText('Θετικός πόλος μπαταρίας με επαφή Α της λάμπας.')).toBeInTheDocument()
    expect(status('Με αυτή τη σύνδεση, η λάμπα μένει σβηστή.')).toBeDefined()

    await user.click(button('Αρνητικός πόλος μπαταρίας'))
    expect(button('Αρνητικός πόλος μπαταρίας')).toHaveAttribute('aria-pressed', 'true')
    expect(status('Τώρα διάλεξε τη δεύτερη επαφή.')).toBeDefined()
    await user.click(button('Επαφή Α της λάμπας'))
    expect(status(/ενώνει τους πόλους της μπαταρίας/)).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Γιατί άναψε;' })).not.toBeInTheDocument()

    await connect(user, 'Αρνητικός πόλος μπαταρίας', 'Επαφή Β της λάμπας')
    expect(status('Η λάμπα είναι αναμμένη')).toBeDefined()
    expect(status('Η λάμπα άναψε! Ας δούμε τι άλλαξε.')).toBeDefined()

    await user.click(button('Αναίρεση'))
    expect(status('Η λάμπα είναι σβηστή')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Γιατί άναψε;' })).not.toBeInTheDocument()
  })

  it('offers graded help ending in an optional demonstration', async () => {
    const { user } = await openLesson()
    await reachBuild(user)
    await user.click(button('Βοήθεια'))
    expect(status(/Ποιες επαφές δεν έχουν συνδεθεί ακόμη;/)).toBeDefined()
    await user.click(button('Βοήθεια'))
    expect(status('Δοκίμασε να ενώσεις αυτές τις δύο επαφές. Αρνητικός πόλος μπαταρίας και επαφή Β της λάμπας.')).toBeDefined()
    await user.click(button('Βοήθεια'))
    await user.click(button('Δείξε μου μία σύνδεση'))
    expect(status('Η λάμπα είναι αναμμένη')).toBeDefined()
  })

  it('runs from explanation through the fresh challenge to completion and replay', async () => {
    const { user, path } = await openLesson()
    await reachBuild(user)
    await connect(user, 'Αρνητικός πόλος μπαταρίας', 'Επαφή Β της λάμπας')
    await user.click(button('Γιατί άναψε;'))

    expect(screen.getByRole('heading', { level: 2, name: 'Γιατί άναψε η λάμπα;' })).toHaveFocus()
    await user.click(screen.getByRole('radio', { name: 'Επειδή η λάμπα βρίσκεται κοντά στην μπαταρία.' }))
    await user.click(button('Έλεγξε την απάντηση'))
    expect(status(/Η απόσταση από την μπαταρία δεν αρκεί/)).toBeDefined()
    await user.click(screen.getByRole('radio', { name: /ολόκληρη διαδρομή/ }))
    await user.click(button('Έλεγξε την απάντηση'))
    expect(status(/Ακριβώς!/)).toHaveTextContent('Η διαδρομή: θετικός πόλος → επαφή Α της λάμπας → μέσα από τη λάμπα → επαφή Β της λάμπας → αρνητικός πόλος.')
    await user.click(button('Μια νέα δοκιμή'))

    expect(screen.getByText('Δεν υπάρχουν συνδεδεμένα καλώδια.')).toBeInTheDocument()
    expect(status('Δεν έχει δοκιμαστεί ακόμη')).toBeDefined()
    await connect(user, 'Θετικός πόλος μπαταρίας', 'Επαφή Β της λάμπας')
    await user.click(button('Δοκίμασε το κύκλωμα'))
    expect(status(/Η λάμπα δεν άναψε ακόμη/)).toBeDefined()
    await connect(user, 'Αρνητικός πόλος μπαταρίας', 'Επαφή Α της λάμπας')
    expect(status('Οι συνδέσεις άλλαξαν. Δοκίμασε ξανά.')).toBeDefined()
    await user.click(button('Δοκίμασε το κύκλωμα'))
    expect(status(/Η λάμπα άναψε ξανά!/)).toBeDefined()
    await user.click(button('Τι ανακαλύψαμε;'))

    expect(screen.getByRole('heading', { level: 2, name: 'Ολοκλήρωσες την αποστολή!' })).toHaveFocus()
    await user.click(button('Παίξε ξανά'))
    expect(button('Ας εξερευνήσουμε!')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Πίσω στον Ηλεκτρισμό' }))
    expect(path()).toBe('/map/electricity')
  })

  it('resumes the same stage after leaving the lesson', async () => {
    const { user } = await openLesson()
    await reachBuild(user)
    await user.click(screen.getByRole('link', { name: 'Πίσω στον Ηλεκτρισμό' }))
    await user.click(screen.getByRole('link', { name: 'Συνέχισε την αποστολή' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Μπορείς να αλλάξεις τις συνδέσεις ώστε να ανάψει;' })).toBeInTheDocument()
  })
})
