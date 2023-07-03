import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';

const TransferMoney = () => {
  const [searchValue, setSearchValue] = useState('');
  const [amount, setAmount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState(null);
  const handleClick = () => setShow(!show)
  const handleClose = () => {
    setPassword(null);
    onClose()
  }
  const transfer = async () => {

  }
  const handleAmountChange = (value) => {
    const numericValue = value ? parseInt(value.replace(/\s/g, ''), 10) : 0;
    setAmount(numericValue);
  };

  const formatAmount = (value) => {
    return value ? value.toLocaleString().replace(/,/g, ' ') : '0';
  };

  return (
    <>
      <Text fontSize={'2xl'} textAlign={'center'}>Transfer money</Text>
      <Text fontSize={'lg'}>Select a receiver</Text>
      <Input mb={3} variant='filled' placeholder='Provide email or username ...' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      <Text fontSize={'lg'}>Choose the amount</Text>
      <InputGroup>
        <InputLeftAddon children='VND' />
        <NumberInput
          defaultValue={0}
          min={0}
          keepWithinRange={true}
          clampValueOnBlur={false}
          value={formatAmount(amount)}
          onChange={handleAmountChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
      <Box mt={3}>
        <Button mr={3} colorScheme='blue' onClick={onOpen} isDisabled={amount <= 0}>Transfer</Button>
        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm your transfer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

              <FormControl>
                <FormLabel>Enter your password: </FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/* Error display */}
                error display
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={handleClose}>
                Close
              </Button>
              <Button colorScheme='blue' onClick={transfer} isDisabled={!password}>Transfer</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box >
    </>
  );
};

export default TransferMoney;
