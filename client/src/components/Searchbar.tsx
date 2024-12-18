import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
  chakra,
} from "@chakra-ui/react";
import { useState } from "react";
import { Heart } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  location: string;
  size: number;
  price: number;
}

const mockListings: Listing[] = [
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
  {
    id: 3,
    title: "Grazing Fields",
    location: "Southwest",
    size: 200,
    price: 4000,
  },
];

export function SearchableListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const filteredListings = mockListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === "all" || listing.location === locationFilter)
  );

  return (
    <Box className="space-y-6">
      <Flex className="gap-4">
        <Select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="Midwest">Midwest</option>
          <option value="West Coast">West Coast</option>
          <option value="Southwest">Southwest</option>
        </Select>
      </Flex>
      <Box className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <Box key={listing.id} className="p-6 bg-white rounded-lg shadow-md">
            <Box className="flex justify-between">
              <Text fontSize="lg" fontWeight="bold">
                {listing.title}
              </Text>
              <Text fontSize="sm">{listing.location}</Text>
            </Box>
            <Box className="mt-2">
              <Text>Size: {listing.size} acres</Text>
              <Text>Price: ${listing.price}/month</Text>
            </Box>
            <Box className="mt-4 flex justify-between">
              <Button>View Details</Button>
              <Button variant="ghost" size="icon" className="flex items-center">
                <Heart className="h-4 w-4" />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
