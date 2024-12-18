import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  useToast,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { register, login } from "@/utils/auth.utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<"farmer" | "landowner">("farmer");
  const [password, setPassword] = useState<string>("");
  const [view, setView] = useState<"signup" | "signin">("signup");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const user = await register({ name, email, password, role });
      toast({
        title: "Registration Successful",
        description: "You can now sign in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setView("signin");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      dispatch({ type: "LOGIN", payload: data });
      navigate(`/dashboard/${data.user.role}`);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    {
      text: `Password Strength - ${
        password.length > 0 && /[0-9!@#$%^&*]/.test(password)
          ? "Strong"
          : "Weak"
      }`,
      met: password.length > 0 && /[0-9!@#$%^&*]/.test(password),
    },
    {
      text: "Cannot contain your name or email address",
      met: !password.includes(email.split("@")[0]),
    },
    { text: "At least 8 characters", met: password.length >= 8 },
    {
      text: "Contains a number or symbol",
      met: /[0-9!@#$%^&*]/.test(password),
    },
  ];

  return (
    <Flex minH="100vh">
      {/* Left Side - Hero */}
      <Box
        display={{ base: "none", lg: "flex" }}
        w="50%"
        flexDir="column"
        p={10}
        pos="relative"
        bg="blue.500"
        color="white"
      >
        <Box
          pos="absolute"
          inset={0}
          // bgGradient="linear(to-br, blue.600, blue.400)"
          bg={"url(/images/farmer2.jpg)"}
          bgRepeat={"no-repeat"}
          bgSize={"cover"}
          opacity={0.9}
        />
        <Stack
          spacing={8}
          textAlign={"center"}
          pos="relative"
          zIndex={1}
          my={"auto"}
        >
          <Box>
            <Text fontSize="6xl" fontWeight="bold" mb={2}>
              Welcome to Agric Land
            </Text>
            <Text
              color="whiteAlpha.900"
              fontSize={"xl"}
              fontWeight={"semibold"}
            >
              Invest in Lands and Grow Your Business
            </Text>
          </Box>

          <Box mt="auto">
            <Text fontSize="5xl" fontWeight="bold" mb={4}>
              Seamless Collaboration
            </Text>
            <Text
              color="whiteAlpha.900"
              fontSize={"xl"}
              fontWeight={"semibold"}
              mb={8}
            >
              Landowners and farmers connect, transact, and grow together
            </Text>
            <HStack spacing={2}>
              <Box h={2} w={2} rounded="full" bg="white" />
              <Box h={2} w={2} rounded="full" bg="whiteAlpha.500" />
              <Box h={2} w={2} rounded="full" bg="whiteAlpha.500" />
            </HStack>
          </Box>
        </Stack>
      </Box>

      {/* Right Side - Form */}
      <Box flex={1} p={{ base: 8, lg: 12 }} maxW="xl" m={"auto"}>
        <Flex align="center" gap={2} mb={8}>
          {/* <Box h={6} w={6} rounded="full" bg="blue.500" /> */}
          👨🏾‍🌾
          <Text fontSize="xl" fontWeight="semibold">
            Agric Land
          </Text>
        </Flex>

        <Flex gap={1} mb={8}>
          <Button
            flex={1}
            variant={"solid"}
            colorScheme={view === "signup" ? "blue" : "gray"}
            onClick={() => setView("signup")}
          >
            Sign Up
          </Button>
          <Button
            flex={1}
            variant={"solid"}
            colorScheme={view === "signin" ? "blue" : "gray"}
            onClick={() => setView("signin")}
          >
            Sign In
          </Button>
        </Flex>

        <Flex direction="column" gap={4} justifyContent="center" mx="auto">
          {view === "signup" && (
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                size="lg"
                borderRadius="md"
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              size="lg"
              borderRadius="md"
            />
          </FormControl>

          <FormControl>
            <Flex justify="space-between" align="center" mb={2}>
              <FormLabel mb={0}>Password</FormLabel>
              {view === "signin" && (
                <Link fontSize="sm" color="blue.500">
                  Forgot Password?
                </Link>
              )}
            </Flex>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              size="lg"
              borderRadius="md"
            />
          </FormControl>

          {view === "signup" && (
            <Stack>
              <Text mb={2} fontSize={"md"} fontWeight={"semibold"}>
                Role
              </Text>
              <RadioGroup size={"md"} value={role}>
                <Radio value="farmer" onChange={() => setRole("farmer")}>
                  Farmer
                </Radio>
                <Radio value="landowner" onChange={() => setRole("landowner")}>
                  Landowner
                </Radio>
              </RadioGroup>
            </Stack>
          )}

          {view === "signup" && (
            <Stack spacing={2}>
              {passwordRequirements.map((req, i) => (
                <Flex key={i} align="center" gap={2}>
                  {req.met ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-red-600" />
                  )}
                  <Text fontSize="sm" color={req.met ? "green.600" : "red.600"}>
                    {req.text}
                  </Text>
                </Flex>
              ))}
            </Stack>
          )}

          <Button
            w="full"
            size="lg"
            colorScheme="blue"
            borderRadius="md"
            onClick={view === "signin" ? handleLogin : handleRegister}
            isLoading={loading}
          >
            {view === "signup" ? "Create Account" : "Sign In"}
          </Button>
        </Flex>

        <Text fontSize="sm" color="gray.500" textAlign="center" mt={8}>
          By signing up, you agree to our{" "}
          <Link color="blue.500">Terms of use</Link>
          {" & "}
          <Link color="blue.500">Privacy Policy</Link>
        </Text>
      </Box>
    </Flex>
  );
}
