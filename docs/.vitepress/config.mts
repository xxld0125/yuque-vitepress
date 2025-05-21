import { defineConfig } from 'vitepress'
import { genYuqueSideBar } from "../../utils/route";
import { YuQueSVG } from "../../utils/assists";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "Yuque-VitePress",
  description: "语雀 + Elog + VitePress + GitHub Actions + Vercel 文档站点解决方案 | Vue源码学习笔记",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [
    [
      'link', { rel: 'icon', href: '/favicon.ico' }
    ]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    outline: [2, 6],
    nav: [
      { text: '首页', link: '/' },
      { text: '配置文档', link: '/docs/入门指引/快速开始', activeMatch: '/docs/' },
      {
        text: 'Vue源码',
        items: [
          { text: 'Vue2 总览', link: '/docs/Vue源码/Vue2' },
          { text: 'Vue2 源码详解', link: '/docs/Vue源码/Vue2/搭建开发环境' },
          { text: 'Vue3', link: '/docs/Vue源码/Vue3' }
        ]
      },
      { text: '面试相关', link: '/docs/面试相关/Vue2相关面试题' },
      // { text: '短路由模式', link: '/docs-shorturl/ssuhngw0yb3dgkkg', activeMatch: '/docs-shorturl/' }
    ],
    sidebar: {
      "/docs/": await genYuqueSideBar('/docs'),
      "/docs/Vue源码/": [
        {
          text: 'Vue2',
          items: [
            { text: 'Vue2 总览', link: '/docs/Vue源码/Vue2' },
            { text: '搭建开发环境', link: '/docs/Vue源码/Vue2/搭建开发环境' },
            { text: '初始化数据', link: '/docs/Vue源码/Vue2/2.初始化数据' },
            { text: '对象响应式原理', link: '/docs/Vue源码/Vue2/3.实现对象的响应式原理' },
            { text: '数组响应式原理', link: '/docs/Vue源码/Vue2/4.实现数组的响应式原理' },
            { text: '解析模板参数', link: '/docs/Vue源码/Vue2/5.解析模板参数' },
            { text: 'Computed 实现流程', link: '/docs/Vue源码/Vue2/Computed 的实现流程' },
            { text: 'Diff 算法实现', link: '/docs/Vue源码/Vue2/Diff 算法的实现流程' },
            { text: 'keep-alive 组件缓存', link: '/docs/Vue源码/Vue2/keep-alive 组件缓存与重新渲染流程' },
            { text: '响应式系统原理', link: '/docs/Vue源码/Vue2/响应式系统实现原理' },
            { text: '组件渲染原理', link: '/docs/Vue源码/Vue2/组件渲染实现原理' }
          ]
        },
        {
          text: 'Vue3',
          items: [
            { text: 'Vue3 总览', link: '/docs/Vue源码/Vue3' }
          ]
        }
      ],
      "/docs/面试相关/": [
        {
          text: '面试题集',
          items: [
            { text: 'Vue2相关面试题', link: '/docs/面试相关/Vue2相关面试题' }
          ]
        }
      ],
      // "/docs-shorturl/": await genYuqueSideBarWithShortUrl('/docs-shorturl')
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    socialLinks: [
      { icon: { svg: YuQueSVG }, link: "https://www.yuque.com/1874w/yuque-vitepress-template" },
      { icon: 'github', link: 'https://github.com/elog-x/yuque-vitepress' }
    ],
    footer: {
      message: 'Powered by <a href="https://www.yuque.com/1874w/yuque-vitepress-template" target="_blank">语雀</a>  & <a href="https://vitepress.dev" target="_blank">VitePress</a> with <a href="https://github.com/LetTTGACO/elog" target="_blank">Elog</a>',
      copyright: 'Copyright © 2023-present'
    },
  }
})
