import { Navigate, Outlet } from 'react-router'
import { useProfiles } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'

/** Sends visitors without a chosen profile back to the chooser. */
export function RequireProfile() {
  const { currentProfile } = useProfiles()
  return currentProfile ? <Outlet /> : <Navigate to={paths.chooseProfile} replace />
}
