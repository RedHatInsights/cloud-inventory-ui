/**
 * React is noisy in the console when it throws an error. That's fine, but pollutes the tests. This quiets that down.
 * Source: https://github.com/testing-library/testing-library-docs/issues/1060
 * @param fn The thing that is expected to throw
 * @returns expectable result
 */
export function expectToThrow(fn: () => Promise<unknown>) {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  return expect(fn().finally(() => consoleErrorSpy.mockRestore()));
}
