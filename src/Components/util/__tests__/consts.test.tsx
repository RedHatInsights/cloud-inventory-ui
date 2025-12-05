import { cloudProviders } from '../consts';
describe('cloudProviders constant', () => {
  it('exports an array of providers', () => {
    expect(Array.isArray(cloudProviders)).toBe(true);
  });

  it('contains the correct cloud providers', () => {
    expect(cloudProviders).toEqual(['AWS', 'Azure', 'Google Cloud']);
  });

  it('has exactly 3 providers', () => {
    expect(cloudProviders.length).toBe(3);
  });

  it('contains AWS, Azure, and Google Cloud', () => {
    expect(cloudProviders).toContain('AWS');
    expect(cloudProviders).toContain('Azure');
    expect(cloudProviders).toContain('Google Cloud');
  });
});
