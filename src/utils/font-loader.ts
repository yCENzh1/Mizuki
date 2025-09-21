/**
 * 字体加载器 - 在客户端动态应用字体配置
 */

import type { FontConfig } from '../types/font-config';

/**
 * 客户端字体配置应用器
 */
export class FontLoader {
  private fontConfig: FontConfig | null = null;

  /**
   * 初始化字体加载器
   */
  async init() {
    try {
      // 从服务端获取字体配置
      const response = await fetch('/api/font-config');
      if (response.ok) {
        this.fontConfig = await response.json();
        this.applyFontConfig();
      }
    } catch (error) {
      console.warn('Failed to load font config:', error);
    }
  }

  /**
   * 应用字体配置到页面
   */
  private applyFontConfig() {
    if (!this.fontConfig || !this.fontConfig.enable) return;

    // 添加字体配置类到body
    document.body.classList.add('font-config-enabled');

    // 动态加载字体文件
    this.loadCustomFonts();

    // 应用自定义CSS
    if (this.fontConfig.customCSS) {
      this.injectCustomCSS(this.fontConfig.customCSS);
    }
  }

  /**
   * 动态加载自定义字体
   */
  private loadCustomFonts() {
    if (!this.fontConfig?.customFonts) return;

    const style = document.createElement('style');
    style.id = 'dynamic-font-faces';
    
    const fontFaceRules = this.fontConfig.customFonts.map(font => {
      const properties = [
        `font-family: '${font.name}';`,
        `src: url('${font.src}') format('${font.format}');`
      ];
      
      if (font.weight) properties.push(`font-weight: ${font.weight};`);
      if (font.style) properties.push(`font-style: ${font.style};`);
      if (font.display) properties.push(`font-display: ${font.display};`);
      if (font.unicodeRange) properties.push(`unicode-range: ${font.unicodeRange};`);
      
      return `@font-face {\n  ${properties.join('\n  ')}\n}`;
    }).join('\n\n');

    style.textContent = fontFaceRules;
    document.head.appendChild(style);
  }

  /**
   * 注入自定义CSS
   */
  private injectCustomCSS(css: string) {
    const style = document.createElement('style');
    style.id = 'custom-font-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * 获取当前字体配置
   */
  getFontConfig(): FontConfig | null {
    return this.fontConfig;
  }

  /**
   * 更新字体配置
   */
  updateFontConfig(newConfig: FontConfig) {
    this.fontConfig = newConfig;
    
    // 移除旧的样式
    const oldFontStyle = document.getElementById('dynamic-font-faces');
    const oldCustomStyle = document.getElementById('custom-font-css');
    
    if (oldFontStyle) oldFontStyle.remove();
    if (oldCustomStyle) oldCustomStyle.remove();
    
    // 应用新配置
    this.applyFontConfig();
  }
}

// 创建全局字体加载器实例
export const fontLoader = new FontLoader();