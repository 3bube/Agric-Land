import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";

interface Favorite {
  id: number;
  title: string;
  location: string;
  size: number;
  price: number;
}

const mockFavorites: Favorite[] = [
  {
    id: 1,
    title: "Fertile Farmland",
    location: "Midwest",
    size: 100,
    price: 5000,
  },
  {
    id: 2,
    title: "Orchard Paradise",
    location: "West Coast",
    size: 50,
    price: 7500,
  },
];

export function FavoritesSection() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Your Favorites
      </Heading>
      <Flex flexWrap="wrap" gap={4}>
        {mockFavorites.map((favorite) => (
          <Card key={favorite.id} maxW="sm">
            <CardHeader>
              <Heading size="md">{favorite.title}</Heading>
              <Text fontSize="sm">{favorite.location}</Text>
            </CardHeader>
            <CardBody>
              <Text>Size: {favorite.size} acres</Text>
              <Text>Price: ${favorite.price}/month</Text>
            </CardBody>
            <CardFooter justifyContent="space-between" alignItems="center">
              <Button variant="link">View Details</Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
