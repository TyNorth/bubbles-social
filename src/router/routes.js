const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/explore' },

      {
        path: 'explore',
        name: 'explore',
        component: () => import('pages/ExplorePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'bubble/:id',
        name: 'bubble-view',
        component: () => import('pages/BubbleViewPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'post/:id',
        name: 'post-detail',
        component: () => import('pages/PostPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'my-profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'user/:id',
        name: 'user-profile',
        component: () => import('pages/UserProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('pages/NotificationsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { public: true, layout: 'auth' },
      },
      {
        path: 'setup',
        name: 'setup',
        component: () => import('pages/SetupPage.vue'),
        meta: { requiresAuth: true, onboarding: true, layout: 'auth' },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { public: true },
  },
]

export default routes
