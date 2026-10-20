import { defineConfig } from 'vitepress'

// 文档：https://vitepress.dev/zh/reference/site-config
export default defineConfig({
  // 部署到 GitHub 项目页 https://ricardowhao.github.io/learn-soft-engineering/
  // 若以后改用自定义域名或 user.github.io 根仓库，再改回 '/'
  base: '/learn-soft-engineering/',

  lang: 'zh-CN',
  title: '全栈知识体系',
  description: '个人全栈知识体系文档站',
  lastUpdated: true,

  themeConfig: {
    // 站内搜索由 VitePress 本地构建，无需后端服务
    search: {
      provider: 'local'
    },

    // 顶部导航：每个一级知识目录对应一个分组下拉菜单
    // 下拉中：二级目录为分组标题（加粗、不可点击），三级目录为可点击链接
    nav: [
      { text: '首页', link: '/' },

      {
        text: '夯实基础',
        items: [
          {
            text: 'Java 核心',
            items: [
              { text: 'Java 基础语法', link: '/basics/java/basic' },
              { text: '集合框架', link: '/basics/java/collections' },
              { text: '并发编程', link: '/basics/java/concurrent' },
              { text: 'IO / NIO', link: '/basics/java/io' },
              { text: 'JVM', link: '/basics/java/jvm' }
            ]
          },
          {
            text: '源码阅读',
            items: [
              { text: 'JDK 源码', link: '/basics/source/jdk' },
              { text: '阅读方法论', link: '/basics/source/method' }
            ]
          }
        ]
      },

      {
        text: 'Spring 全家桶',
        items: [
          {
            text: 'Spring 核心',
            items: [
              { text: 'IoC 容器', link: '/framework/spring/ioc' },
              { text: 'AOP', link: '/framework/spring/aop' },
              { text: '事务', link: '/framework/spring/transaction' }
            ]
          },
          {
            text: 'Spring Boot',
            items: [
              { text: '自动装配', link: '/framework/springboot/auto-config' },
              { text: '启动流程', link: '/framework/springboot/startup' }
            ]
          },
          {
            text: 'Spring Cloud',
            items: [
              { text: '服务注册', link: '/framework/springcloud/registry' },
              { text: '服务调用', link: '/framework/springcloud/rpc' }
            ]
          }
        ]
      },

      {
        text: '框架 | 中间件',
        items: [
          {
            text: 'Web 容器',
            items: [{ text: 'Tomcat 源码详解', link: '/middleware/web/tomcat' }]
          },
          {
            text: 'ORM 框架',
            items: [{ text: 'MyBatis 源码详解', link: '/middleware/orm/mybatis' }]
          },
          {
            text: '分表分库框架',
            items: [{ text: 'ShardingSphere 详解', link: '/middleware/sharding/shardingsphere' }]
          }
        ]
      },

      {
        text: '数据库',
        items: [
          {
            text: '关系型数据库',
            items: [
              { text: 'MySQL 原理', link: '/database/mysql/principle' },
              { text: 'MySQL 调优', link: '/database/mysql/tuning' }
            ]
          },
          {
            text: 'NoSQL',
            items: [
              { text: 'Redis', link: '/database/nosql/redis' },
              { text: 'MongoDB', link: '/database/nosql/mongodb' },
              { text: 'Elasticsearch', link: '/database/nosql/es' }
            ]
          }
        ]
      },

      {
        text: '分布式',
        items: [
          {
            text: '分布式理论',
            items: [
              { text: 'CAP / BASE', link: '/distributed/theory/cap' },
              { text: '一致性算法', link: '/distributed/theory/consensus' }
            ]
          },
          {
            text: '分布式中间件',
            items: [
              { text: '注册中心', link: '/distributed/middleware/registry' },
              { text: '分布式锁', link: '/distributed/middleware/lock' },
              { text: '分布式事务', link: '/distributed/middleware/transaction' }
            ]
          }
        ]
      },

      {
        text: '工程化 & DevOps',
        items: [
          {
            text: '操作系统',
            items: [{ text: 'Linux', link: '/devops/linux' }]
          },
          {
            text: '容器化',
            items: [
              { text: 'Docker', link: '/devops/docker' },
              { text: 'Kubernetes', link: '/devops/k8s' }
            ]
          },
          {
            text: 'CI / CD',
            items: [
              { text: 'Git', link: '/devops/git' },
              { text: 'Jenkins', link: '/devops/jenkins' }
            ]
          }
        ]
      },

      {
        text: '开发工具',
        items: [
          {
            text: 'IDE',
            items: [{ text: 'IntelliJ IDEA', link: '/tools/ide/idea' }]
          },
          {
            text: '构建工具',
            items: [
              { text: 'Maven', link: '/tools/build/maven' },
              { text: 'Gradle', link: '/tools/build/gradle' }
            ]
          }
        ]
      },

      { text: '全栈面试', link: '/interview/' },
      { text: '本站构建方法', link: '/about/' }
    ],

    // 左侧栏：与顶部导航分组保持一致
    sidebar: {
      '/basics/': [
        {
          text: 'Java 核心',
          collapsed: false,
          items: [
            { text: 'Java 基础语法', link: '/basics/java/basic' },
            { text: '集合框架', link: '/basics/java/collections' },
            { text: '并发编程', link: '/basics/java/concurrent' },
            { text: 'IO / NIO', link: '/basics/java/io' },
            { text: 'JVM', link: '/basics/java/jvm' }
          ]
        },
        {
          text: '源码阅读',
          collapsed: false,
          items: [
            { text: 'JDK 源码', link: '/basics/source/jdk' },
            { text: '阅读方法论', link: '/basics/source/method' }
          ]
        }
      ],

      '/framework/': [
        {
          text: 'Spring 核心',
          collapsed: false,
          items: [
            { text: 'IoC 容器', link: '/framework/spring/ioc' },
            { text: 'AOP', link: '/framework/spring/aop' },
            { text: '事务', link: '/framework/spring/transaction' }
          ]
        },
        {
          text: 'Spring Boot',
          collapsed: false,
          items: [
            { text: '自动装配', link: '/framework/springboot/auto-config' },
            { text: '启动流程', link: '/framework/springboot/startup' }
          ]
        },
        {
          text: 'Spring Cloud',
          collapsed: false,
          items: [
            { text: '服务注册', link: '/framework/springcloud/registry' },
            { text: '服务调用', link: '/framework/springcloud/rpc' }
          ]
        }
      ],

      '/middleware/': [
        {
          text: 'Web 容器',
          collapsed: false,
          items: [{ text: 'Tomcat 源码详解', link: '/middleware/web/tomcat' }]
        },
        {
          text: 'ORM 框架',
          collapsed: false,
          items: [{ text: 'MyBatis 源码详解', link: '/middleware/orm/mybatis' }]
        },
        {
          text: '分表分库框架',
          collapsed: false,
          items: [{ text: 'ShardingSphere 详解', link: '/middleware/sharding/shardingsphere' }]
        }
      ],

      '/database/': [
        {
          text: '关系型数据库',
          collapsed: false,
          items: [
            { text: 'MySQL 原理', link: '/database/mysql/principle' },
            { text: 'MySQL 调优', link: '/database/mysql/tuning' }
          ]
        },
        {
          text: 'NoSQL',
          collapsed: false,
          items: [
            { text: 'Redis', link: '/database/nosql/redis' },
            { text: 'MongoDB', link: '/database/nosql/mongodb' },
            { text: 'Elasticsearch', link: '/database/nosql/es' }
          ]
        }
      ],

      '/distributed/': [
        {
          text: '分布式理论',
          collapsed: false,
          items: [
            { text: 'CAP / BASE', link: '/distributed/theory/cap' },
            { text: '一致性算法', link: '/distributed/theory/consensus' }
          ]
        },
        {
          text: '分布式中间件',
          collapsed: false,
          items: [
            { text: '注册中心', link: '/distributed/middleware/registry' },
            { text: '分布式锁', link: '/distributed/middleware/lock' },
            { text: '分布式事务', link: '/distributed/middleware/transaction' }
          ]
        }
      ],

      '/devops/': [
        {
          text: '操作系统',
          collapsed: false,
          items: [{ text: 'Linux', link: '/devops/linux' }]
        },
        {
          text: '容器化',
          collapsed: false,
          items: [
            { text: 'Docker', link: '/devops/docker' },
            { text: 'Kubernetes', link: '/devops/k8s' }
          ]
        },
        {
          text: 'CI / CD',
          collapsed: false,
          items: [
            { text: 'Git', link: '/devops/git' },
            { text: 'Jenkins', link: '/devops/jenkins' }
          ]
        }
      ],

      '/tools/': [
        {
          text: 'IDE',
          collapsed: false,
          items: [{ text: 'IntelliJ IDEA', link: '/tools/ide/idea' }]
        },
        {
          text: '构建工具',
          collapsed: false,
          items: [
            { text: 'Maven', link: '/tools/build/maven' },
            { text: 'Gradle', link: '/tools/build/gradle' }
          ]
        }
      ],

      '/interview/': [
        {
          text: '全栈面试',
          collapsed: false,
          items: [{ text: '面试总览', link: '/interview/' }]
        }
      ],

      '/about/': [
        {
          text: '关于',
          collapsed: false,
          items: [{ text: '本站构建方法', link: '/about/' }]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RicardoWHao/learn-soft-engineering' }
    ],

    outline: {
      label: '本页目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdatedText: '最后更新',

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
