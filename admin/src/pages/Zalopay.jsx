import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { formatAmount } from '../helpers/ViewHelper'
import axios from 'axios'
const Zalopay = () => {

    const [queryValue, setQueryValue] = useState('')
    const storedToken = localStorage.getItem('userToken');
    const [queryLoading, setQueryLoading] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const toast = useToast()
    const handleQuery = async () => {
        try {
            setQueryLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            }

            const transactionData = {
                app_trans_id: queryValue,
                onlyQuery: true,
            }

            const { data } = await axios.post('/api/transaction/zalopay/query', transactionData, config);
            console.log(data)
            setQueryResult(data);

        } catch (error) {
            console.log(error)
            toast({
                title: 'Something wrong',
                position: 'top-right',
                duration: 3000,
                isClosable: true,
                status: 'error'
            })
        } finally {
            setQueryLoading(false)
        }
    }
    return (

        <Card>
            <CardHeader>
                <h1 className="h3 mb-0 text-gray-800">Query a Zalopay transaction</h1>
            </CardHeader>
            <CardBody maxWidth={'50%'}>
                <Text fontSize={'md'}>Please provide app transaction id</Text>
                <InputGroup>
                    <Input mb={3} variant='filled' placeholder='Provide app_trans_id'
                        value={queryValue}
                        onChange={(e) => setQueryValue(e.target.value)}
                    />
                    <InputRightElement  >
                        <SearchIcon color='gray.500' />
                    </InputRightElement>
                </InputGroup>
                {queryLoading
                    ? <>
                        <Spinner display={'block'} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                        <Text fontSize="md">Giao dịch đang được thực hiện, hãy giữ nguyên cửa sổ này.</Text>
                        <Text fontSize="md" color={'red'} as={'i'}>Nếu đóng cửa sổ này, giao dịch sẽ bị hủy.</Text>
                    </>
                    : <>
                        {queryResult &&
                            <Box mt={3}>
                                <Text fontSize={'xl'} as={'b'}>Zalopay Response:</Text>
                                <Text>Amount: {formatAmount(queryResult.amount)} VND</Text>
                                <Text>Return message: {queryResult.return_code === 1 ? 'Succeed' : 'Canceled'}</Text>
                                <Text>Zalopay transaction id: {queryResult.zp_trans_id}</Text>
                            </Box>}
                    </>}

            </CardBody>
            <CardFooter>
                <Button onClick={handleQuery} colorScheme='blue'>View here</Button>
            </CardFooter>
        </Card>
    )
}

export default Zalopay