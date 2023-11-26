import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'bun run build && bun run preview',
		port: 4173,
		env: {
			PUBLIC_DISABLE_ANALYTICS: '1'
		}
	},
	testDir: 'tests',
	outputDir: 'test-results/playwright',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	reporter: [
		process.env.CI ? ['github'] : ['list'],
		[
			'html',
			{
				open: process.env.CI ? 'never' : 'always'
			}
		]
	],
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	use: {
		trace: 'on-first-retry',
		video: 'on-first-retry',
		screenshot: 'only-on-failure'
	}
};

export default config;
