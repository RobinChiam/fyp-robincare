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

  const getDashboardLink = () => {
    switch (user?.role) {
      case "patient":
        return "/dashboard/patient";
      case "doctor":
        return "/dashboard/doctor";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/";
    }
  };

  const profilePictureUrl = user?.profilePicture
    ? `http://localhost:5000${user.profilePicture}` // Prepend base URL if profilePicture is set
    : "/default-avatar.png"; // Fallback to a default avatar

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
        <Box as="a" href="/dashboard/doctor" _hover={{ backgroundColor: "blue.600" }} padding="2" borderRadius="md">
          Dashboard
        </Box>
        <Menu>
          <MenuButton as={Button} backgroundColor={"blue.500"} _hover={{ backgroundColor: "blue.600" }} color={"white"}>
            Blogs
          </MenuButton>
          <MenuList>
            <MenuItem as="a" href="/dashboard/doctor/write-blog" color={textColor}>
              Write a Blog
            </MenuItem>
            <MenuItem as="a" href="/dashboard/doctor/view-blog" color={textColor}>
              See your Blogs
            </MenuItem>
          </MenuList>
        </Menu>
        <Box as="a" href="/dashboard/doctor/history" padding="2" borderRadius="md">
           Appointments History
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
              <Avatar size="md" src={profilePictureUrl} />
            </MenuButton>
            <MenuList>
            <MenuItem as="a" href={getDashboardLink()} color={textColor}>
                  Dashboard
                </MenuItem>
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
