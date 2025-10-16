import { Request, Response } from 'express';
import { dataGenerator } from '../services/dataGenerator';
import { websocketService } from '../services/websocketService';
import { logger } from '../config/logger';
import { createError } from '../utils/errors';
import { MockProperty, MockBooking, MockRatePlan, MockCalendar, ApiResponse } from '../types';

class AirbnbController {
  // Properties
  public getProperties = async (req: Request, res: Response) => {
    const { page = 1, limit = 20, search, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    let properties = dataGenerator.getData().properties.filter(p => p.status !== 'deleted');
    
    // Apply filters
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      properties = properties.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.address.city.toLowerCase().includes(searchTerm)
      );
    }
    
    if (status) {
      properties = properties.filter(p => p.status === status);
    }
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProperties = properties.slice(startIndex, endIndex);
    
    const response: ApiResponse<MockProperty[]> = {
      success: true,
      data: paginatedProperties,
      meta: {
        total: properties.length,
        page: pageNum,
        limit: limitNum,
        hasMore: endIndex < properties.length
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved ${paginatedProperties.length} Airbnb properties`);
    res.json(response);
  };

  public getProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const property = dataGenerator.getProperty(id);
    
    if (!property) {
      throw createError.notFound('Property not found');
    }
    
    const response: ApiResponse<MockProperty> = {
      success: true,
      data: property,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved Airbnb property: ${id}`);
    res.json(response);
  };

  public createProperty = async (req: Request, res: Response) => {
    const propertyData = req.body;
    
    // Validate required fields
    if (!propertyData.name || !propertyData.address) {
      throw createError.validation('Name and address are required');
    }
    
    const property: MockProperty = {
      id: `airbnb_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: propertyData.name,
      description: propertyData.description || '',
      address: propertyData.address,
      amenities: propertyData.amenities || [],
      images: propertyData.images || [],
      maxGuests: propertyData.maxGuests || 1,
      bedrooms: propertyData.bedrooms || 1,
      bathrooms: propertyData.bathrooms || 1,
      propertyType: propertyData.propertyType || 'apartment',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    dataGenerator.addProperty(property);
    
    // Broadcast update via WebSocket
    websocketService.broadcastPropertyUpdate('airbnb', property);
    
    const response: ApiResponse<MockProperty> = {
      success: true,
      data: property,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Created Airbnb property: ${property.id}`);
    res.status(201).json(response);
  };

  public updateProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    
    const success = dataGenerator.updateProperty(id, updates);
    if (!success) {
      throw createError.notFound('Property not found');
    }
    
    const property = dataGenerator.getProperty(id);
    
    // Broadcast update via WebSocket
    websocketService.broadcastPropertyUpdate('airbnb', property);
    
