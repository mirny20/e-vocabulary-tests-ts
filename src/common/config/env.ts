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

    userWithoutWords: {
      username: required('USERNAME_CLEAN_USER'),
      password: required('PASSWORD_CLEAN_USER'),
      email: required('EMAIL_CLEAN_USER'),
    }
  }
}