import {
  Cloud_Provider_Api_Params,
  Cloud_Providers,
  Cloud_Providers_Short_Names,
} from '../CloudAccountProviders';

describe('CloudAccountProviders constants', () => {
  it('exports the correct full provider names', () => {
    expect(Cloud_Providers).toEqual(['AWS', 'Azure', 'Google Cloud']);
  });

  it('exports the correct short names', () => {
    expect(Cloud_Providers_Short_Names).toEqual(['AWS', 'GCE', 'MSAZ']);
  });

  it('exports the correct API params', () => {
    expect(Cloud_Provider_Api_Params).toEqual(['aws', 'azure', 'gcp']);
  });

  it('all provider arrays have the same length', () => {
    expect(Cloud_Providers.length).toBe(3);
    expect(Cloud_Providers_Short_Names.length).toBe(3);
    expect(Cloud_Provider_Api_Params.length).toBe(3);
  });

  it('indexes align correctly between arrays', () => {
    expect(Cloud_Providers[0]).toBe('AWS');
    expect(Cloud_Providers_Short_Names[0]).toBe('AWS');
    expect(Cloud_Provider_Api_Params[0]).toBe('aws');
    expect(Cloud_Providers[1]).toBe('Azure');
    expect(Cloud_Providers_Short_Names[1]).toBe('GCE');
    expect(Cloud_Provider_Api_Params[1]).toBe('azure');
    expect(Cloud_Providers[2]).toBe('Google Cloud');
    expect(Cloud_Providers_Short_Names[2]).toBe('MSAZ');
    expect(Cloud_Provider_Api_Params[2]).toBe('gcp');
  });

  it('contains only strings in all arrays', () => {
    Cloud_Providers.forEach((item) => expect(typeof item).toBe('string'));
    Cloud_Providers_Short_Names.forEach((item) =>
      expect(typeof item).toBe('string')
    );
    Cloud_Provider_Api_Params.forEach((item) =>
      expect(typeof item).toBe('string')
    );
  });
});
