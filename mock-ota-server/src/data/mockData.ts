import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import {
  Property,
  Booking,
  OTAProvider,
  Address,
  PropertyAmenity,
  Room,
  GuestInfo,
  Pricing
} from '../types';

// Set seed for consistent data generation
const seed = parseInt(process.env.MOCK_DATA_SEED || '12345', 10);
faker.seed(seed);

// Common amenities
const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Heating',
  'Kitchen',
  'Washer',
  'Dryer',
  'TV',
  'Parking',
  'Pool',
  'Hot Tub',
  'Gym',
  'Workspace',
  'Breakfast',
  'Elevator',
  'Wheelchair Accessible',
  'Pets Allowed',
  'Smoke Detector',
  'Carbon Monoxide Detector',
  'Fire Extinguisher',
  'First Aid Kit'
];

const PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'hotel',
  'hostel',
  'resort',
  'bed_and_breakfast',
  'guesthouse'
] as const;

const ROOM_TYPES = [
  'Standard Room',
  'Deluxe Room',
  'Suite',
  'Studio',
  'One Bedroom',
  'Two Bedroom',
  'Penthouse',
  'Presidential Suite'
];

/**
 * Generate a mock address
 */
export function generateAddress(): Address {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    zipCode: faker.location.zipCode(),
    latitude: parseFloat(faker.location.latitude()),
    longitude: parseFloat(faker.location.longitude())
  };
}

/**
 * Generate mock amenities
 */
export function generateAmenities(count: number = 10): PropertyAmenity[] {
  const selectedAmenities = faker.helpers.arrayElements(COMMON_AMENITIES, count);
  return selectedAmenities.map(name => ({
    name,
    available: faker.datatype.boolean(0.9) // 90% chance of being available
  }));
}

/**
 * Generate mock rooms
 */
export function generateRooms(count: number = 3): Room[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    name: faker.helpers.arrayElement(ROOM_TYPES),
    type: faker.helpers.arrayElement(['single', 'double', 'suite', 'studio']),
    maxGuests: faker.number.int({ min: 1, max: 8 }),
    beds: faker.number.int({ min: 1, max: 4 }),
    bathrooms: faker.number.int({ min: 1, max: 3 }),
    size: faker.number.int({ min: 20, max: 150 }),
    amenities: faker.helpers.arrayElements(COMMON_AMENITIES, { min: 3, max: 8 })
  }));
}

/**
 * Generate a mock property
 */
export function generateProperty(provider?: OTAProvider): Property {
  const propertyType = faker.helpers.arrayElement(PROPERTY_TYPES);
  const roomCount = faker.number.int({ min: 1, max: 10 });

  return {
    id: uuidv4(),
    externalId: provider ? `${provider}-${uuidv4().substring(0, 8)}` : undefined,
    name: `${faker.company.name()} ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}`,
    description: faker.lorem.paragraphs(2),
    type: propertyType,
    address: generateAddress(),
    rooms: generateRooms(roomCount),
    amenities: generateAmenities(),
    images: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () =>
      faker.image.urlLoremFlickr({ category: 'building' })
    ),
    status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']), // 75% active
    rating: parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }).toFixed(1)),
    reviewCount: faker.number.int({ min: 0, max: 500 }),
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: faker.helpers.arrayElement([
      'Flexible: Full refund 1 day prior to arrival',
      'Moderate: Full refund 5 days prior to arrival',
      'Strict: 50% refund up until 1 week prior to arrival',
      'Super Strict: No refunds'
    ]),
    houseRules: [
      'No smoking',
      'No pets',
      'No parties or events',
      'Check-in time: 15:00 - 22:00',
      'Quiet hours: 22:00 - 08:00'
    ],
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent({ days: 30 })
  };
}

/**
 * Generate mock guest info
 */
export function generateGuestInfo(): GuestInfo {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number(),
    country: faker.location.country()
  };
}

/**
 * Generate mock pricing
 */
export function generatePricing(nights: number): Pricing {
  const nightlyRate = faker.number.int({ min: 50, max: 500 });
  const subtotal = nightlyRate * nights;
  const cleaningFee = faker.number.int({ min: 20, max: 100 });
  const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
  const taxes = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + cleaningFee + serviceFee + taxes;

  return {
    baseRate: nightlyRate,
    nightlyRate,
    totalNights: nights,
    subtotal,
    cleaningFee,
    serviceFee,
    taxes,
    total,
    currency: 'USD'
  };
}

/**
 * Generate a mock booking
 */
export function generateBooking(provider: OTAProvider, propertyId?: string): Booking {
  const checkIn = faker.date.future({ years: 1 });
  const checkOut = faker.date.soon({ days: faker.number.int({ min: 1, max: 14 }), refDate: checkIn });
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const status = faker.helpers.arrayElement([
    'confirmed',
    'confirmed',
    'confirmed',
    'pending',
    'cancelled'
  ]); // 60% confirmed

  return {
    id: uuidv4(),
    confirmationCode: faker.string.alphanumeric(8).toUpperCase(),
    propertyId: propertyId || uuidv4(),
    roomId: uuidv4(),
    guestInfo: generateGuestInfo(),
    checkIn,
    checkOut,
    guests: {
      adults: faker.number.int({ min: 1, max: 4 }),
      children: faker.number.int({ min: 0, max: 3 }),
      infants: faker.number.int({ min: 0, max: 2 })
    },
    pricing: generatePricing(nights),
    status,
    paymentStatus: status === 'cancelled' ? 'refunded' : faker.helpers.arrayElement(['paid', 'pending']),
    channel: provider,
    specialRequests: faker.datatype.boolean(0.3)
      ? [faker.lorem.sentence()]
      : undefined,
    notes: faker.datatype.boolean(0.2) ? faker.lorem.paragraph() : undefined,
    createdAt: faker.date.recent({ days: 30 }),
    updatedAt: faker.date.recent({ days: 7 }),
    cancelledAt: status === 'cancelled' ? faker.date.recent({ days: 3 }) : undefined,
    cancellationReason: status === 'cancelled' ? faker.lorem.sentence() : undefined
  };
}

/**
 * Generate multiple properties
 */
export function generateProperties(count: number, provider?: OTAProvider): Property[] {
  return Array.from({ length: count }, () => generateProperty(provider));
}

/**
 * Generate multiple bookings
 */
export function generateBookings(count: number, provider: OTAProvider, propertyId?: string): Booking[] {
  return Array.from({ length: count }, () => generateBooking(provider, propertyId));
}

/**
 * Generate sample data for all OTAs
 */
export function generateAllOTAData() {
  const providers = Object.values(OTAProvider);
  const data: Record<string, { properties: Property[]; bookings: Booking[] }> = {};

  providers.forEach(provider => {
    const properties = generateProperties(5, provider);
    const bookings = generateBookings(10, provider);

    data[provider] = {
      properties,
      bookings
    };
  });

  return data;
}

// Export in-memory storage for mock data
export const mockStorage = {
  properties: new Map<string, Property>(),
  bookings: new Map<string, Booking>(),

  // Initialize with some data
  init() {
    const allData = generateAllOTAData();

    Object.values(allData).forEach(({ properties, bookings }) => {
      properties.forEach(property => {
        this.properties.set(property.id, property);
      });

      bookings.forEach(booking => {
        this.bookings.set(booking.id, booking);
      });
    });

    return this;
  },

  reset() {
    this.properties.clear();
    this.bookings.clear();
    return this.init();
  }
};
