import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// 定义 Umami 配置类型
export interface UmamiConfig {
  enable: boolean;
  shareUrl: string;
  htmlScript: string;
  // 添加提取的配置信息
  websiteId?: string;
  url?: string;
}

// 默认配置
const defaultUmamiConfig: UmamiConfig = {
  enable: false,
  shareUrl: '',
  htmlScript: ''
};

/**
 * 从分享 URL 中提取 Umami 配置信息
 * @param shareUrl 分享 URL (例如: https://eu.umami.is/api/share/2dKQ5T0WrUn6AYtr)
 * @returns 包含 url、scriptUrl 和 websiteId 的对象
 */
function extractConfigFromShareUrl(shareUrl: string): { url: string; scriptUrl: string; websiteId: string } | null {
  try {
    if (!shareUrl) return null;
    
    // 解析 URL
    const urlObj = new URL(shareUrl);
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    
    // 提取 websiteId（路径的最后一部分）
    const pathParts = urlObj.pathname.split('/');
    const websiteId = pathParts[pathParts.length - 1];
    
    // 构造 scriptUrl
    const scriptUrl = `${baseUrl}/script.js`;
    
    return {
      url: baseUrl,
      scriptUrl,
      websiteId
    };
  } catch (error) {
    console.error('Error extracting config from share URL:', error);
    return null;
  }
}

/**
 * 从完整的 HTML 脚本标签中提取 Umami 配置信息
 * @param htmlScript 完整的 HTML 脚本标签
 * @returns 包含 url、scriptUrl 和 websiteId 的对象
 */
function extractConfigFromHtmlScript(htmlScript: string): { url: string; scriptUrl: string; websiteId: string } | null {
  try {
    if (!htmlScript) return null;
    
    // 提取 src 属性
    const srcMatch = htmlScript.match(/src=["']([^"']*)["']/);
    if (!srcMatch) return null;
    
    const scriptUrl = srcMatch[1];
    
    // 提取 data-website-id 属性
    const websiteIdMatch = htmlScript.match(/data-website-id=["']([^"']*)["']/);
    if (!websiteIdMatch) return null;
    
    const websiteId = websiteIdMatch[1];
    
    // 从 scriptUrl 提取基础 URL
    try {
      const urlObj = new URL(scriptUrl);
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      return {
        url: baseUrl,
        scriptUrl,
        websiteId
      };
    } catch (urlError) {
      console.error('Error parsing script URL:', urlError);
      return null;
    }
  } catch (error) {
    console.error('Error extracting config from HTML script:', error);
    return null;
  }
}

/**
 * 获取分享 token（如果需要）
 * @param shareUrl 分享 URL
 * @returns token 字符串或 null
 */
async function getShareToken(shareUrl: string): Promise<string | null> {
  try {
    if (!shareUrl) return null;
    
    const response = await fetch(shareUrl);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error('Error fetching share token:', error);
    return null;
  }
}

/**
 * 读取 Umami 配置
 * @returns Umami 配置对象
 */
export async function getUmamiConfig(): Promise<UmamiConfig> {
  try {
    // 获取 feature.ts 的路径
    const configPath = path.join(process.cwd(), 'src', 'feature.ts');
    
    // 检查文件是否存在
    if (!fs.existsSync(configPath)) {
      console.warn('feature.ts not found, using default Umami config');
      return defaultUmamiConfig;
    }
    
    // 使用 pathToFileURL 解决 Windows 上的 ESM 导入问题
    const configUrl = pathToFileURL(configPath).href;
    
    // 动态导入配置文件
    const configModule = await import(configUrl);
    const config = configModule.default || configModule;
    
    // 合并默认配置和用户配置
    const mergedConfig: UmamiConfig = {
      ...defaultUmamiConfig,
      ...(config.umami || {})
    };
    
    // 如果提供了 shareUrl，则从中提取配置信息
    if (mergedConfig.shareUrl) {
      const extractedConfig = extractConfigFromShareUrl(mergedConfig.shareUrl);
      if (extractedConfig) {
        mergedConfig.websiteId = extractedConfig.websiteId;
        mergedConfig.url = extractedConfig.url;
        
        // 获取分享 token
        const token = await getShareToken(mergedConfig.shareUrl);
        if (token) {
          (mergedConfig as any).token = token;
        }
      }
    }
    
    // 如果提供了 htmlScript，则从中提取配置信息
    if (mergedConfig.htmlScript) {
      const extractedConfig = extractConfigFromHtmlScript(mergedConfig.htmlScript);
      if (extractedConfig) {
        mergedConfig.websiteId = extractedConfig.websiteId;
        mergedConfig.url = extractedConfig.url;
      }
    }
    
    return mergedConfig;
  } catch (error) {
    console.error('Error reading Umami config:', error);
    return defaultUmamiConfig;
  }
}
