import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { SettingsIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { UserState } from '../../contexts/UserProvider'
const ProfileModal = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const { user } = UserState();

  const logoutHandler = () => {
    localStorage.removeItem('userToken');
    Toast({
      title: 'Logout succesfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    })
    navigate('/')
  }

  return (
    <>
      <Button onClick={onOpen}><SettingsIcon /></Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            Email: {user.email}
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={logoutHandler}>Logout</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal