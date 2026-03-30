# 构建问题修复计划

## 问题分析

通过分析 `d:\Desktop\logs_62538126863` 中的构建日志，发现所有平台构建失败的根本原因是：

### 问题：中文语言文件编码损坏

**错误信息**:
```
Unterminated string literal
Unexpected "}" in JSON
```

**原因**: `src/lang/zh/` 目录下的 JSON 文件中，中文字符串被截断，导致 JSON 格式错误。

**受影响的文件**（根据日志）:
| 文件 | 行号 | 问题示例 |
|------|------|----------|
| `apache.json` | 6 | `"LimitRequestBody": "字节. 文件上传大小限制. 0: 不限` |
| `appLog.json` | 9 | `"execStartCommand": "开始执行启动命` |
| `aside.json` | 3 | `"webServer": "Web服务` |
| `base.json` | 18 | 字符串截断 |
| `mailpit.json` | 2 | 字符串截断 |
| `menu.json` | 4 | `"checkForUpdates": "检测更` |
| `redis.json` | 3 | `"databases": "数据库数` |
| `service.json` | 1 | 文件损坏，只有 `}` |
| `setup.json` | 2 | `"tsinghua": "清华大学下载` |
| `toolType.json` | 3 | `"Converter": "转换` |
| `util.json` | 6 | `"pageLimitTips": "限制页面地址必须包含此处字符` |
| `versionmanager.json` | 3 | 字符串截断 |

## 修复步骤

### 步骤 1: 检查损坏的文件

读取所有受影响的 JSON 文件，确认损坏程度。

### 步骤 2: 从原始仓库恢复文件

从 FlyEnv 原始仓库获取正确的中文语言文件，或手动修复截断的字符串。

### 步骤 3: 验证 JSON 格式

确保所有 JSON 文件格式正确，字符串完整。

### 步骤 4: 提交并推送修复

```bash
git add -A
git commit -m "fix: 修复中文语言文件编码问题"
git push origin master
git push origin --delete v1.1.0
git tag -d v1.1.0
git tag v1.1.0
git push origin v1.1.0
```

## 预期结果

修复后，所有 5 个平台的构建应该都能成功完成。
