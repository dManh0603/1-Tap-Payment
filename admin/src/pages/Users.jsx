import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Badge, Box, Spinner } from '@chakra-ui/react'
import { formatDate } from '../helpers/ViewHelper';
import { DataTable } from 'simple-datatables';
import { useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet'

const Users = () => {
  const [users, setUsers] = useState([]);
  const storedToken = localStorage.getItem('userToken');
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!storedToken) return navigate('/')

    const fetchUsersInfo = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      try {
        const { data } = await axios.get('/api/admin/users', config);
        setUsers(data);
        console.log('user:', data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsersInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const table = new DataTable(tableRef.current, {
        // Configure the options for the table here
      });
      // Custom search bar styles
      const searchInput = tableRef.current.querySelector('.dataTables_filter input');
      if (searchInput) {
        searchInput.style.border = '1px solid black';
      }

      return () => {
        table.destroy();
      };
    }
  }, [isLoading]);

  return (
    <>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
      </Helmet>
      {isLoading && users
        ?
        <div className='w-100'>
          <Box pt={'40vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Box>
        </div>
        :
        <div id="content-wrapper" className="d-flex flex-column">
          <div className="container-fluid px-4">
            <h1 className="h3 mb-0 text-gray-800">Total users</h1>
            <div className="card mb-4">
              <div className="card-body">
                <table id="datatablesSimple" ref={tableRef}>
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Card status</th>
                      <th>Balance</th>
                      <th>Updated at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <a href={`/user/${u._id}`}><i className="fas fa-eye"></i></a>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.name}</td>
                        <td>{u.card_disabled
                          ? <Badge variant='outline' colorScheme='red'>
                            Disabled
                          </Badge>
                          : <Badge variant='outline' colorScheme='green'>
                            Activated
                          </Badge>}
                        </td>
                        <td>{u.balance} VND</td>
                        <td>{formatDate(u.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Users;
