type EnvVariableName = "ORION_GQL_ENDPOINT" | "ORION_AUTH_ENDPOINT";

export const getEnv = (
  name: EnvVariableName,
  throwIfMissing = true
): string => {
  const prefix =
    process.env.NODE_ENV === "production"
      ? `REACT_APP_PROD_`
      : `REACT_APP_DEV_`;
  const fullName = `${prefix}${name}`;
  const value = process.env[fullName];
  if (!value && throwIfMissing) {
    throw new Error(`Missing env: ${fullName}`);
  }
  return value || "";
};
