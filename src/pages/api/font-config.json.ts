import type { APIRoute } from 'astro';
import { getFontConfig } from '../../utils/font-config';

export const GET: APIRoute = async () => {
  try {
    const fontConfig = getFontConfig();
    
    return new Response(JSON.stringify(fontConfig), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // 缓存1小时
      }
    });
  } catch (error) {
    console.error('Failed to get font config:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to load font config' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};