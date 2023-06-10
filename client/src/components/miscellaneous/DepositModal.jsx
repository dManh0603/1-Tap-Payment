import React, { useState } from 'react'
import { UserState } from '../../contexts/UserProvider';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useDisclosure } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons';

const DepositModal = () => {
  const { isOpen: isDepositOpen, onOpen: onDepositOpen, onClose: onDepositClose } = useDisclosure();
  const [amount, setAmount] = useState(0);
  // const { user } = UserState();
  const navigate = useNavigate();

  const goPay = () => {
    navigate('/me/deposit', {
      state: {
        amount,
      },
    });
  };
  return (
    <>
      <Button mr={3} colorScheme='blue' onClick={onDepositOpen}>Deposit</Button>
      <Modal isOpen={isDepositOpen} onClose={onDepositClose}>
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
            <Button colorScheme='red' mr={3} onClick={onDepositClose}>
              Close
            </Button>
            {amount > 0 && (<Button colorScheme='blue' onClick={goPay}>Go to payment</Button>)}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DepositModal