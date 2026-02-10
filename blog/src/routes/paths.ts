import { paramCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------

export const paths = {
  "ai-llm": {
    root: '/ai-llm',
    list: '/ai-llm/list',
    details: (title: string) => `/ai-llm/${paramCase(title)}`,
  },
  javascript: {
    root: '/javascript',
    list: '/javascript/list',
    details: (title: string) => `/javascript/${paramCase(title)}`,
  },
  react: {
    root: '/react',
    list: '/react/list',
    details: (title: string) => `/react/${paramCase(title)}`,
  },
  vuejs: {
    root: '/vuejs',
    list: '/vuejs/list',
    details: (title: string) => `/vuejs/${paramCase(title)}`,
  },
  keycloak: {
    root: '/keycloak',
    list: '/keycloak/list',
    details: (title: string) => `/keycloak/${paramCase(title)}`,
  },
  troubleshooting: {
    root: '/troubleshooting',
    list: '/troubleshooting/list',
    details: (title: string) => `/troubleshooting/${paramCase(title)}`,
  },

  // ----------------------------------------------------------
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
};
