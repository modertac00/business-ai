import type { Folder, DocSection, ChatMessage } from '../types'

export const FOLDERS: Folder[] = [
  {
    id: 'moderta',
    name: 'Moderta ESG',
    files: [
      { id: 'carbon', name: 'Carbon Report 2025', type: 'doc', status: 'draft' },
      { id: 'pcf', name: 'PCF Analysis', type: 'doc', status: 'draft' },
      { id: 'supplier', name: 'Supplier Summary', type: 'doc', status: 'empty' },
    ],
  },
  {
    id: 'supervisesuite',
    name: 'SuperviseSuite',
    files: [
      { id: 'hci1', name: 'HCI Lab Sheet 1', type: 'doc', status: 'done' },
      { id: 'qa', name: 'QA Report SCRUM-109', type: 'doc', status: 'done' },
    ],
  },
  {
    id: 'personal',
    name: 'Personal',
    files: [
      { id: 'cv', name: 'CV Draft', type: 'doc', status: 'empty' },
    ],
  },
]

export const INITIAL_SECTIONS: DocSection[] = [
  {
    id: 's1',
    number: '01',
    title: 'Executive Summary',
    status: 'done',
    content:
      "This report presents Moderta's product carbon footprint analysis for FY 2025, covering Scope 1, 2, and 3 emissions across the full supply chain. Total emissions measured at 1,240 tCO₂e, representing a 12% reduction from baseline.",
  },
  {
    id: 's2',
    number: '02',
    title: 'Methodology',
    status: 'done',
    content:
      'Calculations follow GHG Protocol Corporate Standard using AR6 GWP100 values. Three-gas staged calculation applied: CO₂, CH₄, and N₂O tracked separately before aggregation to CO₂e.',
  },
  {
    id: 's3',
    number: '03',
    title: 'Emissions Breakdown',
    status: 'writing',
    content:
      'Scope 1 direct emissions account for 18% of total footprint, primarily from on-site energy consumption. Scope 2 market-based emissions reflect renewable energy procurement across 3 facilities',
  },
  {
    id: 's4',
    number: '04',
    title: 'Reduction Targets',
    status: 'empty',
    content: '',
  },
]

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'ai',
    text: "I've drafted the Executive Summary and Methodology sections. Want me to continue with the Emissions Breakdown?",
    chips: ['Yes, continue', 'Revise summary'],
  },
  {
    id: 'm2',
    role: 'user',
    text: 'Yes, write the emissions breakdown. Include Scope 1, 2, 3 split.',
  },
  {
    id: 'm3',
    role: 'ai',
    text: 'Writing section 03 now…',
    sectionIndicator: '03 Emissions Breakdown',
  },
  {
    id: 'm4',
    role: 'user',
    text: 'Also update the summary to mention the 12% reduction figure more prominently.',
  },
  {
    id: 'm5',
    role: 'ai',
    text: "Updated section 01 with the 12% reduction in the opening line. Section 03 is still generating — should I also draft section 04 after?",
    chips: ['Draft 04 too', 'Just 03 for now', 'Change tone'],
  },
]

export const QUICK_PROMPTS = ['add a section', 'rewrite tone', 'make shorter', 'add data table']
