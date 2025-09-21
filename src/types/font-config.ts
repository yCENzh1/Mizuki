/**
 * 字体配置类型定义
 */
export interface FontConfig {
  enable: boolean; // 是否启用自定义字体系统
  global: {
    fontFamily: string; // 全局字体名称
    fallback: string[]; // 字体回退栈
  };
  code: {
    fontFamily: string; // 代码块字体名称
    fallback: string[]; // 代码字体回退栈
  };
  customFonts: CustomFont[]; // 自定义字体定义列表
  customCSS?: string; // 自定义CSS样式
}

export interface CustomFont {
  name: string; // 字体名称
  src: string; // 字体文件路径
  format: 'truetype' | 'woff' | 'woff2' | 'opentype' | 'embedded-opentype'; // 字体格式
  weight?: string | number; // 字体粗细
  style?: 'normal' | 'italic' | 'oblique'; // 字体样式
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'; // 字体显示策略
  unicodeRange?: string; // Unicode范围
}

/**
 * 完整的配置文件类型
 */
export interface ConfigJson {
  Analysis: {
    umami: {
      enabled: boolean;
      shareURL: string;
      scripts: string;
    };
  };
  fonts: FontConfig;
}