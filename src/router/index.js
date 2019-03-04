import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/MainPage'
import GraphPage from '@/pages/GraphPage'
import AuthCallback from '@/pages/AuthCallback'
import FeaturePage from "@/pages/FeaturePage";
import TablePage from "@/pages/TablePage";
import DebugPage from "@/pages/DebugPage";
import ClassifierPage from "@/pages/ClassifierPage";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/graph',
      name: 'GraphPage',
      component: GraphPage
    },
    {
      path: '/list',
      name: 'TablePage',
      component: TablePage
    },
    {
      path: '/auth_callback',
      name: 'AuthCallback',
      component: AuthCallback
    },
    {
      path: '/features/:id',
      name: 'FeaturePage',
      component: FeaturePage
    },
    {
      path: '/classifier/:id',
      name: 'ClassifierPage',
      component: ClassifierPage
    },
    {
      path: '/debug',
      name: 'DebugPage',
      component: DebugPage
    },
  ]
})
