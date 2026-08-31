import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "./schema.graphql",
	documents: [
		"src/graphql/**/*.ts",
		"src/graphql/**/*.tsx",
		"src/graphql/**/*.graphql",
		"src/graphql/**/*.gql",
	],
	generates: {
		"./src/types/graphql.ts": {
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-query",
				{
					add: {
						content: `
						export class TypedDocumentString<TResult, TVariables>
						extends String
						{
						__apiType?: import('@graphql-typed-document-node/core').DocumentTypeDecoration<TResult, TVariables> | undefined;
						
						constructor(private value: string, public __meta__?: Record<string, any>) {
							super(value);
						}

						toString(): string & import('@graphql-typed-document-node/core').DocumentTypeDecoration<TResult, TVariables> {
							return this.value as any;
						}
						}
						`,
					},
				},
			],
			config: {
				reactQueryVersion: 5,
				fetcher: {
					func: "@/lib/graphql-client#customFetcher",
					isReactHook: false,
				},
			},
		},
	},
};

export default config;
