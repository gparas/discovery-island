import { Navigate, type RouteObject } from 'react-router'
import { ProfileChooser } from '../components/ProfileChooser.tsx'
import { ProfileForm } from '../components/ProfileForm.tsx'
import { RequireProfile } from '../layouts/RequireProfile.tsx'
import { RootLayout } from '../layouts/RootLayout.tsx'
import { SiteLayout } from '../layouts/SiteLayout.tsx'
import { WelcomeLayout } from '../layouts/WelcomeLayout.tsx'
import { MapPage } from '../pages/MapPage.tsx'
import { MissionPage } from '../pages/MissionPage.tsx'
import { TopicPage } from '../pages/TopicPage.tsx'
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
          {
            element: <SiteLayout explorer />,
            children: [
              { path: paths.map, element: <MapPage /> },
              { path: paths.topicPattern, element: <TopicPage /> },
            ],
          },
          { path: paths.missionPattern, element: <MissionPage /> },
        ],
      },
      // The island stand-in and its mission URLs moved to the map.
      { path: '/island/*', element: <Navigate to={paths.map} replace /> },
      { path: '*', element: <Navigate to={paths.chooseProfile} replace /> },
    ],
  },
]
