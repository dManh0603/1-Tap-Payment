import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { UserState } from "../../contexts/UserProvider";
import { Link } from '@chakra-ui/react';
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";

function DrawerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { logout } = UserState();
  return (
    <>
      <Button ref={btnRef} colorScheme='blue' onClick={onOpen}>
        More
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Actions</DrawerHeader>

          <DrawerBody>
            <Link href='/me/transactions'>
              Your transactions <ArrowForwardIcon />
            </Link>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={logout}>Logout</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerButton;