import { Input, Text } from '@chakra-ui/react'
import React from 'react'
const Profile = (props) => {

  return (
    <>
      <Text fontSize={'3xl'} textAlign={'center'}>Your infomation</Text>
      <Text fontSize={'xl'}>Username</Text>
      <Input mb={3} variant='filled' placeholder='Username' value={props.name} isDisabled />
      <Text fontSize={'xl'}>Email</Text>
      <Input mb={3} variant='filled' placeholder='Email' value={props.email} isDisabled />
      <Text fontSize={'xl'}>Balance</Text>
      <Input mb={3} variant='filled' placeholder='Email' value={props.balance} isDisabled />

    </>
  )
}

export default Profile