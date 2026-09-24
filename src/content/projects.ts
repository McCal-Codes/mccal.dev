import type { Project } from './types';

/**
 * The project index. Array order is display order. The slug also keys into
 * `github.json`, so anything measurable (version, releases, languages, license,
 * last push) is pulled rather than written here.
 *
 * A project with an empty `sections` array renders as an index row with no
 * case-study link. That is the honest state for work that does not yet have a
 * written case study, and it avoids shipping a page of filler.
 */
export const PROJECTS: Project[] = [
  {
    index: '01',
    slug: 'terranova',
    title: 'TerraNova',
    purpose: 'An offline design studio for Hytale World Generation V2.',
    pitch:
      'Build Hytale terrain by connecting nodes instead of editing JSON, and watch the world change as you drag the numbers. Works entirely offline.',
    audience: 'For Hytale world builders',
    status: 'active-alpha',
    meta: {
      type: 'Desktop application',
      role: 'Developer',
      platform: ['Windows', 'macOS', 'Linux'],
      started: 'March 2026',
      frameworks: ['Tauri', 'Vite'],
    },
    preview: {
      src: '/projects/terranova/shape-preview.webp',
      alt: 'TerraNova 3D shape preview of a terrain density field, shaded from red peaks to blue lows.',
      width: 1200,
      height: 962,
      callouts: [],
    },
    tile: {
      kind: 'cover',
      summary: 'An offline design studio for Hytale World Generation V2.',
      icon: '/projects/terranova/icon.png',
      from: '#15314a',
      to: '#1d5a4c',
    },
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Context',
        kind: 'prose',
        body: [
          'Hytale world generation is configured through JSON templates. The format is expressive, and it is also unforgiving: a template is a deeply nested description of noise fields, curve transforms, and terrain combinators, and nothing about reading it tells you what the terrain will look like.',
          'The practical workflow before TerraNova was to edit the JSON, restart a server, fly around, and guess at which number to change. Iteration cost was measured in minutes per attempt, which is high enough that most creators stop exploring and settle for whatever they got early.',
          'TerraNova is an offline desktop studio for that work. It is open source under LGPL-2.1, and it also exists as a mirror under the HyperSystems Development organisation.',
        ],
      },
      {
        id: 'problem',
        label: 'Problem',
        heading: 'Problem',
        kind: 'list',
        body: ['Three things make hand-authored worldgen templates hard, and they compound:'],
        items: [
          'The template is a graph, but JSON presents it as a tree. Nodes that feed several consumers appear once and are referenced by name, so the actual data flow is invisible in the file.',
          'Feedback is detached from the edit. The result of a change appears in a different process, after a restart, at a location you have to navigate to.',
          'Invalid templates fail late. A schema mistake surfaces as a server-side error well after the edit that caused it, with no pointer back to the offending node.',
        ],
      },
      {
        id: 'system',
        label: 'System',
        heading: 'System',
        kind: 'prose',
        body: [
          'TerraNova treats the template as what it already is: a directed graph. Noise generators, curve transforms, and terrain combinators are nodes; the connections between them are the data flow that JSON was hiding.',
          'Editing happens in the graph. The preview renders from the same graph, so the feedback loop closes inside one window, on one machine, with no server involved. Export writes the JSON, and the Bridge plugin hot-reloads it into a running Hytale server when you want to see it in place.',
          'Validation runs against the Hytale worldgen schema before export rather than after, so schema errors are attributable to a node while you are still looking at it.',
        ],
      },
      {
        id: 'interface',
        label: 'Interface',
        heading: 'Interface',
        kind: 'shots',
        body: [
          'The window is three panes: the graph you are editing, the terrain that graph produces, and the parameters of whatever is selected. Nothing is behind a mode switch, because the point is to see the cause and the effect at the same time.',
        ],
        shots: [
          {
            src: '/projects/terranova/editor.webp',
            alt: 'TerraNova editor with the node graph on top, a 3D voxel terrain preview below it, the inspector on the right, and edit history on the left.',
            width: 1600,
            height: 883,
            caption: 'The editor. Graph, preview, and inspector share one window.',
            callouts: [
              { index: '01', label: 'Node graph', x: 45, y: 30 },
              { index: '02', label: 'Live preview', x: 55, y: 80 },
              { index: '03', label: 'Inspector', x: 95, y: 12 },
              { index: '04', label: 'Validation strip', x: 17, y: 8.5 },
            ],
          },
        ],
      },
      {
        id: 'architecture',
        label: 'Architecture',
        heading: 'Architecture',
        kind: 'diagram',
        body: [
          'The editor is TypeScript in a Tauri shell. Generation and preview rendering are Rust, because the preview has to keep up with a parameter being dragged. Export and validation sit between them, and the Bridge plugin carries the result into a live server.',
        ],
        diagram: {
          description:
            'A five-stage pipeline. The node graph editor feeds the generation core, which feeds the preview renderer. The graph also feeds schema validation, which produces the JSON export, which the Bridge plugin hot-reloads into a running Hytale server.',
          nodes: [
            { id: 'graph', label: 'Node graph editor', note: 'TypeScript / Tauri' },
            { id: 'core', label: 'Generation core', note: 'Rust' },
            { id: 'preview', label: 'Preview renderer', note: 'Rust' },
            { id: 'validate', label: 'Schema validation', note: 'Pre-export' },
            { id: 'bridge', label: 'Bridge plugin', note: 'Hot-reload into a live server' },
          ],
          edgeLabels: ['graph state', 'height + density fields', 'export request', 'validated .json'],
        },
      },
      {
        id: 'development',
        label: 'Development',
        heading: 'Development history',
        kind: 'releases',
        body: [
          'Published releases, newest first. This list is pulled from the repository rather than written here, so it cannot drift from what actually shipped.',
        ],
      },
      {
        id: 'limitations',
        label: 'Limitations',
        heading: 'Limitations',
        kind: 'list',
        body: ['Known and accepted, as of the current alpha:'],
        items: [
          'The preview approximates. It is close enough to make decisions from, and it is not a substitute for loading the world.',
          'The Bridge plugin requires a server you control. There is no path for hot-reloading into a server you are only a player on.',
          'Very large graphs slow the editor before they slow generation. The bottleneck is graph layout, not terrain.',
          'Hytale itself is a moving target. Schema changes upstream can invalidate templates that were valid at export time.',
        ],
      },
      {
        id: 'next',
        label: 'Next',
        heading: 'Next milestone',
        kind: 'prose',
        body: [
          'The alpha channel is where the work is happening. The current thread is trusting the preview: narrowing the gap between the preview renderer and the generation core, and making density fields inspectable so the numbers behind a piece of terrain can be read directly rather than inferred from its shape.',
        ],
      },
    ],
  },

  {
    index: '02',
    slug: 'abridgd',
    title: 'Abridgd',
    purpose: 'Finite local-news reading.',
    pitch:
      'Read your local news and actually reach the end of it. No infinite feed, no national stories crowding out the ones near you.',
    audience: 'For people who want to stay local and stop scrolling',
    status: 'beta',
    meta: {
      type: 'Mobile application',
      role: 'Developer / Product designer',
      platform: ['iOS', 'Android'],
      started: 'January 2026',
      frameworks: ['React Native', 'Expo'],
    },
    preview: {
      src: '/projects/abridgd/local-feed.webp',
      alt: 'Abridgd Local tab listing the day’s Pittsburgh stories, each with its source.',
      width: 602,
      height: 1308,
      callouts: [],
    },
    tile: {
      kind: 'device',
      summary: 'A calm, local-first news reader for Pittsburgh.',
      icon: '/projects/abridgd/icon.png',
      from: '#1b4432',
      to: '#2f6a49',
    },
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Context',
        kind: 'prose',
        body: [
          'Local news apps inherited the infinite feed from social platforms, where the goal is to never end. Local news has the opposite property: on any given day there is a finite amount of it, and a reader can actually get to the end.',
          'Abridgd is built around that. The day has a bottom, and reaching it is the point.',
        ],
      },
      {
        id: 'problem',
        label: 'Problem',
        heading: 'Problem',
        kind: 'list',
        items: [
          'An infinite feed cannot tell you that you are caught up, so it never lets you stop deliberately.',
          'Ranking by engagement pushes local coverage under national coverage, because national stories always win on volume.',
          'Reading happens in places without a connection. An app that assumes the network fails exactly when it is being used.',
        ],
      },
      {
        id: 'next',
        label: 'Next',
        heading: 'Where it stands',
        kind: 'prose',
        body: [
          'In beta on iOS and Android. Recent work: Android support, rebuilt onboarding, feed fixes, and an accessibility pass.',
        ],
      },
    ],
  },

  {
    index: '03',
    slug: 'folio',
    title: 'Folio',
    seoTitle: 'Folio Launcher: iOS without the barriers',
    seoDescription:
      'Folio Launcher is a free, open-source, iPhone-style Home Screen for Android foldables like the Galaxy Z Fold, with jailbreak-inspired tweaks. No root needed.',
    purpose: 'An iPhone-style Home Screen for Android.',
    pitch:
      'A clean, iPhone-style Home Screen for Android, with jailbreak-inspired tweaks. Made for foldables, works on phones and tablets.',
    audience: 'For Android foldables, phones, and tablets',
    status: 'active-development',
    meta: {
      type: 'Android launcher',
      role: 'Developer',
      platform: ['Android'],
      started: 'September 2026',
      frameworks: ['Jetpack Compose'],
    },
    preview: {
      src: '/projects/folio/home.webp',
      alt: 'Folio Home Screen on a phone, with clock and date widgets above a grid of app icons.',
      width: 624,
      height: 986,
      callouts: [],
    },
    tile: {
      kind: 'device',
      size: 'tall',
      icon: '/projects/folio/icon.png',
      from: '#26305a',
      to: '#3f2f63',
      href: 'https://github.com/McCal-Codes/folio',
      hrefLabel: 'View on GitHub',
    },
    sections: [
      {
        id: 'story',
        label: 'Story',
        heading: 'Why I made this',
        kind: 'prose',
        body: [
          "Honestly, I started this for fun. I've spent the last few months building an iPhone app, then I got a Galaxy Z Fold8 and got excited by how much Android lets you customize. At the same time I felt a little homesick for Apple, or at least for the jailbreak features I loved. I've been in the iOS jailbreak world since iOS 7 or 8, so this was me getting back into it.",
          'I want to give back to the open-source community, so Folio is free and open source.',
          "Anyone who wants a clean look, likes the Apple style without Apple's restrictions, or just wants their phone to work the way they want. I'm building what I knew I couldn't have on iPhone.",
        ],
      },
      {
        id: 'challenges',
        label: 'Challenges',
        heading: 'What was hard',
        kind: 'list',
        items: [
          'Learning Android. The hardest part was learning how permissions work and how launchers work. I got the hang of it.',
          'The fold animation. The Fold8 only tells apps 0°, 90° and 180°, so Folio predicts the motion in between and learns how fast you fold.',
          'One layout for every screen. The cover, the inner screen, portrait, landscape and zoom settings all get the same Folio, laid out by how much room there is rather than by device.',
          'The iOS feel without root. Dynamic Island, Control Center and the iPhone Duo Side Bar are rebuilt with the permissions any Android app can ask for.',
        ],
      },
      {
        id: 'tour',
        label: 'Tour',
        heading: 'A quick look',
        kind: 'shots',
        shots: [
          {
            src: '/projects/folio/home-features.gif',
            alt: 'Folio on the unfolded Galaxy Z Fold8: Home and the Side Bar, Spotlight, the App Library, Control Center, jiggle mode, the widget gallery, Dock Magnification and App Panels.',
            width: 720,
            height: 406,
            caption: 'Home, Spotlight, App Library, Control Center, jiggle mode, widgets and tweaks.',
            callouts: [],
          },
          {
            src: '/projects/folio/personalize.gif',
            alt: 'Folio personalization: tinted icons, left-handed mode, the Classic, Dark, Tinted and Clear themes, the Tweak Library, the Roadmap and the fold effect preview.',
            width: 720,
            height: 406,
            caption: 'Tinted icons, left-handed mode, themes, the Tweak Library, the Roadmap and the fold effect. Icons: Minimal O by JustNewDesigns.',
            callouts: [],
          },
        ],
      },
      {
        id: 'features',
        label: 'Features',
        heading: 'What it does',
        kind: 'list',
        items: [
          'The iPhone Duo Side Bar: the status bar, a Dynamic Island that wraps the camera, and the dock.',
          'Notification Center, Control Center, Spotlight, Today View, Smart Stacks and the widget gallery.',
          'Jiggle mode, folders, Icon Stacks and the App Library.',
          'Tweaks inspired by jailbreak favorites (Velox, Activator, Velvet, Axon, ColorFlow, Harbor), from a Sileo-style Tweak Library.',
          'Themes you can save and share, tinted icons, badges that match each app, and icon pack support.',
          'Two Home pages side by side when you open the Fold, and a full Home on the cover screen.',
          'Updates straight from GitHub, checked against the signing key.',
          'No accounts, no ads, no analytics, and no root.',
        ],
      },
      {
        id: 'packages',
        label: 'Packages',
        heading: 'Packages, and Keyd',
        kind: 'packages',
        body: [
          'Folio reads sources: signed lists of themes, tweaks and apps that the Market installs. A source shows its key fingerprint before Folio trusts it, and pins that key from then on, so a host answering with a different key fails the signature rather than being installed.',
          'Keyd is published that way. It is a keyboard, which Android requires to be its own input method service, so it cannot live inside the launcher. It is its own app and its own repository, listed as a package under Folio rather than as a project beside it.',
        ],
        packages: [
          {
            slug: 'folio-keyd',
            name: 'Keyd',
            summary:
              'A keyboard for Folio. It types, corrects, learns, expands shortcuts, splits around a fold, and speaks six languages.',
          },
        ],
      },
      {
        id: 'releases',
        label: 'Releases',
        heading: 'Releases',
        kind: 'releases',
      },
      {
        id: 'credits',
        label: 'Credits',
        heading: 'Credits',
        kind: 'list',
        body: ['Anything that came from someone else, or that inspired me, is credited here and in the app.'],
        items: [
          'DuoLauncher by jakesgoodapps and contributors (MIT): the starting codebase.',
          "iphone-duo by chuspeeism (MIT): the fold blur and darkening model.",
          "u/moomanjohnny's iPhone Duo concept on the Galaxy Z Fold8: the inspiration.",
          'FoldFX by u/FixHour8452: fold transition ideas.',
          "ZFoldDuo by nnnnnnn0090 (MIT): research on the Fold's hinge angle.",
          'Minimal O by JustNewDesigns: the icon pack in the screenshots.',
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/**
 * Every repository the site speaks for, in display order: each project, then the
 * companions its `packages` sections list. Derived rather than written, so the
 * footer cannot fall out of step with what the pages actually show.
 */
export const REPO_SLUGS: string[] = [
  ...PROJECTS.map((project) => project.slug),
  ...PROJECTS.flatMap((project) =>
    project.sections.flatMap((section) => section.packages?.map((pkg) => pkg.slug) ?? []),
  ),
];

/** Projects with a written case study, and therefore a route. */
export const PROJECTS_WITH_CASE_STUDIES = PROJECTS.filter(
  (project) => project.sections.length > 0,
);
