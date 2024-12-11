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

const DoctorNavbar = ({ user, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");

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
      {/* Left Side - Navigation Links */}
      <HStack spacing="8">
        <Box
          as="a"
          href="/dashboard/doctor"
          _hover={{ backgroundColor: "blue.600" }}
          padding="2"
          borderRadius="md"
        >
          Dashboard
        </Box>
        <Box
          as="a"
          href="/dashboard/doctor/appointments"
          _hover={{ backgroundColor: "blue.600" }}
          padding="2"
          borderRadius="md"
        >
          Appointments
        </Box>
        <Box
          as="a"
          href="/dashboard/doctor/chats"
          _hover={{ backgroundColor: "blue.600" }}
          padding="2"
          borderRadius="md"
        >
          Chats
        </Box>
      </HStack>

      {/* Right Side - User Profile and Theme Toggle */}
      <HStack spacing="6" align="center">
        {/* Theme Toggle IconButton */}
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          isRound
          size="md"
          bg="transparent"
          color={colorMode === "light" ? "orange.400" : "yellow.400"}
          _hover={{ bg: "transparent" }}
        />

        {/* User Profile Dropdown */}
        <Menu>
          <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
            <Avatar size="md" src={'http://localhost:5000' + user?.profilePicture} />
          </MenuButton>
          <MenuList>
            <MenuItem as="a" href="/dashboard/doctor/edit" color={textColor}>
              Edit Account
            </MenuItem>
            <MenuItem onClick={onLogout} color={textColor}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default DoctorNavbar;
