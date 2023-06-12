import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Checkbox, Heading, Input, Radio, RadioGroup, Stack, StackDivider, Text, useToast } from '@chakra-ui/react';

const UserDetails = () => {

  const { id } = useParams();
  const [userDetails, setUserDetails] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [isCardDisabled, setIsCardDisabled] = useState();
  const [isDisabled, setIsDisabled] = useState(true)
  const storedToken = localStorage.getItem('userToken')
  const toast = useToast();

  const handleEditClick = () => {
    setIsDisabled(false);
  }

  const handleCheckboxChange = (value) => {
    setIsCardDisabled(value);
  };

  const handleSaveClick = async () => {
    try {

      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }

      }
      const body = {
        email: email,
        name: name,
        balance: balance,
        card_disabled: isCardDisabled === 'Disabled' ? true : false,
      }

      const { data } = await axios.put(`/api/admin/user/${id}`, body, config)
      setUserDetails(data.user);

      toast({
        title: "Update user successfully",
        duration: 5000,
        position: 'top-right',
        isClosable: true,
        status: 'success'
      })
    } catch (error) {
      console.log(error);
      toast({
        title: 'Please try again later !',
        duration: 5000,
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    } finally {
      setIsDisabled(true);
    }

  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      const { data } = await axios.get(`/api/admin/user/${id}`, config);
      if (data) {
        setUserDetails(data);
        setIsCardDisabled(data.card_disbaled ? 'Disabled' : 'Activate')
      }
    }
    fetchUserDetails();
  }, [])

  return (
    <>
      {userDetails &&
        <Card m={4}>
          <CardHeader>
            <Heading size='xl'>User #{userDetails._id}</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box width={'30vw'}>
                <Heading size='md' textTransform='uppercase'>
                  Summary
                </Heading>

                <Text mb={0} as={'b'} fontSize={'md'}>Name</Text>
                <Input pt='1' mb={4} fontSize='md' placeholder={userDetails.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ opacity: 1 }}
                  isDisabled={isDisabled} />

                <Text mb={0} as={'b'} fontSize={'md'}>Email</Text>
                <Input pt='1' mb={4} fontSize='md' placeholder={userDetails.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ opacity: 1 }}
                  isDisabled={isDisabled} />

                <Text mb={0} as={'b'} fontSize={'md'}>Balance</Text>
                <Input pt='1' mb={4} fontSize='md' placeholder={userDetails.balance}
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  style={{ opacity: 1 }}
                  isDisabled={isDisabled} />

                <Text mt={4} as={'b'} fontSize='md'>
                  Card status:
                  {isDisabled
                    ? (userDetails.card_disbaled
                      ? <Badge ml={2} variant='outline' colorScheme='red'>
                        Disabled
                      </Badge>
                      : <Badge ml={2} variant='outline' colorScheme='green'>
                        Activated
                      </Badge>
                    )
                    : <RadioGroup onChange={handleCheckboxChange} value={isCardDisabled}>
                      <Stack direction='row'>
                        <Radio value='Activate' colorScheme='green'>Activate</Radio>
                        <Radio value='Disabled' colorScheme='red'>Disable</Radio>
                      </Stack>
                    </RadioGroup>
                  }
                </Text>
              </Box>
              <Box>
                <Heading size='md' textTransform='uppercase'>
                  Lastest Activity
                </Heading>
                <Text pt='1' fontSize='md'>
                  Check out the overview of your clients.
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Analysis
                </Heading>
                <Text pt='1' fontSize='md'>
                  See a detailed analysis of all your business clients.
                </Text>
              </Box>
            </Stack>
          </CardBody>
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='solid' onClick={handleEditClick} colorScheme='blue'>
                Edit
              </Button>
              {!isDisabled
                ? <Button variant='solid' onClick={handleSaveClick} colorScheme='blue'>
                  Save
                </Button>
                : <></>}
            </ButtonGroup>
          </CardFooter>
        </Card>
      }
    </>
  )
}

export default UserDetails