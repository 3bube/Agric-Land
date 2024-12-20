"use client";

import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Circle,
  MenuDivider,
  VStack,
  Badge,
  HStack,
} from "@chakra-ui/react";
import {
  Bell,
  Home,
  Heart,
  Settings,
  Menu as MenuIcon,
  LogOut,
  BarChart,
  MessageCircle,
  FileText,
  ChartArea,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/utils/notification.utils";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
  showBadge?: boolean;
}

const getFarmerLinks = (): Array<LinkItemProps> => [
  { name: "Dashboard", icon: Home, path: "/dashboard/farmer" },
  { name: "Inquiries", icon: Bell, path: "/dashboard/farmer/inquiries" },
  { name: "Favorites", icon: Heart, path: "/dashboard/farmer/favorites" },
  { name: "Messages", icon: MessageCircle, path: "/dashboard/farmer/messages" },
  { name: "Agreements", icon: FileText, path: "/dashboard/farmer/agreements" },
  // { name: "Settings", icon: Settings, path: "/settings" },
];

const getLandownerLinks = (): Array<LinkItemProps> => [
  {
    name: "Dashboard",
    icon: Home,
    path: "/dashboard/landowner",
  },
  // { name: "My Listings", icon: Bell, path: "/dashboard/landowner/listings" },
  { name: "Inquiries", icon: Bell, path: "/dashboard/landowner/inquiries" },
  {
    name: "Analytics",
    icon: BarChart,
    path: "/dashboard/landowner/analytics",
  },
  {
    name: "Messages",
    icon: MessageCircle,
    path: "/dashboard/landowner/messages",
  },
  // {
  //   name: "Notifications",
  //   icon: Bell,
  //   path: "/dashboard/landowner/notifications",
  //   showBadge: true,
  // },
  {
    name: "Agreements",
    icon: FileText,
    path: "/dashboard/landowner/agreements",
  },
  // { name: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state, dispatch } = useAuth();

  const LinkItems =
    state.user?.role === "farmer" ? getFarmerLinks() : getLandownerLinks();

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => getNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount =
    data?.filter((notification) => !notification.read).length ?? 0;

  return (
    <Box minH="100vh" bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        LinkItems={LinkItems}
        unreadCount={unreadCount}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            LinkItems={LinkItems}
            unreadCount={unreadCount}
          />
        </DrawerContent>
      </Drawer>

      {/* Header for both mobile and desktop */}
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 8 }}
        height="20"
        position="fixed"
        w={{ base: "100%", md: "calc(100% - 240px)" }}
        zIndex={99}
        alignItems="center"
        bg={useColorModeValue("white", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <IconButton
            display={{ base: "flex", md: "none" }}
            variant="outline"
            onClick={onOpen}
            aria-label="open menu"
            icon={<MenuIcon />}
          />
          <Text
            display={{ base: "flex", md: "none" }}
            fontSize="2xl"
            ml={4}
            fontFamily="monospace"
            fontWeight="bold"
          >
            AgricLand
          </Text>
        </Flex>

        <Flex alignItems="center" gap={4}>
          <IconButton
            variant="ghost"
            aria-label="Notifications"
            icon={
              <HStack>
                <Bell />
                {unreadCount > 0 && (
                  <Badge
                    position="absolute"
                    top={0}
                    rounded={"full"}
                    right={0}
                    colorScheme="red"
                    variant="solid"
                    fontSize="xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </HStack>
            }
            onClick={() =>
              navigate(`/dashboard/${state.user?.role}/notifications`)
            }
          />

          <Menu>
            <MenuButton as={Flex} align="center" cursor="pointer" gap={2}>
              <Avatar size="sm" name={state.user?.name} />
              <Box display={{ base: "none", md: "block" }}>
                <Text fontWeight="medium" fontSize="sm">
                  {state.user?.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {state.user?.role.toUpperCase()}
                </Text>
              </Box>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<Settings className="h-4 w-4" />}>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<LogOut className="h-4 w-4" />}
                onClick={() => {
                  navigate("/auth");
                  dispatch({ type: "LOGOUT" });
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Box ml={{ base: 0, md: 60 }} p="4" pt="24">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
  LinkItems: Array<LinkItemProps>;
  unreadCount?: number;
}

const SidebarContent = ({
  onClose,
  LinkItems,
  unreadCount,
  ...rest
}: SidebarContentProps) => {
  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          👨🏾‍🌾AgricLand
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => {
            navigate(link.path);
            onClose();
          }}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "green.400",
        color: "white",
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};
