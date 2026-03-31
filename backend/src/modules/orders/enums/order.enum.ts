export enum OrderStatus {
  PLACED = 'PLACED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

/*
SequenceStatusWhat it means
1  PLACED Payment is successful. The order is now "official" and waiting for your team to see it.
2  PENDING The order is created in the database, but the system is waiting for payment confirmation (especially for credit cards or bank transfers).
3  PROCESSING This is where the work begins. Your staff is picking the items from the warehouse, testing the CCTV cameras, or scheduling the installation technician.
4  SHIPPED / DISPATCHED The package has left your office and is with the courier.
5  DELIVERED / COMPLETED The customer has received the item, or the installation is finished.
*/
