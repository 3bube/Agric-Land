import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("farmer" | "landowner")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { state } = useAuth();
  const location = useLocation();
  const spinnerColor = useColorModeValue("green.500", "green.200");
  const bgColor = useColorModeValue("white", "gray.800");

  // Check if we're still loading the auth state
  if (state.loading) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={bgColor}
        direction="column"
        gap={4}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color={spinnerColor}
          size="xl"
        />
        <Text color="gray.500">Loading your profile...</Text>
      </Flex>
    );
  }

  // If user is not authenticated, redirect to login
  if (!state.user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(state.user?.role)) {
    return (
      <Box
        minH="100vh"
        p={8}
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl" color="red.500" textAlign="center">
          Access Denied: You don't have permission to view this page.
          <br />
          <Text as="span" fontSize="md" color="gray.500" mt={2}>
            Please contact support if you think this is a mistake.
          </Text>
        </Text>
      </Box>
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
