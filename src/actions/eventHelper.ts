import { db } from '@/db'

// Log the event ID as processed
export async function logProcessedEvent(eventId: string) {
    await db.processedEvent.create({
        data: {
            eventId,
            createdAt: new Date(),
        },
    })
}

// Check if the event ID has been processed
export async function isEventProcessed(eventId: string): Promise<boolean> {
    const event = await db.processedEvent.findUnique({
        where: { eventId },
    })
    return event !== null
}
