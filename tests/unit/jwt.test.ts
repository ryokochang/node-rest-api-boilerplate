import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../src/utils/jwt';

describe('JWT Utility', () => {
  const payload = { userId: '12345' };

  it('should generate and verify an access token', () => {
    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });

  it('should generate and verify a refresh token', () => {
    const token = generateRefreshToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });
});
