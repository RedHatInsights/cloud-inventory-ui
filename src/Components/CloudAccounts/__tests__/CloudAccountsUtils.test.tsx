import {
  CloudProviderLabelMap,
  ProviderKey,
  providerToApiParam,
} from '../CloudAccountsUtils';
describe('CloudAccountsUtils', () => {
  it('maps provider short names to full provider labels', () => {
    expect(CloudProviderLabelMap.AWS).toBe('AWS');
    expect(CloudProviderLabelMap.GCE).toBe('Google Cloud');
    expect(CloudProviderLabelMap.MSAZ).toBe('Azure');
  });

  it('maps provider labels to API params', () => {
    expect(providerToApiParam['AWS']).toBe('aws');
    expect(providerToApiParam['Azure']).toBe('azure');
    expect(providerToApiParam['Google Cloud']).toBe('gcp');
  });

  it('exposes correct CloudProviderLabelKey types', () => {
    const keys: ProviderKey[] = ['AWS', 'GCE', 'MSAZ'];
    expect(keys).toContain('AWS');
    expect(keys).toContain('GCE');
    expect(keys).toContain('MSAZ');
  });

  it('contains only expected provider keys', () => {
    expect(Object.keys(CloudProviderLabelMap)).toEqual(['AWS', 'GCE', 'MSAZ']);
  });

  it('matches provider mapping snapshot', () => {
    expect(CloudProviderLabelMap).toMatchInlineSnapshot(`
      {
        "AWS": "AWS",
        "GCE": "Google Cloud",
        "MSAZ": "Azure",
      }
    `);
  });
});
