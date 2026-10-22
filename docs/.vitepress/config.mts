import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '5motion',
  description: 'Documentation for 5motion FiveM scripts',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Skills', link: '/skills/' }
    ],
    sidebar: {
      '/skills/': [
        {
          text: '5motion_skills',
          items: [
            { text: 'Overview', link: '/skills/' },
            { text: 'Installation', link: '/skills/installation' },
            { text: 'Configuration', link: '/skills/configuration' },
            { text: 'Skills and perks', link: '/skills/skills' },
            { text: 'Bonuses', link: '/skills/bonuses' },
            { text: 'Activities', link: '/skills/activities' },
            { text: 'Integration', link: '/skills/integration' },
            { text: 'FAQ', link: '/skills/faq' }
          ]
        }
      ]
    },
    outline: [2, 3],
    search: { provider: 'local' },
    footer: { message: '5motion scripts for FiveM' }
  }
})
