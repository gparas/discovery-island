import { generatePath } from 'react-router'
import type { MissionId } from '../types.ts'

const missionPattern = '/island/missions/:missionId'

export const paths = {
  chooseProfile: '/',
  newProfile: '/profiles/new',
  island: '/island',
  missionPattern,
  mission: (missionId: MissionId) => generatePath(missionPattern, { missionId }),
} as const
