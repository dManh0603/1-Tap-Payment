import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, InputGroup, Input, InputRightAddon, Stack, StackDivider, Text, useToast, Spinner } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Configuration = () => {

  const [isLoading, setIsLoading] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)
  const toast = useToast();
  const storedToken = localStorage.getItem('userToken')

  const [motorbikePrice, setMotorbikePrice] = useState(0);
  const [bicyclePrice, setBicyclePrice] = useState(0);

  const handleEditClick = () => {
    setIsDisabled(false);
  }

  const handleCancelClick = () => {
    setIsDisabled(true);
  }

  const handleSaveClick = async () => {
    try {

      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      }

      const body = {
        motorbikePrice,
        bicyclePrice
      }

      const { data } = await axios.put('/api/admin/config', body, config);

      console.log(data);
      toast({
        title: "Update configuration successfully",
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
    const fetchConfig = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }

        const { data } = await axios.get('/api/admin/config', config);
        setMotorbikePrice(data.motorbikePrice)
        setBicyclePrice(data.bicyclePrice)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig();
  }, [])

  return (
    <>
      {
        isLoading
          ? <Box pt={'40vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Box>
          : <Card m={4}>
            <CardHeader>
              {/* <Heading size='xl'>Configuration for checkout</Heading> */}
              <h1 className="h3 mb-0 text-gray-800">Configuration for checkout</h1>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box width={'30vw'}>
                  <Text mb={0} as={'b'} fontSize={'md'}>Motorbike price</Text>
                  <InputGroup>
                    <Input pt='1' mb={4} fontSize='md' placeholder={motorbikePrice}
                      value={motorbikePrice}
                      onChange={(e) => setMotorbikePrice(e.target.value)}
                      style={{ opacity: 1 }}
                      isDisabled={isDisabled} />
                    <InputRightAddon children='VND' />
                  </InputGroup>

                  <Text mb={0} as={'b'} fontSize={'md'}>Bicycle price</Text>
                  <InputGroup>
                    <Input pt='1' mb={4} fontSize='md' placeholder={bicyclePrice}
                      value={bicyclePrice}
                      onChange={(e) => setBicyclePrice(e.target.value)}
                      style={{ opacity: 1 }}
                      isDisabled={isDisabled} />
                    <InputRightAddon children='VND' />
                  </InputGroup>
                </Box>
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing='2'>
                {!isDisabled
                  ? <>
                    <Button variant='solid' onClick={handleSaveClick} colorScheme='blue'>
                      Save
                    </Button>
                    <Button variant='solid' onClick={handleCancelClick} colorScheme='gray'>
                      Cancel
                    </Button>
                  </>
                  : <Button variant='solid' onClick={handleEditClick} colorScheme='blue'>
                    Edit
                  </Button>}
              </ButtonGroup>
            </CardFooter>
          </Card>
      }
    </>
  )
}

export default Configuration