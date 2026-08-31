/**
 * Feature flags for phased rollouts.
 * Phase 2: set FEATURE_FOOTER_DISCOVER=true to show footer Discover links.
 */
function readEnvFlag(name: string, defaultValue: boolean): boolean {
	const value = process.env[name];
	if (value === undefined) return defaultValue;
	return value === "true" || value === "1";
}

export const featureFlags = {
	footerDiscoverSection: readEnvFlag("FEATURE_FOOTER_DISCOVER", false),
} as const;
