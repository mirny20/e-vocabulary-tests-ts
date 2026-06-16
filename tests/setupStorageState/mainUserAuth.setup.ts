import { test as setup } from '@playwright/test';
import { env } from '../../src/common/config/env';
import path from 'path';
import * as fs from 'fs';

export const authFile = path.join(__dirname, '..', '..', 'playwright', '.auth', 'mainUser.json');

setup('Authenticate main user', async ({ request }) => {
  const requestBodyData = {
    "email": "",
    "username": env.users.mainUser.username,
    "password": env.users.mainUser.password
  }

  const response = await request.post('https://build-wheat-rho.vercel.app/api/auth/login', {
    data: requestBodyData,
  });

  if (!response.ok()) {
    throw new Error(`Auth failed: ${response.status()} ${response.statusText()}`);
  }

  const responseBody = await response.json();

  const storage_state = {
    "cookies": [],
    "origins": [
      {
        "origin": "https://e-vocabulary.vercel.app",
        "localStorage": [
          {
            "name": "token",
            "value": responseBody.token,
          },
          {
            "name": "refreshToken",
            "value": responseBody.refreshToken,
          },
          {
            "name": "maxLengthQuote",
            "value": "91"
          }
        ]
      }
    ]
  }

  fs.mkdirSync(path.dirname(authFile), {recursive: true});
  fs.writeFileSync(authFile, JSON.stringify(storage_state, null, 2));
});