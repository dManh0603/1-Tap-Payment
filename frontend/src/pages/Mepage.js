import { Box, Button, Container, FormControl, FormLabel, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

const Mepage = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [amount, setAmount] = useState(0)

  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
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
          <Text fontSize={'3xl'} fontFamily={'Work sans'} textAlign={'center'}>Your infomation</Text>

          <Text fontSize='1xl'>
            Name: {user.name}
            <br></br>
            Email: {user.email}
            <br></br>
            Balance: {user.balance}
          </Text>

          <Box mt={3} display={'flex'} justifyContent={'end'}>
            <Button mr={3} colorScheme='blue' onClick={onOpen}>Deposit</Button>
          </Box>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Choose the amount to deposit</ModalHeader>
              <ModalCloseButton />
              <ModalBody>

                <FormControl>
                  <FormLabel>Amount ($)</FormLabel>
                  <NumberInput min={1} onChange={e => setAmount(e)} value={amount}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </ModalBody>

              <ModalFooter justifyContent={'center'}>
                <PayPalScriptProvider options={{
                  'client-id': 'AbO-450EKgswcTUPU9QyFgfflXjrUFLafcSS4jlPxJb2wSnK2bLvrOsUm-7OTct1RnQffQj-BNqe2Lbs',
                }}>
                  {amount === 0
                    ? <div>Please enter a valid number</div>
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
                        return actions.order.capture().then((details => {
                          alert('Transaction completed');
                          console.log('details:', details);
                          console.log('data:', data);
                        }))
                      }}
                      onError={error => {
                        console.log(error);
                      }}
                    />}

                </PayPalScriptProvider>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Container>
  )

}


export default Mepage