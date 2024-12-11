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
import '../../styles/themeToggle.css';

const Navbar = ({ user, onLogout }) => {
    
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
        <Box as="a" href="/" _hover={{ backgroundColor: "blue.600" }} padding={"2"} borderRadius={"md"}>Home</Box>
        <Menu>
          <MenuButton as={Button} backgroundColor={"blue.500"} _hover={{ backgroundColor: "blue.600" }}>
            Appointments
          </MenuButton>
          <MenuList>
            <MenuItem as="a" href="/dashboard/patient/book" color={textColor} _hover={{ backgroundColor: "blue.600" }}>
              Book Appointments
            </MenuItem>
            <MenuItem as="a" href="/dashboard/patient/history" color={textColor} _hover={{ backgroundColor: "blue.600" }}>
              Appointment History
            </MenuItem>
          </MenuList>
        </Menu>
        <Box as="a" href="/dashboard/patient/records" _hover={{ backgroundColor: "blue.600" }} padding={"2"} borderRadius={"md"}>Health Records</Box>
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
        <Avatar size="sm" src={user?.profilePicture || "/default-avatar.png"} />
      </MenuButton>
      <MenuList>
        <MenuItem as="a" href="/dashboard/patient/edit" color={textColor}>
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

export default Navbar;
