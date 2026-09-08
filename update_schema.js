const fs = require("fs");
const code = fs.readFileSync("src/app/api/graphql/route.ts", "utf8");
const typeDefs = code.split("const typeDefs = gql`")[1].split("`;")[0];
fs.writeFileSync("schema.graphql", typeDefs);
