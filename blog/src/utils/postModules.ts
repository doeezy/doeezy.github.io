// 전체 글 목록
export const postModules = import.meta.glob('/src/pages-post/*/*.md', { as: 'raw' });
// 카테고리별 글 목록
export const postModulesByCategory = {
  javascript: import.meta.glob('/src/pages-post/javascript/*.md', { as: 'raw' }),
  keycloak: import.meta.glob('/src/pages-post/keycloak/*.md', { as: 'raw' }),
  nuxtjs: import.meta.glob('/src/pages-post/nuxtjs/*.md', { as: 'raw' }),
  react: import.meta.glob('/src/pages-post/react/*.md', { as: 'raw' }),
  vuejs: import.meta.glob('/src/pages-post/vuejs/*.md', { as: 'raw' }),
  troubleshooting: import.meta.glob('/src/pages-post/troubleshooting/*.md', { as: 'raw' }),
};
