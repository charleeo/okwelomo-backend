import { KycMiddleware } from './kyc.middleware';

describe('KycMiddleware', () => {
  it('should be defined', () => {
    expect(new KycMiddleware()).toBeDefined();
  });
});
