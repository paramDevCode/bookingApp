export interface Booking {
  _id: string;               // add this field for order ID
  service: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  pickupDate: string;        // could be Date or string (depending on your usage)
  pickupTime: string;
  mobile?:string,
  notes?: string;
  imageUrls?: string[];
  status?: string;
  createdAt: string;         // add createdAt to match response
  __v?: number;              // optional version field (from MongoDB)
}