    const response: ApiResponse<MockProperty> = {
      success: true,
      data: property,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Updated Airbnb property: ${id}`);
    res.json(response);
  };

  public deleteProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const success = dataGenerator.deleteProperty(id);
    if (!success) {
      throw createError.notFound('Property not found');
    }
    
    // Broadcast update via WebSocket
    websocketService.broadcastPropertyUpdate('airbnb', { id, deleted: true });
    
    const response: ApiResponse = {
      success: true,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Deleted Airbnb property: ${id}`);
    res.json(response);
  };

  // Bookings
  public getBookings = async (req: Request, res: Response) => {
    const { page = 1, limit = 20, propertyId, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    let bookings = dataGenerator.getData().bookings.filter(b => b.channel === 'airbnb');
    
    // Apply filters
    if (propertyId) {
      bookings = bookings.filter(b => b.propertyId === propertyId);
    }
    
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedBookings = bookings.slice(startIndex, endIndex);
    
    const response: ApiResponse<MockBooking[]> = {
      success: true,
      data: paginatedBookings,
      meta: {
        total: bookings.length,
        page: pageNum,
        limit: limitNum,
        hasMore: endIndex < bookings.length
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved ${paginatedBookings.length} Airbnb bookings`);
    res.json(response);
  };

  public getBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = dataGenerator.getBooking(id);
    
    if (!booking || booking.channel !== 'airbnb') {
      throw createError.notFound('Booking not found');
    }
    
    const response: ApiResponse<MockBooking> = {
      success: true,
      data: booking,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved Airbnb booking: ${id}`);
    res.json(response);
  };

  public createBooking = async (req: Request, res: Response) => {
    const bookingData = req.body;
    
    // Validate required fields
    if (!bookingData.propertyId || !bookingData.guestName || !bookingData.checkIn || !bookingData.checkOut) {
      throw createError.validation('Property ID, guest name, check-in, and check-out dates are required');
    }
    
    const booking: MockBooking = {
      id: `airbnb_booking_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      propertyId: bookingData.propertyId,
      guestId: bookingData.guestId || `guest_${Date.now()}`,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail || '',
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      guests: bookingData.guests || 1,
      totalAmount: bookingData.totalAmount || 0,
      currency: bookingData.currency || 'USD',
      status: 'confirmed',
      channel: 'airbnb',
      channelBookingId: `AIRBNB${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    dataGenerator.addBooking(booking);
    
    // Broadcast update via WebSocket
    websocketService.broadcastBookingUpdate('airbnb', booking);
    
    const response: ApiResponse<MockBooking> = {
      success: true,
      data: booking,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Created Airbnb booking: ${booking.id}`);
    res.status(201).json(response);
  };

  public updateBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    
    const booking = dataGenerator.getBooking(id);
    if (!booking || booking.channel !== 'airbnb') {
      throw createError.notFound('Booking not found');
    }
    
    const success = dataGenerator.updateBooking(id, updates);
    if (!success) {
      throw createError.notFound('Booking not found');
    }
    
    const updatedBooking = dataGenerator.getBooking(id);
    
    // Broadcast update via WebSocket
    websocketService.broadcastBookingUpdate('airbnb', updatedBooking);
    
    const response: ApiResponse<MockBooking> = {
      success: true,
      data: updatedBooking,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Updated Airbnb booking: ${id}`);
    res.json(response);
  };

  public cancelBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const booking = dataGenerator.getBooking(id);
    if (!booking || booking.channel !== 'airbnb') {
      throw createError.notFound('Booking not found');
    }
    
    const success = dataGenerator.updateBooking(id, { status: 'cancelled' });
    if (!success) {
      throw createError.notFound('Booking not found');
    }
    
    const cancelledBooking = dataGenerator.getBooking(id);
    
    // Broadcast update via WebSocket
    websocketService.broadcastBookingUpdate('airbnb', cancelledBooking);
    
    const response: ApiResponse = {
      success: true,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Cancelled Airbnb booking: ${id}`);
    res.json(response);
  };

  // Rate Plans
  public getRatePlans = async (req: Request, res: Response) => {
    const { propertyId } = req.query;
    
    if (!propertyId) {
      throw createError.validation('Property ID is required');
    }
    
    const ratePlans = dataGenerator.getData().ratePlans.filter(r => r.propertyId === propertyId);
    
    const response: ApiResponse<MockRatePlan[]> = {
      success: true,
      data: ratePlans,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved ${ratePlans.length} Airbnb rate plans for property: ${propertyId}`);
    res.json(response);
  };

  public createRatePlan = async (req: Request, res: Response) => {
    const ratePlanData = req.body;
    
    // Validate required fields
    if (!ratePlanData.propertyId || !ratePlanData.name || !ratePlanData.basePrice) {
      throw createError.validation('Property ID, name, and base price are required');
    }
    
    const ratePlan: MockRatePlan = {
      id: `airbnb_rate_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      propertyId: ratePlanData.propertyId,
      name: ratePlanData.name,
      basePrice: ratePlanData.basePrice,
      currency: ratePlanData.currency || 'USD',
      minStay: ratePlanData.minStay || 1,
      maxStay: ratePlanData.maxStay || 30,
      cancellationPolicy: ratePlanData.cancellationPolicy || 'moderate',
      isActive: true,
      validFrom: new Date(ratePlanData.validFrom || Date.now()),
      validTo: new Date(ratePlanData.validTo || Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    dataGenerator.addRatePlan(ratePlan);
    
    // Broadcast update via WebSocket
    websocketService.broadcastRateUpdate('airbnb', ratePlan);
    
    const response: ApiResponse<MockRatePlan> = {
      success: true,
      data: ratePlan,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Created Airbnb rate plan: ${ratePlan.id}`);
    res.status(201).json(response);
  };

  // Calendar
  public getCalendar = async (req: Request, res: Response) => {
    const { propertyId, startDate, endDate } = req.query;
    
    if (!propertyId) {
      throw createError.validation('Property ID is required');
    }
    
    let calendars = dataGenerator.getData().calendars.filter(c => c.propertyId === propertyId);
    
    // Apply date filters
    if (startDate) {
      const start = new Date(startDate as string);
      calendars = calendars.filter(c => c.date >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate as string);
      calendars = calendars.filter(c => c.date <= end);
    }
    
    const response: ApiResponse<MockCalendar[]> = {
      success: true,
      data: calendars,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved ${calendars.length} Airbnb calendar entries for property: ${propertyId}`);
    res.json(response);
  };

  public updateCalendar = async (req: Request, res: Response) => {
    const { propertyId, updates } = req.body;
    
    if (!propertyId || !updates || !Array.isArray(updates)) {
      throw createError.validation('Property ID and updates array are required');
    }
    
    // Update calendar entries
    updates.forEach((update: any) => {
      const existingCalendar = dataGenerator.getCalendar(propertyId, new Date(update.date));
      if (existingCalendar) {
        dataGenerator.updateProperty(existingCalendar.id, update);
      } else {
        const newCalendar: MockCalendar = {
          id: `airbnb_cal_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          propertyId,
          date: new Date(update.date),
          isAvailable: update.isAvailable !== undefined ? update.isAvailable : true,
          price: update.price,
          minStay: update.minStay,
          maxStay: update.maxStay,
          restrictions: update.restrictions,
          updatedAt: new Date()
        };
        dataGenerator.addCalendar(newCalendar);
      }
    });
    
    // Broadcast update via WebSocket
    websocketService.broadcastCalendarUpdate('airbnb', { propertyId, updates });
    
    const response: ApiResponse = {
      success: true,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Updated Airbnb calendar for property: ${propertyId}`);
    res.json(response);
  };
}

export const airbnbController = new AirbnbController();


