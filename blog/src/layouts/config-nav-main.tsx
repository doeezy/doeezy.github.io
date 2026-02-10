import { paths } from '../routes/paths';
import { postModulesByCategory } from '../utils/postModules';
import matter from 'gray-matter';

const getPosts = async (target: string) => {
  const targetModules = postModulesByCategory[target as keyof typeof postModulesByCategory];
  if (!targetModules) return [];

  const loaded: any[] = await Promise.all(
    Object.entries(targetModules).map(async ([path, loader]) => {
      const filename = path.split('/').pop() || '';

      const raw = await loader();
      const { data } = matter(raw);

      return {
        ...data,
        filename: filename.substring(0, filename.lastIndexOf('.')), // 확장자 제거
      };
    })
  );

  return loaded.map((load: any) => {
    return {
      title: load.title,
      path: `/${target}/${load.filename}`,
    };
  });
};

export const getNavData = async () => {
  return [
    {
      subheader: '',
      items: [
        {
          title: 'AI / LLM',
          path: paths["ai-llm"].root,
          icon: 'twemoji:robot',
          children: await getPosts('ai-llm'),
        },
        {
          title: 'JavaScript',
          path: paths.javascript.root,
          icon: 'vscode-icons:file-type-light-js',
          children: await getPosts('javascript'),
        },
        {
          title: 'React',
          path: paths.react.root,
          icon: 'vscode-icons:file-type-reactjs',
          children: await getPosts('react'),
        },
        {
          title: 'Vue.js',
          path: paths.vuejs.root,
          icon: 'vscode-icons:file-type-vue',
          children: await getPosts('vuejs'),
        },
        {
          title: 'Keycloak',
          path: paths.keycloak.root,
          icon: 'material-icon-theme:folder-keys',
          children: await getPosts('keycloak'),
        },
        {
          title: 'Troubleshooting',
          path: paths.troubleshooting.root,
          icon: 'vscode-icons:file-type-stackblitz',
          children: await getPosts('troubleshooting'),
        },
      ],
    },
  ];
};
