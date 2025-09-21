# 字体配置系统使用指南

## 概述

本项目提供了一个完整的字体配置系统，允许你通过 `src/config.json` 文件统一管理所有字体设置，包括全局字体、代码字体、自定义字体文件和CSS样式。

## 配置文件结构

### 基本配置

在 `src/config.json` 中的 `fonts` 部分：

```json
{
  "fonts": {
    "enable": true,
    "global": {
      "fontFamily": "ZenMaruGothic-Medium",
      "fallback": ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
    },
    "code": {
      "fontFamily": "JetBrains Mono Variable",
      "fallback": ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
    },
    "customFonts": [
      {
        "name": "ZenMaruGothic-Medium",
        "src": "/assets/font/ZenMaruGothic-Medium.ttf",
        "format": "truetype",
        "weight": "500",
        "display": "swap"
      }
    ],
    "customCSS": ""
  }
}
```

### 配置选项说明

#### 基础设置
- `enable`: 是否启用自定义字体系统
- `global.fontFamily`: 全局字体名称
- `global.fallback`: 全局字体回退栈
- `code.fontFamily`: 代码块字体名称
- `code.fallback`: 代码字体回退栈

#### 自定义字体定义
每个 `customFonts` 数组项支持以下属性：

- `name`: 字体名称（必需）
- `src`: 字体文件路径（必需）
- `format`: 字体格式（必需）
  - 支持: `truetype`, `woff`, `woff2`, `opentype`, `embedded-opentype`
- `weight`: 字体粗细（可选）
- `style`: 字体样式（可选）: `normal`, `italic`, `oblique`
- `display`: 字体显示策略（可选）: `auto`, `block`, `swap`, `fallback`, `optional`
- `unicodeRange`: Unicode范围（可选）

#### 自定义CSS
`customCSS` 字段允许你添加任意CSS样式：

```json
{
  "customCSS": ".font-config-enabled { font-feature-settings: 'liga' 1, 'kern' 1; }"
}
```

## 使用方式

### 1. 基本使用

修改 `src/config.json` 中的字体配置后，系统会自动：
- 生成对应的 `@font-face` 规则
- 更新 Tailwind CSS 字体配置
- 应用全局字体样式

### 2. 添加新字体

1. 将字体文件放入 `public/assets/font/` 目录
2. 在 `config.json` 的 `customFonts` 数组中添加字体定义
3. 更新 `global.fontFamily` 或 `code.fontFamily` 使用新字体

示例：
```json
{
  "customFonts": [
    {
      "name": "MyCustomFont",
      "src": "/assets/font/MyCustomFont.woff2",
      "format": "woff2",
      "weight": "400",
      "display": "swap"
    }
  ],
  "global": {
    "fontFamily": "MyCustomFont",
    "fallback": ["Arial", "sans-serif"]
  }
}
```

### 3. 多字重支持

为同一字体添加多个字重：

```json
{
  "customFonts": [
    {
      "name": "MyFont",
      "src": "/assets/font/MyFont-Regular.woff2",
      "format": "woff2",
      "weight": "400",
      "display": "swap"
    },
    {
      "name": "MyFont",
      "src": "/assets/font/MyFont-Bold.woff2",
      "format": "woff2",
      "weight": "700",
      "display": "swap"
    }
  ]
}
```

### 4. 网络字体

也可以使用网络字体：

```json
{
  "customFonts": [
    {
      "name": "Inter",
      "src": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
      "format": "woff2",
      "display": "swap"
    }
  ]
}
```

## 高级功能

### 1. 动态字体切换

在开发模式下，按 `Ctrl+Shift+F` 可以打开字体控制面板，实时切换不同的字体预设。

### 2. 自定义CSS样式

通过 `customCSS` 字段添加高级字体特性：

```json
{
  "customCSS": ".font-config-enabled { font-feature-settings: 'liga' 1, 'kern' 1, 'calt' 1; text-rendering: optimizeLegibility; }"
}
```

### 3. 响应式字体

结合CSS媒体查询实现响应式字体：

```json
{
  "customCSS": "@media (max-width: 768px) { .font-config-enabled { font-size: 14px; line-height: 1.4; } }"
}
```

## 性能优化

### 1. 字体显示策略

推荐使用 `font-display: swap` 确保文本始终可见：

```json
{
  "display": "swap"
}
```

### 2. 字体预加载

对于关键字体，可以在HTML中添加预加载：

```html
<link rel="preload" href="/assets/font/MyFont.woff2" as="font" type="font/woff2" crossorigin>
```

### 3. 字体子集

使用字体子集减少文件大小：

```json
{
  "unicodeRange": "U+0000-00FF, U+0131, U+0152-0153"
}
```

## 故障排除

### 1. 字体未生效

- 检查 `fonts.enable` 是否为 `true`
- 确认字体文件路径正确
- 检查浏览器开发者工具中的网络请求

### 2. TypeScript 错误

确保类型定义正确导入：

```typescript
import type { FontConfig } from '@/types/font-config';
```

### 3. 构建错误

如果 Tailwind 配置出现问题，检查 `tailwind.config.cjs` 中的字体配置加载逻辑。

## 示例配置

### 中文网站配置
```json
{
  "fonts": {
    "enable": true,
    "global": {
      "fontFamily": "PingFang SC",
      "fallback": ["Hiragino Sans GB", "Microsoft YaHei", "sans-serif"]
    },
    "code": {
      "fontFamily": "JetBrains Mono",
      "fallback": ["Consolas", "Monaco", "monospace"]
    },
    "customFonts": [],
    "customCSS": ".font-config-enabled { font-feature-settings: 'kern' 1; }"
  }
}
```

### 英文网站配置
```json
{
  "fonts": {
    "enable": true,
    "global": {
      "fontFamily": "Inter",
      "fallback": ["system-ui", "-apple-system", "sans-serif"]
    },
    "code": {
      "fontFamily": "Fira Code",
      "fallback": ["Monaco", "Consolas", "monospace"]
    },
    "customFonts": [
      {
        "name": "Inter",
        "src": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        "format": "woff2",
        "display": "swap"
      }
    ]
  }
}