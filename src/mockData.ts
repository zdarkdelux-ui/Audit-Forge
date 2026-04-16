import { Audit, Issue } from './types';

export const MOCK_AUDITS: Audit[] = [
  {
    id: '1',
    projectName: 'aluminum-okna.ru',
    domain: 'https://aluminum-okna.ru',
    auditType: 'SEO + UX + Content audit',
    date: '2024-04-16',
    executor: 'SEO specialist',
    client: 'ООО Пример',
    status: 'Draft',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'i1',
    auditId: '1',
    title: 'Missing H1 on Home Page',
    shortDescription: 'The main landing page lacks an H1 tag.',
    fullDescription: 'The <h1> tag is essential for SEO as it tells search engines the primary topic of the page. Currently, it is completely missing.',
    url: 'https://aluminum-okna.ru/',
    type: 'SEO',
    severity: 'High',
    recommendation: 'Add a descriptive <h1> tag containing target keywords.',
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'i2',
    auditId: '1',
    title: 'Slow Core Web Vitals (LCP)',
    shortDescription: 'Largest Contentful Paint exceeds 4s.',
    fullDescription: 'Mobile users experience heavy delay before the main image loads.',
    url: 'https://aluminum-okna.ru/katalog/',
    type: 'Technical',
    severity: 'Critical',
    recommendation: 'Optimize images and use modern formats (WebP). Ensure priority fetch for hero images.',
    status: 'In Progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
