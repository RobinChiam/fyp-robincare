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

const DoctorNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token"); // Remove JWT
    dispatch(clearUser());
    navigate("/login");
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
        <Box as="a" href="/dashboard/doctor" padding="2" borderRadius="md">
          Dashboard
        </Box>
        <Box as="a" href="/dashboard/doctor/appointments" padding="2" borderRadius="md">
          Appointments
        </Box>
        <Box as="a" href="/dashboard/doctor/chats" padding="2" borderRadius="md">
          Chats
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
