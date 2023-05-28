import { Box, Container, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { UserState } from '../contexts/UserProvider'
import Banner from '../components/miscellaneous/Banner';
import Profile from '../components/miscellaneous/Profile';
import axios from 'axios';

const Depositpage = () => {

  const userToken = JSON.parse(localStorage.getItem('userToken'));
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state
  const toast = useToast();
  const { user } = UserState();
  const [isLoading, setIsLoading] = useState(true);


  const handleTransaction = async (captureDetails) => {
    console.log('handle',captureDetails)
    try {
      console.log('amount:', captureDetails.purchase_units[0].amount.value);
      console.log('details:', captureDetails);

      const transaction = {
        payment_id: captureDetails.purchase_units[0].payments.captures[0].id,
        status: captureDetails.purchase_units[0].payments.captures[0].status,
        amount: captureDetails.purchase_units[0].payments.captures[0].amount.value,
        create_time: captureDetails.purchase_units[0].payments.captures[0].create_time,
        update_time: captureDetails.purchase_units[0].payments.captures[0].update_time,
        payer_id: captureDetails.payer.payer_id,
        email_address: captureDetails.payer.email_address
      };

      const response = await axios.post('/api/transaction/create', transaction, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (response.status === 201) {
        // const result = response.data;
        toast({
          title: 'Transaction completed',
          duration: 5000,
          status: 'success',
          isClosable: true,
          position: 'top-right'
        });
      } else {
        throw new Error('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Transaction failed',
        description: error.message,
        duration: 5000,
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  useEffect(() => {
    if (!userToken) navigate('/');
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)

  }, [])

  return (
    <>
      {user &&
        <Container maxW='xl' centerContent>
          <Banner />
          <Box
            bg={'white'}
            w={'100%'}
            p={'3'}
            borderRadius={'lg'}
            borderWidth={'1px'}
          >
            <Box maxW='32rem'>
              <Text fontSize={'3xl'} fontFamily={'Work sans'} textAlign={'center'}>You going to deposit to your balance {amount}$</Text>

              <Profile />

              <Box mt={3} display={'flex'} justifyContent={'center'}>

                <PayPalScriptProvider options={{
                  'client-id': 'AVNKZIlA8FJsWuzK7MPH7WvNZGZfWryFumAIO-gYeVl5oNF0K30kfWWLeKVz7P3qCgJU6FQkjrW_QXXb',
                }}>
                  {isLoading
                    ? <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                      size='xl'
                    />
                    : <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: amount,
                              }
                            }
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        return actions.order.capture()
                          .then(handleTransaction)
                      }}
                      onError={error => {
                        toast({
                          title: 'Error happend. Please contact admin or try again later',
                          duration: 5000,
                          status: 'error',
                          isClosable: true,
                          position: 'top-right'
                        })
                        return console.log(error);
                      }}
                    />}
                </PayPalScriptProvider>
              </Box>
            </Box>
          </Box>
        </Container>
      }
    </>
  )
}

export default Depositpage