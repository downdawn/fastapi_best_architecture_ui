import { AppRouteRecordRaw } from '@/router/routes/types';
import { DEFAULT_LAYOUT } from '@/router/routes/base';

const SERP: AppRouteRecordRaw = {
  path: '/serp',
  name: 'serp',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.serp',
    requiresAuth: true,
    icon: 'icon-storage',
    order: 7,
  },
  children: [
    {
      path: 'serp-task',
      name: 'SerpTask',
      component: () => import('@/views/serp/task/index.vue'),
      meta: {
        locale: 'menu.serp.serpTask',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'serp-search',
      name: 'SerpSearch',
      component: () => import('@/views/serp/search/index.vue'),
      meta: {
        locale: 'menu.serp.serpSearch',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SERP;
