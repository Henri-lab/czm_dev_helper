import defaultSettings from '@/assets/theme/settings'

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const theme_0 = 'body-theme-light'
const theme_1 = 'body-theme-dark'

const useSettingsStore = defineStore(
  'settings',
  {
    state: () => ({
      title: '',
      theme: storageSetting.theme || theme_0,
      sideTheme: storageSetting.sideTheme || sideTheme,
      showSettings: showSettings,
      topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
      tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
      fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
      sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
      dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
    }),
    actions: {
      // 修改布局设置
      changeSetting(data) {
        const { key, value } = data
        if (this.hasOwnProperty(key)) {
          this[key] = value
        }
      },
      // 设置网页标题
      setHtmlTitle(title) {
        this.title = title
        if (this.dynamicTitle) {
          document.title = title + ' - ' + defaultSettings.title
        } else {
          document.title = defaultSettings.title
        }
      },
      // 切换主题
      toggleTheme() {
        document.body.classList.remove(this.theme);
        this.theme = this.theme === theme_0 ? theme_1 : theme_0;
        document.body.classList.add(this.theme);
      },
    }
  })

export default useSettingsStore