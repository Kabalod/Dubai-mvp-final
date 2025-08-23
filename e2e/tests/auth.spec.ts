import { test, expect, request } from '@playwright/test';

const uniqueEmail = () => `e2e+${Date.now()}@example.com`;

async function registerAndLogin(api, apiURL: string) {
  const email = uniqueEmail();
  const password = 'Test1234!';
  // register
  const reg = await api.post(`${apiURL}/auth/register/`, {
    data: { email, username: email, password }
  });
  expect(reg.ok()).toBeTruthy();
  const regData = await reg.json();
  const access = regData.tokens?.access as string;
  const refresh = regData.tokens?.refresh as string;
  expect(access).toBeTruthy();
  return { email, password, access, refresh };
}

test('profile unauthorized returns 401', async ({ request }) => {
  const apiURL = (test.info().config.metadata as any).apiURL as string;
  const res = await request.get(`${apiURL}/auth/profile/`);
  expect(res.status()).toBe(401);
});

test('register → profile 200 with auth', async ({ request }) => {
  const apiURL = (test.info().config.metadata as any).apiURL as string;
  const { access } = await registerAndLogin(request, apiURL);
  const res = await request.get(`${apiURL}/auth/profile/`, {
    headers: { Authorization: `Bearer ${access}` }
  });
  expect(res.ok()).toBeTruthy();
});

test('subscription requires auth', async ({ request }) => {
  const apiURL = (test.info().config.metadata as any).apiURL as string;
  const res = await request.get(`${apiURL}/billing/subscription/`);
  expect(res.status()).toBe(401);
});
