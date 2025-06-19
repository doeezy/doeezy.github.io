import { paths } from '../routes/paths';
import matter from 'gray-matter';

// 글 목록 스캔
const posts = {
  javascriptPosts: import.meta.glob('/src/pages-post/javascript/*.md', { as: 'raw' }),
  reactPosts: import.meta.glob('/src/pages-post/react/*.md', { as: 'raw' }),
  vuejsPosts: import.meta.glob('/src/pages-post/vuejs/*.md', { as: 'raw' }),
  nuxtjsPosts: import.meta.glob('/src/pages-post/nuxtjs/*.md', { as: 'raw' }),
  keycloakPosts: import.meta.glob('/src/pages-post/keycloak/*.md', { as: 'raw' }),
};

const getPosts = (target: string) => {
  const loaded: any[] = Object.entries(posts[`${target}Posts`]).map(([path, loader]) => {
    const filename = path.split('/').pop();
    return filename.substring(0, filename.lastIndexOf('.')); // 확장자 제거
  });

  return loaded.map((title: string) => {
    return {
      title: title,
      path: paths[target].root,
    };
  });
};

export const navData = [
  {
    subheader: '',
    items: [
      {
        title: 'JavaScript',
        path: paths.dashboard.root,
        icon: 'vscode-icons:file-type-light-js',
        children: getPosts('javascript'),
      },
      {
        title: 'React',
        path: paths.dashboard.general.analytics,
        icon: 'vscode-icons:file-type-reactjs',
        children: getPosts('react'),
      },
      {
        title: 'Vue.js',
        path: paths.dashboard.general.ecommerce,
        icon: 'vscode-icons:file-type-vue',
        children: getPosts('vuejs'),
      },
      {
        title: 'Nuxt.js',
        path: paths.dashboard.general.ecommerce,
        icon: 'vscode-icons:file-type-nuxt',
        children: getPosts('nuxtjs'),
      },
      {
        title: 'Keycloak',
        path: paths.dashboard.general.banking,
        icon: 'material-icon-theme:folder-keys',
        children: getPosts('keycloak'),
      },
    ],
  },
];
