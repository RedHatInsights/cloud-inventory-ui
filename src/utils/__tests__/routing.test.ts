import { Paths, relativePath } from '../routing';

describe('Routing helpers', () => {
  it('Creates relative paths', () => {
    expect(relativePath(Paths.Oops)).toBe('./oops');
  });
});
