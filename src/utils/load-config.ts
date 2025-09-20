import { readFileSync } from 'node:fs';
import stripJsonComments from 'strip-json-comments';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'src', 'config.jsonc');
const raw = readFileSync(configPath, 'utf-8');
export default JSON.parse(stripJsonComments(raw));