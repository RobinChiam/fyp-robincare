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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      dispatch(clearUser()); // Clear user from Redux
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
      {/* Left Side - Navigation Links */}
      <HStack spacing="8">
        <Box as="a" href="/dashboard/doctor" _hover={{ backgroundColor: "blue.600" }} padding="2" borderRadius="md">
          Dashboard
        </Box>
        <Box as="a" href="/dashboard/doctor/appointments" _hover={{ backgroundColor: "blue.600" }} padding="2" borderRadius="md">
          Appointments
        </Box>
        <Box as="a" href="/dashboard/doctor/chats" _hover={{ backgroundColor: "blue.600" }} padding="2" borderRadius="md">
          Chats
        </Box>
      </HStack>

      {/* Right Side - User Profile and Theme Toggle */}
      <HStack spacing="6" align="center">
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

        {user ? (
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
              <Avatar size="md" src={`http://localhost:5000${user?.profilePicture}`} />
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
        ) : (
          <Button as="a" href="/login" colorScheme="blue">
            Login
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default DoctorNavbar;
