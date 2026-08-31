import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
	// Return a dummy promise that will throw if awaited, but won't crash on import
	clientPromise = Promise.reject(
		new Error('Invalid/Missing environment variable: "MONGODB_URI"')
	);
} else {
	if (process.env.NODE_ENV === "development") {
		const globalWithMongo = global as typeof globalThis & {
			_mongoClientPromise?: Promise<MongoClient>;
		};

		if (!globalWithMongo._mongoClientPromise) {
			client = new MongoClient(uri, options);
			globalWithMongo._mongoClientPromise = client.connect();
		}
		clientPromise = globalWithMongo._mongoClientPromise;
	} else {
		client = new MongoClient(uri, options);
		clientPromise = client.connect();
	}
}

export default clientPromise;
