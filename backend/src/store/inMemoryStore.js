import { DeliveryStatus, GroupRole, SwapStatus } from '../domain/models.js'
import { createId } from '../services/tokenService.js'

const now = () => new Date().toISOString()

export function createStore() {
  const users = new Map()
  const groups = new Map()
  const memberships = []
  const rideSlots = new Map()
  const assignments = new Map()
  const groupScheduleVersion = new Map()
  const swapRequests = new Map()
  const chatThreads = new Map()
  const messages = new Map()
  const notifications = new Map()
  const auditLogs = []

  const accessSessions = new Map()
  const refreshSessions = new Map()
  const idempotencyRecords = new Map()

  const demoUser = {
    id: 'usr_demo_owner',
    email: 'anshuman.demo@gmail.com',
    name: 'Anshuman Demo',
    givenName: 'Anshuman',
    familyName: 'Demo',
    picture: 'https://lh3.googleusercontent.com/a/default-user',
    createdAt: now(),
    isAdmin: true,
  }
  users.set(demoUser.id, demoUser)

  const defaultGroup = {
    id: 'grp_lincoln_morning',
    name: 'Lincoln Morning',
    routeFrom: 'Maple Street',
    routeTo: 'Lincoln Elementary',
    createdBy: demoUser.id,
    createdAt: now(),
  }
  groups.set(defaultGroup.id, defaultGroup)

  memberships.push(
    { id: createId('mbr'), groupId: defaultGroup.id, userId: demoUser.id, role: GroupRole.OWNER, createdAt: now() },
    { id: createId('mbr'), groupId: defaultGroup.id, userId: demoUser.id, role: GroupRole.DRIVER, createdAt: now() },
  )

  const seededRideSlot = {
    id: 'ride_mon_730',
    groupId: defaultGroup.id,
    date: '2026-09-28',
    startTime: '07:30',
    endTime: '08:00',
    routeFrom: 'Maple Street',
    routeTo: 'Lincoln Elementary',
    capacity: 4,
    status: 'scheduled',
    createdAt: now(),
  }
  rideSlots.set(seededRideSlot.id, seededRideSlot)

  const seededAssignment = {
    id: 'asn_mon_730',
    groupId: defaultGroup.id,
    rideSlotId: seededRideSlot.id,
    driverId: demoUser.id,
    riderIds: ['child_1', 'child_2'],
    fairnessScore: 1,
    conflictReasons: [],
    manualOverride: false,
    version: 1,
    updatedAt: now(),
  }
  assignments.set(seededAssignment.id, seededAssignment)
  groupScheduleVersion.set(defaultGroup.id, 1)

  const seededThread = {
    id: 'thr_lincoln_ops',
    groupId: defaultGroup.id,
    title: 'Morning ops',
    createdBy: demoUser.id,
    createdAt: now(),
  }
  chatThreads.set(seededThread.id, seededThread)

  const seededMessage = {
    id: createId('msg'),
    threadId: seededThread.id,
    senderId: demoUser.id,
    body: 'Morning carpool confirmed for Monday 7:30 AM.',
    createdAt: now(),
  }
  messages.set(seededMessage.id, seededMessage)

  const seededNotification = {
    id: createId('ntf'),
    userId: demoUser.id,
    type: 'schedule',
    title: 'Drive assigned',
    body: 'You are assigned to Monday 7:30 AM pickup.',
    deliveryStatus: DeliveryStatus.SENT,
    readAt: null,
    createdAt: now(),
  }
  notifications.set(seededNotification.id, seededNotification)

  const addAudit = (entry) => {
    auditLogs.push({
      id: createId('aud'),
      at: now(),
      ...entry,
    })
  }

  return {
    users,
    groups,
    memberships,
    rideSlots,
    assignments,
    groupScheduleVersion,
    swapRequests,
    chatThreads,
    messages,
    notifications,
    auditLogs,
    accessSessions,
    refreshSessions,
    idempotencyRecords,
    addAudit,
    createSwap(data) {
      const swap = {
        id: createId('swp'),
        status: SwapStatus.REQUESTED,
        version: 1,
        createdAt: now(),
        updatedAt: now(),
        ...data,
      }
      swapRequests.set(swap.id, swap)
      return swap
    },
    createGroup(data) {
      const group = { id: createId('grp'), createdAt: now(), ...data }
      groups.set(group.id, group)
      return group
    },
    createThread(data) {
      const thread = { id: createId('thr'), createdAt: now(), ...data }
      chatThreads.set(thread.id, thread)
      return thread
    },
    createMessage(data) {
      const message = { id: createId('msg'), createdAt: now(), ...data }
      messages.set(message.id, message)
      return message
    },
    createNotification(data) {
      const notification = { id: createId('ntf'), createdAt: now(), readAt: null, ...data }
      notifications.set(notification.id, notification)
      return notification
    },
  }
}
