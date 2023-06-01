import { Box, Button, Container, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserState } from '../contexts/UserProvider';
import Banner from '../components/miscellaneous/Banner';

const Mepage = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const { user, fetchUser, userToken } = UserState();

  const goPay = () => {
    navigate('/me/deposit', {
      state: {
        amount,
      },
    });
  };

  useEffect(() => {
    if (user === null) return navigate('/');
    console.log('user', user);
    console.log('userToken', userToken);

    fetchUser();
  }, []);

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

                  <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                      Close
                    </Button>
                    {amount > 0 && (<Button colorScheme='blue' onClick={goPay}>Go to payment</Button>)}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </Box>
        </Container>

      }
    </>
  )
}

export default Mepage