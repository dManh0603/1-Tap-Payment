import { Box, Container, Image, Text, useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { UserState } from '../contexts/UserProvider'

const Depositpage = () => {

  const userToken = JSON.parse(localStorage.getItem('userToken'));
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state
  const toast = useToast();
  const { user } = UserState();

  useEffect(() => {
    if (!userToken) navigate('/');
  }, [])

  return (
    <>
      {user &&
        <Container maxW='xl' centerContent>
          <Box mt={'2'} w='100%'>
            <Image src='/banner-yersin.jpg' />
          </Box>
          <Box
            d={'flex'}
            justifyContent={'center'}
            p={3}
            bg={'white'}
            w={'100%'}
            m={'12px 0 16px 0'}
            borderRadius={'lg'}
            borderWidth={'1px'}
          >
            <Text fontSize={'4xl'} fontFamily={'Work sans'} textAlign={'center'}>
              NEU 1-Tap Parking Payment
            </Text>
          </Box>

          <Box
            bg={'white'}
            w={'100%'}
            p={'3'}
            borderRadius={'lg'}
            borderWidth={'1px'}
          >
            <Box maxW='32rem'>
              <Text fontSize={'3xl'} fontFamily={'Work sans'} textAlign={'center'}>You going to deposit to your balance {amount}$</Text>

              <Text fontSize='1xl'>
                Name: {user.name}
                <br></br>
                Email: {user.email}
                <br></br>
              </Text>

              <Box mt={3} display={'flex'} justifyContent={'center'}>

                <PayPalScriptProvider options={{
                  'client-id': 'AbO-450EKgswcTUPU9QyFgfflXjrUFLafcSS4jlPxJb2wSnK2bLvrOsUm-7OTct1RnQffQj-BNqe2Lbs',
                }}>
                  {amount === undefined
                    ? <div>{console.log(amount)}</div>
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
                      onApprove={(data, actions) => {
                        return actions.order.capture()
                          .then((details) => {
                            console.log('amount:', details.purchase_units[0].amount.value);
                            console.log('details:', details);
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
              </Box>
            </Box>
          </Box>
        </Container>
      }
    </>
  )
}

export default Depositpage