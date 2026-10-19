import { Navigate, type RouteObject } from 'react-router'
import { ProfileChooser } from '../components/ProfileChooser.tsx'
import { ProfileForm } from '../components/ProfileForm.tsx'
import { RequireProfile } from '../layouts/RequireProfile.tsx'
import { RootLayout } from '../layouts/RootLayout.tsx'
import { SiteLayout } from '../layouts/SiteLayout.tsx'
import { WelcomeLayout } from '../layouts/WelcomeLayout.tsx'
import { IslandPage } from '../pages/IslandPage.tsx'
import { MissionPage } from '../pages/MissionPage.tsx'
import { paths } from './paths.ts'

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        element: <SiteLayout />,
        children: [{
          element: <WelcomeLayout />,
          children: [
            { path: paths.chooseProfile, element: <ProfileChooser /> },
            { path: paths.newProfile, element: <ProfileForm /> },
          ],
        }],
      },
      {
        element: <RequireProfile />,
        children: [
          { element: <SiteLayout />, children: [{ path: paths.island, element: <IslandPage /> }] },
          { path: paths.missionPattern, element: <MissionPage /> },
        ],
      },
      { path: '*', element: <Navigate to={paths.chooseProfile} replace /> },
    ],
  },
]
