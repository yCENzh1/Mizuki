import type { FontConfig, CustomFont } from '../types/font-config';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

/**
 * 同步加载配置文件
 */
function loadConfigSync() {
  try {
    const configPath = path.join(process.cwd(), 'src', 'config.json');
    const raw = readFileSync(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load config.json:', error);
    return {};
  }
}

/**
 * 获取字体配置
 */
export function getFontConfig(): FontConfig {
  const config = loadConfigSync();
  return config.fonts || {
    enable: false,
    global: {
      fontFamily: 'system-ui',
      fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
    },
    code: {
      fontFamily: 'ui-monospace',
      fallback: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
    },
    customFonts: [],
    customCSS: ''
  };
}

/**
 * 生成@font-face CSS规则
 */
export function generateFontFaceCSS(fonts: CustomFont[]): string {
  return fonts.map(font => {
    const properties = [
      `font-family: '${font.name}';`,
      `src: url('${font.src}') format('${font.format}');`
    ];
    
    if (font.weight) {
      properties.push(`font-weight: ${font.weight};`);
    }
    
    if (font.style) {
      properties.push(`font-style: ${font.style};`);
    }
    
    if (font.display) {
      properties.push(`font-display: ${font.display};`);
    }
    
    if (font.unicodeRange) {
      properties.push(`unicode-range: ${font.unicodeRange};`);
    }
    
    return `@font-face {\n  ${properties.join('\n  ')}\n}`;
  }).join('\n\n');
}

/**
 * 生成字体族CSS规则
 */
export function generateFontFamilyCSS(fontConfig: FontConfig): string {
  if (!fontConfig.enable) return '';
  
  const globalFontStack = [
    `'${fontConfig.global.fontFamily}'`,
    ...fontConfig.global.fallback
  ].join(', ');
  
  const codeFontStack = [
    `'${fontConfig.code.fontFamily}'`,
    ...fontConfig.code.fallback
  ].join(', ');
  
  return `
/* 全局字体配置 */
.font-config-enabled {
  font-family: ${globalFontStack};
}

/* 代码字体配置 */
.font-config-enabled code,
.font-config-enabled pre,
.font-config-enabled .code-font {
  font-family: ${codeFontStack};
}
`.trim();
}

/**
 * 生成完整的字体CSS
 */
export function generateFontCSS(): string {
  const fontConfig = getFontConfig();
  
  if (!fontConfig.enable) return '';
  
  const parts = [];
  
  // 添加@font-face规则
  if (fontConfig.customFonts.length > 0) {
    parts.push(generateFontFaceCSS(fontConfig.customFonts));
  }
  
  // 添加字体族规则
  parts.push(generateFontFamilyCSS(fontConfig));
  
  // 添加自定义CSS
  if (fontConfig.customCSS) {
    parts.push(fontConfig.customCSS);
  }
  
  return parts.join('\n\n');
}

/**
 * 获取Tailwind CSS字体配置
 */
export function getTailwindFontConfig() {
  const fontConfig = getFontConfig();
  
  if (!fontConfig.enable) {
    return {};
  }
  
  const sansFonts: string[] = [fontConfig.global.fontFamily, ...fontConfig.global.fallback];
  const monoFonts: string[] = [fontConfig.code.fontFamily, ...fontConfig.code.fallback];
  
  return {
    fontFamily: {
      sans: sansFonts,
      mono: monoFonts
    }
  };
}

/**
 * 检查是否启用字体配置
 */
export function isFontConfigEnabled(): boolean {
  const fontConfig = getFontConfig();
  return fontConfig.enable;
}