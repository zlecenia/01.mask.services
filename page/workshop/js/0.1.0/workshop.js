/**
 * workshop Component Tests
 */

import { describe, it, expect } from 'vitest';
import component from './index.js';

describe('workshop', () => {
  it('should initialize successfully', async () => {
    const result = await component.init();
    expect(result.success).toBe(true);
    expect(result.message).toContain('workshop');
  });

  it('should handle GET_CONFIG action', () => {
    const result = component.handle({ action: 'GET_CONFIG' });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should handle health check', () => {
    const result = component.handle({ action: 'HEALTH_CHECK' });
    expect(result.success).toBe(true);
    expect(result.healthy).toBe(true);
  });
});
