export interface MinorityGroup {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  category: 'lgbtqia+' | 'poc' | 'disability' | 'other';
}

export const minorityGroups: MinorityGroup[] = [
  // LGBTQIA+ Groups
  {
    id: 'asexual',
    name: 'Asexual',
    description: 'People who experience little to no sexual attraction',
    emoji: '🖤🤍💜',
    category: 'lgbtqia+'
  },
  {
    id: 'bisexual',
    name: 'Bisexual',
    description: 'People attracted to both men and women',
    emoji: '🩷💜💙',
    category: 'lgbtqia+'
  },
  {
    id: 'gay',
    name: 'Gay',
    description: 'Men who are attracted to other men',
    emoji: '💚🤍💙',
    category: 'lgbtqia+'
  },
  {
    id: 'intersex',
    name: 'Intersex',
    description: 'People born with sex characteristics that do not fit typical binary notions of male or female bodies',
    emoji: '💛💜',
    category: 'lgbtqia+'
  },
  {
    id: 'lesbian',
    name: 'Lesbian',
    description: 'Women who are attracted to other women',
    emoji: '🧡🤍🩷',
    category: 'lgbtqia+'
  },
  {
    id: 'queer',
    name: 'Queer',
    description: 'An umbrella term for people who are not heterosexual or cisgender',
    emoji: '🏳️‍🌈',
    category: 'lgbtqia+'
  },
  {
    id: 'transgender',
    name: 'Transgender',
    description: 'People whose gender identity differs from their assigned sex at birth',
    emoji: '💙🤍🩷',
    category: 'lgbtqia+'
  },
  
  // POC Groups
  {
    id: 'asian',
    name: 'Asian',
    description: 'People of Asian descent',
    category: 'poc'
  },
  {
    id: 'black',
    name: 'Black',
    description: 'People of African descent',
    category: 'poc'
  },
  {
    id: 'indigenous',
    name: 'Indigenous',
    description: 'Indigenous or Native peoples',
    category: 'poc'
  },
  {
    id: 'latinx',
    name: 'Latinx',
    description: 'People of Latin American or Hispanic origin',
    category: 'poc'
  },
  {
    id: 'mena',
    name: 'MENA',
    description: 'People of Middle Eastern or North African descent',
    category: 'poc'
  },
  
  // Disability Groups
  {
    id: 'chronic-illness',
    name: 'Chronically ill',
    description: 'People living with chronic illnesses or conditions',
    category: 'disability'
  },
  {
    id: 'deaf-hoh',
    name: 'Deaf',
    description: 'People who are deaf or hard of hearing',
    emoji: '👂',
    category: 'disability'
  },
  {
    id: 'neurodivergent',
    name: 'Neurodivergent',
    description: 'People with autism, ADHD, dyslexia, and other neurological differences',
    emoji: '🧠',
    category: 'disability'
  },
  {
    id: 'physical-disability',
    name: 'Physically disabled',
    description: 'People with physical disabilities or mobility impairments',
    emoji: '♿',
    category: 'disability'
  },
  {
    id: 'visual-impairment',
    name: 'Visually impaired',
    description: 'People who are blind or have visual impairments',
    emoji: '👁️‍🗨️',
    category: 'disability'
  },
  
  // Other Minority Groups
  {
    id: 'elderly',
    name: 'Elderly',
    description: 'Older adults facing age discrimination',
    emoji: '👵👴',
    category: 'other'
  },
  {
    id: 'immigrants',
    name: 'Immigrant',
    description: 'People who have migrated to a country different from their birth',
    emoji: '🌍',
    category: 'other'
  },
  {
    id: 'refugees',
    name: 'Refugee',
    description: 'People forced to flee their country due to persecution, war or violence',
    category: 'other'
  },
  {
    id: 'religious-minorities',
    name: 'Religious Minority',
    description: 'People of minority religious faiths',
    emoji: '🕯️',
    category: 'other'
  },
]; 