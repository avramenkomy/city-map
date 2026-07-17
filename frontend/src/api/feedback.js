import { postJson } from './client';


export function sendFeeback(payload) {
  return postJson('/api/feedback/', payload);
}
