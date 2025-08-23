import { test, expect } from '@playwright/test';

async function createUserAndGetTokens(api, apiURL: string) {
  const email = `paid+${Date.now()}@example.com`;
  const password = 'Test1234!';
  const reg = await api.post(`${apiURL}/auth/register/`, {
    data: { email, username: email, password }
  });
  const regData = await reg.json();
  return {
    email,
    access: regData.tokens?.access as string,
    refresh: regData.tokens?.refresh as string,
  };
}

test('analytics forbidden for free, allowed after mock-pay', async ({ request }) => {
  const apiURL = (test.info().config.metadata as any).apiURL as string;
  const { access } = await createUserAndGetTokens(request, apiURL);

  const analytics403 = await request.get(`${apiURL}/analytics/`, {
    headers: { Authorization: `Bearer ${access}` }
  });
  expect([401, 403]).toContain(analytics403.status());

  const pay = await request.post(`${apiURL}/billing/mock-pay/`, {
    headers: { Authorization: `Bearer ${access}` },
    data: { plan: 'paid-30', method: 'mock' }
  });
  expect(pay.ok()).toBeTruthy();

  const analytics200 = await request.get(`${apiURL}/analytics/`, {
    headers: { Authorization: `Bearer ${access}` }
  });
  expect(analytics200.ok()).toBeTruthy();
});
