// Mock for the Payload CMS module
export const getPayload = jest.fn().mockResolvedValue({
  config: {
    serverURL: 'http://localhost:3000',
    routes: {
      api: '/api',
      admin: '/admin',
    },
  },
});

export default {
  getPayload,
};
