function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }

  return value;
}

export const env = {
  users: {
    mainUser: {
      username: required('USERNAME_MAIN_USER'),
      password: required('PASSWORD_MAIN_USER'),
      email: required('EMAIL_MAIN_USER'),
    },
  }
}