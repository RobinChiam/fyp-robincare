import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../features/userSlice";
import axios from "axios";

const Navbar = ({ onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userDetails);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        dispatch(setUser(userResponse.data)); // Save user to Redux
      } catch (error) {
        console.error("Error fetching user:", error.message);
        dispatch(clearUser()); // Clear user state on error
      }
    };

    fetchUser();
  }, [dispatch]);

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
      {/* Navigation Links */}
      <HStack spacing="8">
        <Box as="a" href="/" _hover={{ backgroundColor: "blue.600" }} padding={"2"} borderRadius={"md"}>
          Home
        </Box>
        <Menu>
          <MenuButton as={Button} backgroundColor={"blue.500"} _hover={{ backgroundColor: "blue.600" }} color={'white'}>
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
        <Box as="a" href="/dashboard/patient/records" _hover={{ backgroundColor: "blue.600" }} padding={"2"} borderRadius={"md"}>
          Health Records
        </Box>
      </HStack>

      {/* User Profile and Theme Toggle */}
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
              <MenuItem as="a" href="/dashboard/patient/edit" color={textColor}>
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

export default Navbar;
