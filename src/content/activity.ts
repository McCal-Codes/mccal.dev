import type { ActivityEntry } from './types';

/**
 * What is actually being worked on now. Short, specific, and worth updating often.
 * A stale "Currently" block is worse than no "Currently" block.
 */
export const ACTIVITY: ActivityEntry[] = [
  {
    project: 'Folio',
    slug: 'folio',
    detail:
      'The Market opens to everyone in 0.7.0, reading signed sources. Keyd, the keyboard, is the first app published through one.',
  },
  {
    project: 'TerraNova',
    slug: 'terranova',
    detail: 'Working the alpha channel toward a preview you can trust, and making density fields inspectable.',
  },
  {
    project: 'Abridgd',
    slug: 'abridgd',
    detail:
      'In beta on iOS and Android. Recent work: Android support, rebuilt onboarding, feed fixes, and an accessibility pass.',
  },
];
