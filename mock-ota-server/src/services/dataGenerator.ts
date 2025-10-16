import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { MockProperty, MockBooking, MockRatePlan, MockCalendar, MockChannel } from '../types';

export class DataGenerator {
  private static instance: DataGenerator;
  private generatedData: {
    properties: MockProperty[];
    bookings: MockBooking[];
    ratePlans: MockRatePlan[];
    calendars: MockCalendar[];
    channels: MockChannel[];
  } = {
    properties: [],
    bookings: [],
    ratePlans: [],
    calendars: [],
    channels: []
  };

  private constructor() {
    this.initializeChannels();
  }

  public static getInstance(): DataGenerator {
    if (!DataGenerator.instance) {
      DataGenerator.instance = new DataGenerator();
    }
    return DataGenerator.instance;
  }

  private initializeChannels(): void {
    const channels: MockChannel[] = [
      {
        id: uuidv4(),
        name: 'Airbnb',
        type: 'airbnb',
        isActive: true,
        apiEndpoint: 'https://api.airbnb.com/v2',
        credentials: {
          apiKey: faker.string.alphanumeric(32),
          secret: faker.string.alphanumeric(64),
          webhookUrl: 'https://api.airbnb.com/webhooks'
        },
        settings: {
          syncInterval: 300000, // 5 minutes
          autoAccept: true,
          minPrice: 50,
          maxPrice: 1000
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      },
      {
        id: uuidv4(),
        name: 'Booking.com',
        type: 'booking',
        isActive: true,
        apiEndpoint: 'https://distribution-xml.booking.com/2.0',
        credentials: {
          apiKey: faker.string.alphanumeric(32),
          secret: faker.string.alphanumeric(64),
          webhookUrl: 'https://distribution-xml.booking.com/webhooks'
        },
        settings: {
          syncInterval: 600000, // 10 minutes
          autoAccept: false,
          minPrice: 30,
          maxPrice: 800
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      },
      {
        id: uuidv4(),
        name: 'Expedia',
        type: 'expedia',
        isActive: true,
        apiEndpoint: 'https://api.expediapartnercentral.com/v3',
        credentials: {
          apiKey: faker.string.alphanumeric(32),
          secret: faker.string.alphanumeric(64),
          webhookUrl: 'https://api.expediapartnercentral.com/webhooks'
        },
        settings: {
          syncInterval: 900000, // 15 minutes
          autoAccept: true,
          minPrice: 40,
          maxPrice: 1200
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      },
      {
        id: uuidv4(),
        name: 'Agoda',
        type: 'agoda',
        isActive: true,
        apiEndpoint: 'https://api.agoda.com/v1',
        credentials: {
          apiKey: faker.string.alphanumeric(32),
          secret: faker.string.alphanumeric(64),
          webhookUrl: 'https://api.agoda.com/webhooks'
        },
        settings: {
          syncInterval: 450000, // 7.5 minutes
          autoAccept: false,
          minPrice: 25,
          maxPrice: 600
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      },
      {
        id: uuidv4(),
        name: 'Vrbo',
        type: 'vrbo',
        isActive: true,
        apiEndpoint: 'https://api.vrbo.com/v1',
        credentials: {
          apiKey: faker.string.alphanumeric(32),
          secret: faker.string.alphanumeric(64),
          webhookUrl: 'https://api.vrbo.com/webhooks'
        },
        settings: {
          syncInterval: 300000, // 5 minutes
          autoAccept: true,
          minPrice: 60,
          maxPrice: 1500
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }
    ];

    this.generatedData.channels = channels;
  }

  public generateProperty(): MockProperty {
    const propertyTypes = ['apartment', 'house', 'condo', 'villa', 'studio', 'loft', 'townhouse'];
    const amenities = [
      'wifi', 'parking', 'pool', 'gym', 'kitchen', 'washer', 'dryer', 'air_conditioning',
      'heating', 'tv', 'cable_tv', 'hot_tub', 'fireplace', 'balcony', 'garden', 'patio'
    ];

    const property: MockProperty = {
      id: uuidv4(),
      name: faker.company.buzzPhrase() + ' ' + faker.helpers.arrayElement(['Apartment', 'House', 'Villa', 'Condo']),
      description: faker.lorem.paragraphs(3),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        coordinates: {
          lat: parseFloat(faker.location.latitude().toString()),
          lng: parseFloat(faker.location.longitude().toString())
        }
      },
      amenities: faker.helpers.arrayElements(amenities, { min: 3, max: 8 }),
      images: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => faker.image.url()),
      maxGuests: faker.number.int({ min: 1, max: 12 }),
      bedrooms: faker.number.int({ min: 1, max: 6 }),
      bathrooms: faker.number.int({ min: 1, max: 4 }),
      propertyType: faker.helpers.arrayElement(propertyTypes),
      status: faker.helpers.arrayElement(['active', 'inactive', 'maintenance']),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    };

    return property;
  }

  public generateBooking(propertyId: string, channel: 'airbnb' | 'booking' | 'expedia' | 'agoda' | 'vrbo'): MockBooking {
    const checkIn = faker.date.future();
    const checkOut = new Date(checkIn.getTime() + faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000);
    const guests = faker.number.int({ min: 1, max: 8 });
    const basePrice = faker.number.int({ min: 50, max: 500 });
    const totalAmount = basePrice * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));

    const booking: MockBooking = {
      id: uuidv4(),
      propertyId,
      guestId: uuidv4(),
      guestName: faker.person.fullName(),
      guestEmail: faker.internet.email(),
      checkIn,
      checkOut,
      guests,
      totalAmount,
      currency: 'USD',
      status: faker.helpers.arrayElement(['confirmed', 'cancelled', 'completed', 'pending']),
      channel,
      channelBookingId: faker.string.alphanumeric(12).toUpperCase(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    };

    return booking;
  }

  public generateRatePlan(propertyId: string): MockRatePlan {
    const ratePlan: MockRatePlan = {
      id: uuidv4(),
      propertyId,
      name: faker.helpers.arrayElement(['Standard Rate', 'Weekend Rate', 'Holiday Rate', 'Long Stay Rate', 'Last Minute Rate']),
      basePrice: faker.number.int({ min: 50, max: 500 }),
      currency: 'USD',
      minStay: faker.number.int({ min: 1, max: 3 }),
      maxStay: faker.number.int({ min: 30, max: 90 }),
      cancellationPolicy: faker.helpers.arrayElement(['flexible', 'moderate', 'strict', 'super_strict']),
      isActive: faker.datatype.boolean(),
      validFrom: faker.date.past(),
      validTo: faker.date.future(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    };

    return ratePlan;
  }

  public generateCalendar(propertyId: string, date: Date): MockCalendar {
    const calendar: MockCalendar = {
      id: uuidv4(),
      propertyId,
      date,
      isAvailable: faker.datatype.boolean({ probability: 0.7 }), // 70% chance of being available
      price: faker.datatype.boolean() ? faker.number.int({ min: 50, max: 500 }) : undefined,
      minStay: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 3 }) : undefined,
      maxStay: faker.datatype.boolean() ? faker.number.int({ min: 30, max: 90 }) : undefined,
      restrictions: faker.datatype.boolean() ? [faker.helpers.arrayElement(['no_pets', 'no_smoking', 'no_parties'])] : undefined,
      updatedAt: faker.date.recent()
    };

    return calendar;
  }

  public generateBulkData(counts: {
    properties?: number;
    bookings?: number;
    ratePlans?: number;
    calendars?: number;
  }): void {
    const { properties = 50, bookings = 200, ratePlans = 100, calendars = 1000 } = counts;

    // Generate properties
    this.generatedData.properties = Array.from({ length: properties }, () => this.generateProperty());

    // Generate rate plans for each property
    this.generatedData.ratePlans = [];
    this.generatedData.properties.forEach(property => {
      const ratePlanCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < ratePlanCount; i++) {
        this.generatedData.ratePlans.push(this.generateRatePlan(property.id));
      }
    });

    // Generate bookings
    this.generatedData.bookings = [];
    const channels: Array<'airbnb' | 'booking' | 'expedia' | 'agoda' | 'vrbo'> = ['airbnb', 'booking', 'expedia', 'agoda', 'vrbo'];
    
    for (let i = 0; i < bookings; i++) {
      const property = faker.helpers.arrayElement(this.generatedData.properties);
      const channel = faker.helpers.arrayElement(channels);
      this.generatedData.bookings.push(this.generateBooking(property.id, channel));
    }

    // Generate calendar entries
    this.generatedData.calendars = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Start 30 days ago
    
    for (let i = 0; i < calendars; i++) {
      const property = faker.helpers.arrayElement(this.generatedData.properties);
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      this.generatedData.calendars.push(this.generateCalendar(property.id, date));
    }
  }

