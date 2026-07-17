import { postJson } from './client';


export function sendFeedback(payload) {
  return postJson('/api/feedback/', payload);
}
