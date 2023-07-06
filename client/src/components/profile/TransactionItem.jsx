import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const TransactionItem = (props) => {
  function convertToGMT7(dateString) {
    const date = new Date(dateString);
    const gmtOffset = 7 * 60 * 60 * 1000; // GMT+7 offset in milliseconds
    const gmt7Date = new Date(date.getTime() + gmtOffset);
    const formattedDate = gmt7Date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'GMT'
    });
    return formattedDate;
  }

  const { transaction } = props;

  return (
    <Box>
      <Heading size='sm' textTransform='uppercase'>
        You deposited {transaction.amount} $
      </Heading>
      <Text pt='2' fontSize='sm'>
        Method: {transaction.method}
        <br />
        Pay by: {transaction.info.payer_email_address}
        <br />
        Payment id: {transaction.info.payment_id}
        <br />
        Transactions id: {transaction._id}
        <br />
        {convertToGMT7(transaction.createdAt)}
      </Text>
    </Box>
  )
}

export default TransactionItem