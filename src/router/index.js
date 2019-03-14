import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/MainPage'
import GraphPage from '@/pages/GraphPage'
import AuthCallback from '@/pages/AuthCallback'
import FeaturePage from "@/pages/FeaturePage";
import TablePage from "@/pages/TablePage";
import DebugPage from "@/pages/DebugPage";
import ClassifierPage from "@/pages/ClassifierPage";
import ClassifiersListPage from "@/pages/ClassifiersListPage";
import AnalyticsPage from "@/pages/AnalyticsPage";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: MainPage.name,
      component: MainPage
    },
    {
      path: '/graph',
      name: GraphPage.name,
      component: GraphPage
    },
    {
      path: '/list',
      name: TablePage.name,
      component: TablePage
    },
    {
      path: '/auth_callback',
      name: AuthCallback.name,
      component: AuthCallback
    },
    {
      path: '/features/:id',
      name: FeaturePage.name,
      component: FeaturePage
    },
    {
      path: '/classifier/:id',
      name: ClassifierPage.name,
      component: ClassifierPage
    },
    {
      path: '/classifiers',
      name: ClassifiersListPage.name,
      component: ClassifiersListPage
    },
    {
      path: '/debug',
      name: 'DebugPage',
      component: DebugPage
    },
    {
      path: '/analytics',
      name: AnalyticsPage.name,
      component: AnalyticsPage
    },
  ]
})
