import { Box, Container, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import Banner from '../components/miscellaneous/Banner';
import Profile from '../components/miscellaneous/Profile';
import axios from 'axios';
import { UserState } from '../contexts/UserProvider';

const Depositpage = () => {

  const userToken = localStorage.getItem('userToken');
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserState();

  const handleTransaction = async (captureDetails) => {
    console.log('paypal details captured', captureDetails);
    try {
      const data = {
        payment_id: captureDetails.purchase_units[0].payments.captures[0].id,
        status: captureDetails.purchase_units[0].payments.captures[0].status,
        amount: captureDetails.purchase_units[0].payments.captures[0].amount.value,
        create_time: captureDetails.purchase_units[0].payments.captures[0].create_time,
        update_time: captureDetails.purchase_units[0].payments.captures[0].update_time,
        payer_id: captureDetails.payer.payer_id,
        email_address: captureDetails.payer.email_address
      };

      const createApiResponse = await axios.post('/api/transaction/create', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (createApiResponse.status === 201) {
        const transaction = createApiResponse.data;
        console.log('/api/transaction/create data', transaction);


        const payload = {
          amount: transaction.amount,
          transactionId: transaction._id
        };

        const addApiResponse = await axios.put('/api/balance/add', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (addApiResponse.status === 200) {
          console.log('Amount added to balance');
        } else {
          throw new Error('Failed to add amount to balance');
        }

        toast({
          title: 'Transaction completed',
          duration: 5000,
          status: 'success',
          isClosable: true,
          position: 'top-right'
        });
        setTimeout(() => {
          navigate('/me')

        }, 1000)

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

  const handleCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          }
        }
      ],
    });
  };

  const handleApprove = async (data, actions) => {
    return actions.order.capture()
      .then(handleTransaction);
  };

  const handleError = error => {
    toast({
      title: 'Error happened. Please contact admin or try again later',
      duration: 5000,
      status: 'error',
      isClosable: true,
      position: 'top-right'
    });
    console.log(error);
  };

  useEffect(() => {
    console.log(process.env.REACT_APP_PAYPAL_CLIENT_ID)
    if (userToken === null) {
      console.log('no user token')
      navigate('/');
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [])

  return (
    <>
      {isLoading ? (
        <Container maxW={'xl'} centerContent mt={'16'}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Container>
      )
        :
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

              {/* <Profile user={user} /> */}

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
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                      onError={handleError}
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