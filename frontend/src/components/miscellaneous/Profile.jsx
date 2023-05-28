import { Text } from '@chakra-ui/react'
import React from 'react'
import { UserState } from '../../contexts/UserProvider'

const Profile = () => {

  const { user } = UserState();

  return (
    <>
      <Text fontSize='1xl'>
        Name: {user.name}
        <br></br>
        Email: {user.email}
        <br></br>
      </Text>
    </>
  )
}

export default Profile