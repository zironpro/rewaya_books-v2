import { AuthCallbackClient } from "./auth-callback-client";

export default async function AuthCallbackPage() {
	const oauthDataFromServer: any = null;
	return <AuthCallbackClient oauthDataFromServer={oauthDataFromServer} />;
}
