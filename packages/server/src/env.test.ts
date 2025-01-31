import { afterAllTests, beforeAllDb, beforeEachDb, expectThrow } from './utils/testing/testUtils';
import { parseEnv } from './env';

describe('env', function() {

	beforeAll(async () => {
		await beforeAllDb('env');
	});

	afterAll(async () => {
		await afterAllTests();
	});

	beforeEach(async () => {
		await beforeEachDb();
	});

	it('should parse env values', async function() {
		const result = parseEnv({
			DB_CLIENT: 'pg',
			DB_PORT: '123',
			MAILER_ENABLED: 'true',
			SIGNUP_ENABLED: 'false',
			TERMS_ENABLED: '0',
			ACCOUNT_TYPES_ENABLED: '1',
		});

		expect(result.DB_CLIENT).toBe('pg');
		expect(result.DB_PORT).toBe(123);
		expect(result.MAILER_ENABLED).toBe(true);
		expect(result.SIGNUP_ENABLED).toBe(false);
		expect(result.TERMS_ENABLED).toBe(false);
		expect(result.ACCOUNT_TYPES_ENABLED).toBe(true);
	});

	it('should overrides default values', async function() {
		expect(parseEnv({}).DB_USER).toBe('joplin');
		expect(parseEnv({}, { DB_USER: 'other' }).DB_USER).toBe('other');
	});

	it('should validate values', async function() {
		await expectThrow(async () => parseEnv({ DB_PORT: 'notanumber' }));
		await expectThrow(async () => parseEnv({ MAILER_ENABLED: 'TRUE' }));
	});

});
