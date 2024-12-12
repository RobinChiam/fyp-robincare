import React from 'react';
import { Box, Flex, Text, Stack, Avatar, Menu, MenuButton, MenuList, MenuItem, Button, Link } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../features/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      dispatch(clearUser()); // Clear user from Redux
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box bg="blue.500" px={8} py={4}>
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto" color="white">
        <Text fontSize="xl" fontWeight="bold">Healthcare System</Text>
        <Stack direction="row" spacing={4}>
            {/* Navigation Links */}
            <Stack direction="row" spacing={4}>
              <Link href="/" fontSize="lg">
                Home
              </Link>
              <Link href="/about" fontSize="lg">
                About Us
              </Link>
              <Link href="/contact" fontSize="lg">
                Contact Us
              </Link>
              <Link href="/blog" fontSize="lg">
                Blog
              </Link>
            </Stack>          {user ? (
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
                <Avatar size="md" src={`http://localhost:5000${user?.profilePicture}`} />
              </MenuButton>
              <MenuList>
                <MenuItem as="a" href="/dashboard/patient">Dashboard</MenuItem>
                <MenuItem as="a" href="/dashboard/patient/edit">Edit Account</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Stack direction="row" spacing={1} align="center" fontSize="lg" fontWeight="semibold">
            <Button as="a" href="/login" colorScheme="blue">Login</Button>
            <Button as="a" href="/register" colorScheme="blue">Register</Button>
            </Stack>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Header;

// return (
//   <Box bg={bgColor} px={8} py={4}>
//     <Flex
//       align="center"
//       justify="space-between"
//       maxW="1200px"
//       mx="auto"
//       color={textColor}
//     >
//       {/* Logo */}
//       <Text fontSize="xl" fontWeight="bold">
//         Healthcare System
//       </Text>

//       {/* Navigation Links */}
//       <Stack direction="row" spacing={4}>
//         <Link href="/" fontSize="lg">
//           Home
//         </Link>
//         <Link href="/about" fontSize="lg">
//           About Us
//         </Link>
//         <Link href="/contact" fontSize="lg">
//           Contact Us
//         </Link>
//         <Link href="/blog" fontSize="lg">
//           Blog
//         </Link>
//       </Stack>

//       {/* Authentication / Profile */}
//       {user ? (
//           <Menu>
//               <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
//                   <Avatar size="md" src={`http://localhost:5000${user?.profilePicture}`} />
//               </MenuButton>
//               <MenuList>
//                   <MenuItem as="a" href="/dashboard/patient" color={'black'}>
//                   Dashboard
//                   </MenuItem>
//                   <MenuItem as="a" href="/dashboard/patient/edit" color={'black'}>
//                   Edit Account
//                   </MenuItem>
//                   <MenuItem onClick={handleLogout} color={'black'}>
//                   Logout
//                   </MenuItem>
//               </MenuList>
//           </Menu>
//       ) : (
//         <Stack direction="row" spacing={1} align="center" fontSize="lg" fontWeight="semibold">
//           <Link href="/login" _hover={{ textDecoration: 'underline' }}>
//             Login
//           </Link>
//           <Text>/</Text>
//           <Link href="/register" _hover={{ textDecoration: 'underline' }}>
//             Register
//           </Link>
//         </Stack>
//       )}
//     </Flex>
//   </Box>