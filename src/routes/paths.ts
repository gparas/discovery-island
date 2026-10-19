import { generatePath } from 'react-router'
import type { MissionId, TopicId } from '../types.ts'

const topicPattern = '/map/:topicId'
const missionPattern = '/map/:topicId/:missionId'

export const paths = {
  chooseProfile: '/',
  newProfile: '/profiles/new',
  map: '/map',
  topicPattern,
  missionPattern,
  topic: (topicId: TopicId) => generatePath(topicPattern, { topicId }),
  mission: (topicId: TopicId, missionId: MissionId) => generatePath(missionPattern, { topicId, missionId }),
} as const
