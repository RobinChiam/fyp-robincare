import React from "react";
import {
  Flex,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token"); // Remove JWT
    dispatch(clearUser()); // Clear Redux state
    navigate("/login");
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

  return (
    <Flex
      as="nav"
      bg="blue.500"
      color="white"
      px="6"
      py="4"
      justify="space-between"
      align="center"
    >
      <HStack spacing="8">
        <Box as="a" href="/dashboard/admin" padding="2" borderRadius="md">
          Dashboard
        </Box>
        <Box as="a" href="/dashboard/admin/doctors" padding="2" borderRadius="md">
          Doctors
        </Box>
        <Box as="a" href="/dashboard/admin/patients" padding="2" borderRadius="md">
          Patients
        </Box>
        <Box as="a" href="/dashboard/admin/invoices" padding="2" borderRadius="md">
          Invoices
        </Box>
        <Box as="a" href="/dashboard/admin/health-records" padding="2" borderRadius="md">
          Health Records
        </Box>
      </HStack>

      <HStack spacing="6" align="center">
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          isRound
          size="md"
        />

        {user ? (
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link">
              <Avatar size="md" src={user?.profilePicture} />
            </MenuButton>
            <MenuList>
              <MenuItem as="a" href={getDashboardLink()} color={textColor}>
                Dashboard
              </MenuItem>
              <MenuItem as="a" href="/dashboard/admin/edit" color={textColor}>
                Edit Account
              </MenuItem>
              <MenuItem onClick={onLogout} color={textColor}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button as="a" href="/login" colorScheme="blue">
            Login
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default AdminNavbar;
