import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [

    //传播情况总览
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/components/Home/Home1'], resolve)
    },

    //热门作品
    {
      path: '/hotwork',
      name: 'HotWork',
      component: resolve => require(['@/components/HotWork/HotWork1'], resolve)
    },

    //传播趋势分析
    {
      path: '/trend',
      name: 'Trend',
      component: resolve => require(['@/components/Trend/Trend1'], resolve)
    },

    //传播地域分析
    {
      path: '/region',
      name: 'Region',
      component: resolve => require(['@/components/Region/Region1'], resolve)
    },

    //媒体转载分析
    {
      path: '/reprint',
      name: 'Reprint',
      component: resolve => require(['@/components/Reprint/Reprint1'], resolve)
    },
    //传播力分析
    // {
    //   path: '/spreadAnalyze',
    //   name: 'SpreadAnalyze',
    //   component: resolve => require(['@/components/SpreadAnalyze/SpreadAnalyze'], resolve)
    // },
    //重点媒体监测
    {
      path: '/mediamonitor',
      name: 'MediaMonitor',
      component: resolve => require(['@/components/MediaMonitor/MediaMonitor1'], resolve)
    },

    //平台对比分析
    {
      path: '/platform',
      name: 'Platform',
      component: resolve => require(['@/components/Platform/Platform1'], resolve)
    },

    //作品对比分析
    {
      path: '/works',
      name: 'Works',
      // component: Works
      component: resolve => require(['@/components/Works/Works1'], resolve)
    },

    //版权对比分析
    {
      path: '/copyright',
      name: 'Copyright',
      component: resolve => require(['@/components/Copyright/Copyright1'], resolve)
    },

    //定制监测
    {
      path: '/customization',
      name: 'Customization',
      component: resolve => require(['@/components/Customization/Customization1'], resolve)
    },

    //单个页面
    {
      path: '/mediaMonitorSingle',
      name: 'MediaMonitorSingle',
      component: resolve => require(['@/components/MediaMonitor/MediaMonitorSingle1'], resolve)
    },

    //单篇新闻详情页
    {
      path: '/detail',
      name: 'DetailPages',
      component: resolve => require(['@/components/DetailPages/DetailPages1'], resolve)
    },
    //搜索结果页
    // {
    //   path: '/search',
    //   name: 'Search',
    //   component: resolve => require(['@/components/search/Search'], resolve)
    // },
    //登陆页面
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/login/Login'], resolve)
    },
    //搜索结果页
    {
      path: '/searchList',
      name: 'SearchList',
      component: resolve => require(['@/components/SearchList/SearchList'], resolve)
    },
    // //传播力图添加文章
    // {
    //   path: '/addArticle',
    //   name: 'AddArticle',
    //   component: resolve => require(['@/components/AddArticle/AddArticle'], resolve)
    // },
    {
      path:'/uploadArticle',
      name:'UploadArticle',
      component: resolve => require(['@/components/UploadArticle/UploadArticle1'], resolve)
    },
    {
      path:'/test',
      name:'Test',
      component: resolve => require(['@/components/Test/Test'], resolve)
    }
  ]
})
