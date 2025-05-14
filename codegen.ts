import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema/orion.graphql",
  documents: "src/**/*.graphql",
  config: {
    scalars: {
      DateTime: "string",
      BigInt: "string",
      BigDecimal: "string",
      id_ASC: "string",
    },
    preResolveTypes: true, // avoid using Pick
  },
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
