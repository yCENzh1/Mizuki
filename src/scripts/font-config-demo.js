/**
 * 字体配置演示脚本
 * 展示如何动态切换字体配置
 */

import { fontLoader } from '../utils/font-loader.js';

// 预设字体配置
const fontPresets = {
  default: {
    enable: true,
    global: {
      fontFamily: 'ZenMaruGothic-Medium',
      fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
    },
    code: {
      fontFamily: 'JetBrains Mono Variable',
      fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
    },
    customFonts: [
      {
        name: 'ZenMaruGothic-Medium',
        src: '/assets/font/ZenMaruGothic-Medium.ttf',
        format: 'truetype',
        weight: '500',
        display: 'swap'
      }
    ],
    customCSS: ''
  },
  
  system: {
    enable: true,
    global: {
      fontFamily: 'system-ui',
      fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
    },
    code: {
      fontFamily: 'ui-monospace',
      fallback: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
    },
    customFonts: [],
    customCSS: `
      .font-config-enabled {
        font-feature-settings: "liga" 1, "kern" 1;
        text-rendering: optimizeLegibility;
      }
    `
  },
  
  japanese: {
    enable: true,
    global: {
      fontFamily: 'GenEiGothic',
      fallback: ['Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif']
    },
    code: {
      fontFamily: 'JetBrains Mono Variable',
      fallback: ['ui-monospace', 'SFMono-Regular', 'monospace']
    },
    customFonts: [
      {
        name: 'GenEiGothic',
        src: '/assets/font/GenEiGothicP.ttf',
        format: 'truetype',
        weight: 'normal',
        display: 'swap'
      },
      {
        name: 'JetBrains Mono Variable',
        src: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
        format: 'woff2',
        display: 'swap'
      }
    ],
    customCSS: `
      .font-config-enabled {
        font-feature-settings: "palt" 1;
        text-spacing: ideograph-alpha ideograph-numeric;
      }
    `
  }
};

/**
 * 切换字体预设
 */
export function switchFontPreset(presetName) {
  const preset = fontPresets[presetName];
  if (preset) {
    fontLoader.updateFontConfig(preset);
    console.log(`Switched to ${presetName} font preset`);
  } else {
    console.warn(`Font preset "${presetName}" not found`);
  }
}

/**
 * 创建字体切换控制面板
 */
export function createFontControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'font-control-panel';
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 16px;
    z-index: 9999;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `;
  
  panel.innerHTML = `
    <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">字体配置</h3>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button onclick="switchFontPreset('default')" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">默认字体</button>
      <button onclick="switchFontPreset('system')" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">系统字体</button>
      <button onclick="switchFontPreset('japanese')" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">日文字体</button>
      <button onclick="document.getElementById('font-control-panel').remove()" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">关闭面板</button>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // 将函数暴露到全局作用域
  window.switchFontPreset = switchFontPreset;
}

// 开发模式下自动创建控制面板
if (import.meta.env.DEV) {
  document.addEventListener('DOMContentLoaded', () => {
    // 添加快捷键 Ctrl+Shift+F 打开字体控制面板
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (!document.getElementById('font-control-panel')) {
          createFontControlPanel();
        }
      }
    });
  });
}