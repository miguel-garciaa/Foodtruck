const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function notificationTarget(data: Record<string, unknown> | undefined, userId: string) {
  if (!data) return null;
  if (data.userId !== userId || typeof data.eventId !== 'string' || !uuid.test(data.eventId))
    return null;
  if (data.truckId == null || data.truckId === '') return { eventId: data.eventId, truckId: null };
  if (typeof data.truckId !== 'string' || !uuid.test(data.truckId)) return null;
  return { eventId: data.eventId, truckId: data.truckId };
}
