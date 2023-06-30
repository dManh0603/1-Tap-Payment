import { Box, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { Button } from '@chakra-ui/react'
import axios from 'axios'

const ZaloPay = ({ amount }) => {

  const userToken = localStorage.getItem('userToken');
  const [paymentMethod, setPaymentMethod] = useState('ATM');
  const toast = useToast();
  const handleRadioChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleClick = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      const body = {
        amount: parseFloat(amount),
        paymentMethod
      }
      console.log(body)
      const response = await axios.post('/api/zalopay/create', body, config)
      console.log(response)
      if (response.status === 200) {
        window.open(response.data.order_url, '_blank');
      }
      // Open a new tab with the order URL
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      console.log("end of request")
    }

  }

  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/blue.css" />
      </Helmet>
      <Box >
        <p>Vui lòng chọn hình thức thanh toán:</p>
        <div className="mb-1">
          <label><input value={'zalopayapp'} onChange={handleRadioChange} type="radio" name="iCheck" className="iradio_flat-blue" /> Ví <img src="/images/logo-zalopay.svg" alt="" style={{ display: "inline" }} /></label>
        </div>
        <div className="mb-1">
          <label><input value={'CC'} onChange={handleRadioChange} type="radio" name="iCheck" className="iradio_flat-blue" /> Visa, Mastercard, JCB <span className="txtGray">(qua cổng ZaloPay)</span></label>
        </div>
        <div className="mb-1">
          <label><input value={'ATM'} onChange={handleRadioChange} type="radio" name="iCheck" className="iradio_flat-blue" defaultChecked /> Thẻ ATM <span className="txtGray">(qua cổng ZaloPay)</span></label>
        </div>
        <Button colorScheme='blue' mb={3} onClick={handleClick}>Tiếp tục với ZaloPay</Button>
      </Box>
    </>
  )
}

export default ZaloPay