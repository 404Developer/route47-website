// Business details and page copy live here so they can be edited in one place.

export type Phone = { display: string; tel: string }

export const site = {
  name: 'Route 47 Low Voltage',
  url: 'https://route47lowvoltage.com',
  email: 'route47lowvoltage@gmail.com',
  phones: [
    { display: '(630) 380-4970', tel: '+16303804970' },
    { display: '(630) 506-0351', tel: '+16305060351' },
  ] satisfies Phone[],
  area: 'Marengo, IL & surrounding areas',
  tagline: ['Local. Can do.', 'Owner-operated.', 'Better connected.'],
  pillars: ['Security', 'Wi-Fi', 'Audio', 'Video'],
}

export const primaryPhone = site.phones[0]

export type ServiceIconName = 'plug' | 'wifi' | 'camera' | 'doorbell' | 'speaker' | 'dish'

export type Service = {
  icon: ServiceIconName
  title: string
  text: string
  tags: string[]
}

export const services: Service[] = [
  {
    icon: 'plug',
    title: 'Network drops & racks',
    text: 'New Cat6 runs to the rooms, offices and camera spots that need them — terminated on keystone jacks, tested, and labeled. Messy closets become clean, serviceable racks.',
    tags: ['Cat6 runs', 'Wall plates', 'Patch panels', 'Rack cleanup'],
  },
  {
    icon: 'wifi',
    title: 'Wi-Fi that reaches',
    text: 'UniFi access points placed for real coverage — the house, the office, the shop and the backyard. Guest Wi-Fi set up the right way.',
    tags: ['Access points', 'Outdoor coverage', 'Guest networks'],
  },
  {
    icon: 'camera',
    title: 'Security cameras',
    text: 'UniFi Protect camera systems with sharp video, smart alerts and recording that stays on your own hardware — no required monthly fees.',
    tags: ['UniFi Protect', 'Recorders', 'Remote viewing'],
  },
  {
    icon: 'doorbell',
    title: 'Doorbells & security',
    text: 'See and talk to whoever is at the door from anywhere, with cameras, doorbells and alerts working together in one app.',
    tags: ['Video doorbells', 'Alerts', 'One app'],
  },
  {
    icon: 'speaker',
    title: 'Audio & video',
    text: 'Speakers and TV wiring for the living room, patio, shop or office — clean runs and no dangling wires.',
    tags: ['Speakers', 'TV wiring', 'Hidden cables'],
  },
  {
    icon: 'dish',
    title: 'Starlink & internet',
    text: 'Starlink mounted on the roof — sealed and aimed — then connected to your UniFi gateway as your internet or as a backup line.',
    tags: ['Roof mounts', 'Failover'],
  },
]

export const reasons = [
  {
    word: 'Local.',
    text: "Marengo-area and proud of it. Close by for the install, and just down the road when you're ready to add more.",
  },
  {
    word: 'Can do.',
    text: 'One drop or a whole building, one camera or a full system. No job too small, and no shortcuts on the big ones.',
  },
  {
    word: 'Owner-operated.',
    text: 'You deal directly with the owner, from the first call to the final walkthrough.',
  },
  {
    word: 'Better connected.',
    text: 'Clean runs, tested connections, labeled cables and gear set up right, so it all just works.',
  },
]

export const steps = [
  {
    title: 'Call or text',
    text: 'Tell us what you have in mind — a few cameras, better Wi-Fi, or a closet that needs rescuing.',
  },
  {
    title: 'Local consultation',
    text: 'We walk the space with you, talk through options and figure out what actually makes sense.',
  },
  {
    title: 'Clear quote',
    text: 'Itemized labor and materials. Nothing extra gets added without your OK.',
  },
  {
    title: 'Clean install',
    text: 'Installed, tested and labeled, and we make sure everything is online before we leave.',
  },
]
