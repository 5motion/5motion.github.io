import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '5motion',
  description: 'Documentation for 5motion FiveM scripts',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    outline: [2, 3],
    search: { provider: 'local' },
    footer: { message: '5motion scripts for FiveM' }
  }
})
