// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // Use `import type` for RouteRecordRaw
import type { RouteMeta } from '@/Interfaces/routeMeta'; // Use `import type` for RouteMeta

// Define routes with proper typing
const routes: Array<RouteRecordRaw & { meta: RouteMeta }> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'User Dashboard', // Required property
      requiresAuth: true, // Optional property
      roles: ['admin', 'manager', 'viewer'], // Optional property
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Others/UserProfile.vue'),
    meta: {
      title: 'Profile', // Required property
      requiresAuth: true, // Optional property
      roles: ['admin'], // Optional property
    },
  },
  {
    path: '/users/:id/edit',
    name: 'Edit User',
    component: () => import('../views/Forms/editForm.vue'),
    props: true,
    meta: {
      title: 'Edit User', // Required property
      requiresAuth: true, // Optional property
      roles: ['admin', 'manager'], // Optional property
    },
  },
  {
    path: '/form-elements',
    name: 'Form Elements',
    component: () => import('../views/Forms/FormElements.vue'),
    meta: {
      title: 'Form Elements', // Required property
      requiresAuth: true, // Optional property
      roles: ['admin', 'manager'], // Optional property
    },
  },
  {
    path: '/blank',
    name: 'Blank',
    component: () => import('../views/Pages/BlankPage.vue'),
    meta: {
      title: 'Blank', // Required property
      requiresAuth: true, // Optional property
      roles: ['admin', 'manager', 'viewer'], // Optional property
    },
  },
  {
    path: '/error-404',
    name: '404 Error',
    component: () => import('../views/Errors/FourZeroFour.vue'),
    meta: {
      title: '404 Error', // Required property
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/Signin.vue'),
    meta: {
      title: 'Login', // Required property
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
  routes,
});

// Simulate user authentication and role
const getUserRole = () => {
  return localStorage.getItem('userRole') || 'viewer';
};

// Route guard for role-based permissions
router.beforeEach((to, from, next) => {
  const userRole = getUserRole();
  const requiresAuth = (to.meta as RouteMeta).requiresAuth;
  const allowedRoles = (to.meta as RouteMeta).roles;

  // Set page title
  document.title = `${to.meta.title} | User Management Dashboard`;

  // Check if the route requires authentication
  if (requiresAuth) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      next({ path: '/login' });
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      next({ path: '/error-404' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;