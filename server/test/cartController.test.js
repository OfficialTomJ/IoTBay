// test/CartController.test.js

const request = require('supertest');
const app = require('../app');

describe('Cart Controller', () => {
  test('should add a product to the cart', async () => {
    expect.assertions(1);
    const response = await request(app)
      .post('/cart/add')
      .send({ productId: 1 });
    expect(response.status).toBe(201);
  });

  test('should update the quantity of a product in the cart', async () => {
    expect.assertions(1);
    const response = await request(app)
      .patch('/cart/update')
      .send({ quantity: 2 });
    expect(response.status).toBe(200);
  });

  test('should remove a product from the cart', async () => {
    expect.assertions(1);
    const response = await request(app)
      .delete('/cart/remove/1');
    expect(response.status).toBe(200);
  });
});