  public getData() {
    return this.generatedData;
  }

  public getProperty(id: string): MockProperty | undefined {
    return this.generatedData.properties.find(p => p.id === id);
  }

  public getBooking(id: string): MockBooking | undefined {
    return this.generatedData.bookings.find(b => b.id === id);
  }

  public getRatePlan(id: string): MockRatePlan | undefined {
    return this.generatedData.ratePlans.find(r => r.id === id);
  }

  public getCalendar(propertyId: string, date: Date): MockCalendar | undefined {
    return this.generatedData.calendars.find(c => 
      c.propertyId === propertyId && 
      c.date.toDateString() === date.toDateString()
    );
  }

  public getChannel(type: string): MockChannel | undefined {
    return this.generatedData.channels.find(c => c.type === type);
  }

  public addProperty(property: MockProperty): void {
    this.generatedData.properties.push(property);
  }

  public addBooking(booking: MockBooking): void {
    this.generatedData.bookings.push(booking);
  }

  public addRatePlan(ratePlan: MockRatePlan): void {
    this.generatedData.ratePlans.push(ratePlan);
  }

  public addCalendar(calendar: MockCalendar): void {
    this.generatedData.calendars.push(calendar);
  }

  public updateProperty(id: string, updates: Partial<MockProperty>): boolean {
    const index = this.generatedData.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.generatedData.properties[index] = { ...this.generatedData.properties[index], ...updates, updatedAt: new Date() };
      return true;
    }
    return false;
  }

  public updateBooking(id: string, updates: Partial<MockBooking>): boolean {
    const index = this.generatedData.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.generatedData.bookings[index] = { ...this.generatedData.bookings[index], ...updates, updatedAt: new Date() };
      return true;
    }
    return false;
  }

  public deleteProperty(id: string): boolean {
    const index = this.generatedData.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.generatedData.properties.splice(index, 1);
      // Also remove related data
      this.generatedData.ratePlans = this.generatedData.ratePlans.filter(r => r.propertyId !== id);
      this.generatedData.calendars = this.generatedData.calendars.filter(c => c.propertyId !== id);
      this.generatedData.bookings = this.generatedData.bookings.filter(b => b.propertyId !== id);
      return true;
    }
    return false;
  }

  public deleteBooking(id: string): boolean {
    const index = this.generatedData.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.generatedData.bookings.splice(index, 1);
      return true;
    }
    return false;
  }

  public clearAllData(): void {
    this.generatedData = {
      properties: [],
      bookings: [],
      ratePlans: [],
      calendars: [],
      channels: []
    };
    this.initializeChannels();
  }
}

const dataGenerator = DataGenerator.getInstance();
export { dataGenerator };
export default dataGenerator;
