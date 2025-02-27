import { ResourceProps } from '../components/ResourceCard';

export const mockResources: ResourceProps[] = [
  {
    id: '1',
    title: 'AI/ML Glossary by Google',
    description: 'Comprehensive glossary of AI/ML terms',
    url: 'https://developers.google.com/machine-learning/glossary',
    category: 'General AI Concepts',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Beginner', 'Glossary', 'Reference']
  },
  {
    id: '2',
    title: 'AI for Everyone',
    description: 'Andrew Ng\'s course for non-technical people',
    url: 'https://www.coursera.org/learn/ai-for-everyone',
    category: 'General AI Concepts',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Beginner', 'Course', 'Non-technical']
  },
  {
    id: '3',
    title: 'Elements of AI',
    description: 'Free online course covering AI basics',
    url: 'https://www.elementsofai.com/',
    category: 'General AI Concepts',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Beginner', 'Course', 'AI Basics']
  },
  {
    id: '4',
    title: 'Cursor Docs',
    description: 'AI-powered code editor basics',
    url: 'https://docs.cursor.com/get-started/welcome',
    category: 'Getting Started Guides',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Beginner', 'Cursor', 'Code Editor']
  },
  {
    id: '5',
    title: 'ChatGPT Prompt Engineering',
    description: 'Learn effective prompt writing',
    url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
    category: 'Getting Started Guides',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Beginner', 'Prompt Engineering', 'ChatGPT']
  },
  {
    id: '6',
    title: 'Anthropic\'s Claude Best Practices',
    description: 'Guide to working with Claude',
    url: 'https://docs.anthropic.com/claude/docs/introduction-to-claude',
    category: 'Getting Started Guides',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Beginner', 'Claude', 'Best Practices']
  },
  {
    id: '7',
    title: 'GitHub Copilot Documentation',
    description: 'Complete guide to GitHub Copilot',
    url: 'https://docs.github.com/en/copilot',
    category: 'Developer Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Intermediate', 'GitHub', 'Copilot']
  },
  {
    id: '8',
    title: 'Cursor Advanced Features',
    description: 'Advanced techniques for Cursor',
    url: 'https://practicalprogrammatic.com/course/advanced-cursor',
    category: 'Developer Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Intermediate', 'Cursor', 'Advanced']
  },
  {
    id: '9',
    title: 'Learn Cursor',
    description: 'Videos for all levels',
    url: 'https://cursor.directory/learn',
    category: 'Developer Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Intermediate', 'Cursor', 'Videos']
  },
  {
    id: '10',
    title: 'AI for Project Estimation',
    description: 'PMI guide on AI in project management',
    url: 'https://youtu.be/44SIpoG4DS0',
    category: 'Project Management Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Intermediate', 'Project Management', 'Estimation']
  },
  {
    id: '11',
    title: 'Agile and AI Integration',
    description: 'Guide to AI in Atlassian\'s suite',
    url: 'https://agilesparks.com/unleashing-the-power-of-ai-in-atlassian-tools-jira-confluence-and-rovo/',
    category: 'Project Management Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Intermediate', 'Agile', 'Atlassian']
  },
  {
    id: '12',
    title: 'LangChain Documentation',
    description: 'Framework for developing AI applications',
    url: 'https://python.langchain.com/docs/get_started/introduction',
    category: 'Advanced Technical Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Expert', 'LangChain', 'Framework']
  },
  {
    id: '13',
    title: 'OpenAI API Documentation',
    description: 'Technical guide to OpenAI\'s APIs',
    url: 'https://platform.openai.com/docs/introduction',
    category: 'Advanced Technical Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Expert', 'OpenAI', 'API']
  },
  {
    id: '14',
    title: 'Anthropic API Documentation',
    description: 'Claude API integration guide',
    url: 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api',
    category: 'Advanced Technical Resources',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Expert', 'Claude', 'API']
  },
  {
    id: '15',
    title: 'AI Security Best Practices',
    description: 'NIST AI security guidelines',
    url: 'https://www.nist.gov/artificial-intelligence',
    category: 'Security and Best Practices',
    addedBy: 'Lullabot AI Education',
    date: new Date().toISOString().split('T')[0],
    tags: ['Expert', 'Security', 'Best Practices']
  }
];

export default mockResources; 