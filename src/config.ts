const configuration = {
  enableSound: false,
};

export const getConfig = (setting: keyof typeof configuration) => {
  return configuration[setting];
};
