import type { TimelineEntry } from './types';

/**
 * Development roadmap.
 *
 * This deliberately did NOT carry over most of `sites/mcc-cal-vite/src/data/roadmap-data.ts`.
 * That file was a photography-business roadmap: service launches, client portals, marketplace
 * plans, and a set of AI features. None of it belongs in a technical publication, and the
 * vaguer entries ("Global expansion planning", "Maintain the highest quality standards")
 * are exactly the kind of claim this site is built to avoid.
 *
 * What survived is the software work that actually happened or is actually queued.
 */

export interface RoadmapGroup {
  id: string;
  label: string;
  summary: string;
  entries: TimelineEntry[];
}

export const ROADMAP: RoadmapGroup[] = [
  {
    id: 'shipped',
    label: 'Shipped',
    summary: 'Work that is done and in production.',
    entries: [
      {
        marker: '2026.04',
        date: 'April 2026',
        title: 'Photography site migrated to Vite and React',
        detail:
          'Moved off the legacy platform. Route-level code splitting, prerendered route metadata, and a build that runs in CI.',
      },
      {
        marker: '2026.04',
        date: 'April 2026',
        title: 'Portfolio manifest system',
        detail:
          'Generators turn image directories into manifests at build time, so galleries are derived from the files rather than hand-maintained.',
      },
      {
        marker: '2026.07',
        date: 'July 2026',
        title: 'Site audit and remediation',
        detail:
          'Nine issues found and fixed across one cycle, each with a regression guard. Canonical URLs, direct-load routing, and image sizing are now covered by tests.',
      },
      {
        marker: '2026.08',
        date: 'August 2026',
        title: 'Technical portfolio split out',
        detail:
          'Software work moved to its own publication rather than sharing the photography site.',
      },
      {
        marker: '2026.09',
        date: 'September 2026',
        title: 'Homepage grid and product captures',
        detail:
          'The project index became a grid of project tiles, and the case studies got real captures in place of the reserved frames.',
      },
      {
        marker: '2026.09',
        date: 'September 2026',
        title: 'Folio Market, and signed sources',
        detail:
          'Folio reads sources: signed package lists that show their key fingerprint before they are trusted, and are pinned to that key afterwards.',
      },
      {
        marker: '2026.09',
        date: 'September 2026',
        title: 'Keyd published as a Folio source',
        detail:
          'The keyboard ships from its own repository, listed as a package under Folio. Android requires a keyboard to be its own input method service, so it cannot live inside the launcher.',
      },
    ],
  },
  {
    id: 'active',
    label: 'Active',
    summary: 'In progress now.',
    entries: [
      {
        marker: 'TerraNova',
        date: 'In progress',
        title: 'Alpha channel',
        detail: 'Preview accuracy and inspectable density fields.',
        current: true,
      },
      {
        marker: 'Folio',
        date: 'In progress',
        title: '0.7.0: the Market opens to everyone',
        detail:
          'The Market ships beyond the dev builds, opened by a supporter code, with folders past two apps, hidden apps behind a lock, and layouts that adapt to each screen and fold.',
        current: true,
      },
      {
        marker: 'Abridgd',
        date: 'Beta',
        title: 'iOS and Android beta',
        detail:
          'Recent work: Android support, rebuilt onboarding, feed fixes, and an accessibility pass.',
        current: true,
      },
    ],
  },
  {
    id: 'queued',
    label: 'Queued',
    summary: 'Committed to, not yet started. Nothing here is a promise about a date.',
    entries: [],
  },
];
