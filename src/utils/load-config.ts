// 通过动态导入的方式加载config.jsonc配置文件，避免构建工具直接解析
import { readFileSync } from 'node:fs';
import stripJsonComments from 'strip-json-comments';
import path from 'node:path';

// 使用异步导入的方式获取配置
export default (async () => {
  try {
    const configPath = path.join(process.cwd(), 'src', 'config.jsonc');
    const raw = readFileSync(configPath, 'utf-8');
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    console.error('Failed to load config.jsonc:', error);
    return {};
  }
})();

// 为了向后兼容，也提供同步版本
export const loadConfigSync = () => {
  try {
    const configPath = path.join(process.cwd(), 'src', 'config.jsonc');
    const raw = readFileSync(configPath, 'utf-8');
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    console.error('Failed to load config.jsonc:', error);
    return {};
  }
};