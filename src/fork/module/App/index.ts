import { Base } from '../Base'
import { ForkPromise } from '@shared/ForkPromise'
import { arch } from 'os'
import axios from 'axios'
import { isLinux, isMacOS } from '@shared/utils'
import YAML from 'yamljs'
import { compareVersions } from '@shared/compare-versions'
import { isDEB } from '../../util/Linux'

class App extends Base {
  constructor() {
    super()
  }

  feedback(info: any) {
    return new ForkPromise(async (resolve, reject) => {
      const data = {
        ...info
      }

      axios({
        url: 'https://api.one-env.com/api/app/feedback_app',
        method: 'post',
        data,
        proxy: this.getAxiosProxy()
      })
        .then(() => {
          resolve(true)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  checkAppVersionUpdate() {
    return new ForkPromise(async (resolve, reject) => {
      let file = 'latest.yml'
      const a = arch()
      if (isMacOS()) {
        if (a === 'x64') {
          file = 'latest-mac.yml'
        } else {
          file = 'latest-mac-arm64.yml'
        }
      } else if (isLinux()) {
        if (a === 'x64') {
          file = 'latest-linux.yml'
        } else {
          file = 'latest-linux-arm64.yml'
        }
      }
      try {
        const res = await axios({
          url: `https://raw.githubusercontent.com/xpf0000/FlyEnv/refs/heads/master/${file}`,
          method: 'get',
          proxy: this.getAxiosProxy()
        })
        const content = res.data
        const json = YAML.parse(content)
        const version = json['version']
        const check = compareVersions(version, global.Server.APPVersion)
        let name = ''
        if (isMacOS()) {
          if (a === 'x64') {
            name = `FlyEnv-${version}.dmg`
          } else {
            name = `FlyEnv-${version}-arm64.dmg`
          }
        } else if (isLinux()) {
          const isdeb = await isDEB()
          const ext = isdeb ? '.deb' : '.rpm'
          if (a === 'x64') {
            name = `FlyEnv-${version}-x64${ext}`
          } else {
            name = `FlyEnv-${version}-arm64${ext}`
          }
        } else {
          name = `FlyEnv-Setup-${version}.exe`
        }
        const url = `https://github.com/xpf0000/FlyEnv/releases/download/v${version}/${name}`
        resolve({
          app: global.Server.APPVersion,
          online: version,
          check,
          url
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default new App()
