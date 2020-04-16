const testUID = 'test-user';

const { getOrCreateCustomer } = require('../app/controllers/customers');

test('getOrCreateCustomer retrieves a Stripe Customer', async () => {
  const user = { uid: testUID, email: 'stripetest@email.com' };
  const customer = await getOrCreateCustomer(user.uid);

  expect(customer.id).toContain('cus_');
  expect(customer.metadata.userId).toEqual(user.uid);
});
