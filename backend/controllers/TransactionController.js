const paypal = require('@paypal/checkout-server-sdk');

const Environment = process.env.NODE_ENV === "production"
  ? paypal.core.LiveEnvironment
  : paypal.core.SandboxEnvironment

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);
class TransactionController {

  async create(req, res) {

    const request = new paypal.orders.OrdersCreateRequest();
    const total = req.body.amount;
    console.log('total: ', total);
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total,
              },
            },
          }
        }
      ]
    })

    try {
      const order = await paypalClient.execute(request);
      console.log('order', order)
      res.json({ id: order.result.id })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new TransactionController();
