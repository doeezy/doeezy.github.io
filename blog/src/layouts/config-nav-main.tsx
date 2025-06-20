import { paths } from '../routes/paths';
import { postModulesByCategory } from '../utils/postModules';

const getPosts = (target: string) => {
  const loaded: any[] = Object.entries(postModulesByCategory[target]).map(([path, loader]) => {
    const filename = path.split('/').pop();
    return filename.substring(0, filename.lastIndexOf('.')); // 확장자 제거
  });

  return loaded.map((title: string) => {
    return {
      title: title,
      path: `/${target}/${title}`,
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
