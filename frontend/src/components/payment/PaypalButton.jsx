import { useToast } from '@chakra-ui/react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useEffect } from 'react'

const PaypalButton = (props) => {

  const toast = useToast();
  const userToken = JSON.parse(localStorage.getItem('userToken'));


  return (
    <PayPalScriptProvider options={{
      'client-id': 'AVNKZIlA8FJsWuzK7MPH7WvNZGZfWryFumAIO-gYeVl5oNF0K30kfWWLeKVz7P3qCgJU6FQkjrW_QXXb',
    }}>
      {props.amount === undefined
        ? <div>{console.log(props.amount)}</div>
        : <PayPalButtons
          createOrder={(data, actions) => {
            actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: props.amount,
                  }
                }
              ]
            })
          }}
          onApprove={(data, actions) => {
            return actions.order.capture()
              .then((details) => {

                console.log('amount:', details.purchase_units[0].amount.value);
                console.log('details:', details);


                // const receive = {
                //   status: "COMPLETED",
                //   amount: "1.00",
                // }

                // const details = {
                //   "id": "4CD02420FE597212K",
                //   "intent": "CAPTURE",
                //   "status": "COMPLETED",
                //   "purchase_units": [
                //     {
                //       "reference_id": "default",
                //       "amount": {
                //         "currency_code": "USD",
                //         "value": "1.00"
                //       },
                //       "payee": {
                //         "email_address": "admin_test1@business.example.com",
                //         "merchant_id": "YS2BF4QVEM5J6"
                //       },
                //       "shipping": {
                //         "name": {
                //           "full_name": "John Doe"
                //         },
                //         "address": {
                //           "address_line_1": "1 Main St",
                //           "admin_area_2": "San Jose",
                //           "admin_area_1": "CA",
                //           "postal_code": "95131",
                //           "country_code": "US"
                //         }
                //       },
                //       "payments": {
                //         "captures": [
                //           {
                //             "id": "4W807302BV842814S",
                //             "status": "COMPLETED",
                //             "amount": {
                //               "currency_code": "USD",
                //               "value": "1.00"
                //             },
                //             "final_capture": true,
                //             "seller_protection": {
                //               "status": "ELIGIBLE",
                //               "dispute_categories": [
                //                 "ITEM_NOT_RECEIVED",
                //                 "UNAUTHORIZED_TRANSACTION"
                //               ]
                //             },
                //             "create_time": "2023-05-27T04:22:51Z",
                //             "update_time": "2023-05-27T04:22:51Z"
                //           }
                //         ]
                //       }
                //     }
                //   ],
                //   "payer": {
                //     "name": {
                //       "given_name": "John",
                //       "surname": "Doe"
                //     },
                //     "email_address": "user_test1@personal.example.com",
                //     "payer_id": "9U4WD3BGU5ABQ",
                //     "address": {
                //       "country_code": "US"
                //     }
                //   },
                //   "create_time": "2023-05-27T04:22:24Z",
                //   "update_time": "2023-05-27T04:22:51Z",
                //   "links": [
                //     {
                //       "href": "https://api.sandbox.paypal.com/v2/checkout/orders/4CD02420FE597212K",
                //       "rel": "self",
                //       "method": "GET"
                //     }
                //   ]
                // }

                toast({
                  title: 'Transaction completed',
                  duration: 5000,
                  status: 'success',
                  isClosable: true,
                  position: 'top-right'
                })
              })
          }}
          onError={error => {
            return console.log(error);
          }}
        />}
    </PayPalScriptProvider>
  )

}

export default PaypalButton