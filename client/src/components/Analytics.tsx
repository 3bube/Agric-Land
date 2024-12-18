import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Users, DollarSign, MapPin } from "lucide-react";

const monthlyData = [
  { name: "Jan", inquiries: 40, listings: 24 },
  { name: "Feb", inquiries: 30, listings: 13 },
  { name: "Mar", inquiries: 20, listings: 38 },
  { name: "Apr", inquiries: 27, listings: 39 },
  { name: "May", inquiries: 18, listings: 48 },
  { name: "Jun", inquiries: 23, listings: 38 },
];

const locationData = [
  { location: "Lagos", value: 30 },
  { location: "Abuja", value: 25 },
  { location: "Port Harcourt", value: 20 },
  { location: "Kano", value: 15 },
  { location: "Ibadan", value: 10 },
];

interface StatsCardProps {
  title: string;
  stat: string;
  icon: any;
  increase: string;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon, increase } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py="5"
      shadow="xl"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.500")}
      rounded="lg"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Flex justifyContent="space-between">
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium">
            {stat}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {increase}
          </StatHelpText>
        </Box>
        <Box
          my="auto"
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent="center"
        >
          <Icon as={icon} w={8} h={8} />
        </Box>
      </Flex>
    </Stat>
  );
}

export default function Analytics() {
  return (
    <Box maxW="7xl" mx="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title="Total Listings"
          stat="45"
          icon={MapPin}
          increase="23%"
        />
        <StatsCard
          title="Active Users"
          stat="120"
          icon={Users}
          increase="12%"
        />
        <StatsCard
          title="Revenue"
          stat="₦150,000"
          icon={DollarSign}
          increase="36%"
        />
        <StatsCard title="Growth" stat="30%" icon={TrendingUp} increase="15%" />
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 5, lg: 8 }}
        mt={8}
      >
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Monthly Activity
            </Heading>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="#3182ce"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="listings"
                    stroke="#48bb78"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Listings by Location
            </Heading>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3182ce" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
