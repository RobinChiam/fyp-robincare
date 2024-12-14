import React from 'react';
import { Box, Flex, Text, Stack, Avatar, Menu, MenuButton, MenuList, MenuItem, Button, Link } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../features/userSlice';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('token'); // Remove JWT
    dispatch(clearUser()); // Clear Redux state
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'patient':
        return '/dashboard/patient';
      case 'doctor':
        return '/dashboard/doctor';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  const getEditAccountLink = () => {
    switch (user?.role) {
      case 'patient':
        return '/dashboard/patient/edit';
      case 'doctor':
        return '/dashboard/doctor/edit';
      case 'admin':
        return '/dashboard/admin/edit';
      default:
        return '/';
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
          </Stack>          
          {user ? (
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
                <Avatar size="md" src={`http://localhost:5000${user?.profilePicture}`} />
              </MenuButton>
              <MenuList>
                <MenuItem as="a" href={getDashboardLink()} color="black">
                  Dashboard
                </MenuItem>
                <MenuItem as="a" href={getEditAccountLink()} color="black">
                  Edit Account
                </MenuItem>
                <MenuItem onClick={onLogout} color="black">
                  Logout
                </MenuItem>
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
