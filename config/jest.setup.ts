import '@testing-library/jest-dom/jest-globals';

const useChromeMock = () => ({
  hideGlobalFilter: jest.fn(),
  updateDocumentTitle: jest.fn(),
  auth: {
    getToken: () => Promise.resolve('TOKEN'),
    getUser: () =>
      Promise.resolve({
        identity: {
          account_number: '0',
          type: 'User',
          user: {
            is_org_admin: true,
            email: 'john.doe@redhat.com',
          },
        },
        entitlements: {
          hybrid_cloud: { is_entitled: true },
          insights: { is_entitled: true },
          openshift: { is_entitled: true },
          smart_management: { is_entitled: false },
        },
      }),
  },
  appAction: jest.fn(),
  appObjectId: jest.fn(),
  on: jest.fn(),
  getUserPermissions: () =>
    Promise.resolve([
      { resourceDefinitions: [], permission: 'subscriptions:manifests:read' },
      {
        resourceDefinitions: [],
        permission: 'subscriptions:manifests:write',
      },
    ]),
});

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: useChromeMock,
  useChrome: useChromeMock,
}));
