import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { remindersEnabled, listShifts, setRemindersEnabled } from '../data/repository';
import { dateKey, shiftStartDate, SHIFT_LABELS, type Shift } from '../domain/roster';

const SOURCE = 'foundry-shift-calendar';
const CHANNEL = 'shift-reminders';
const MAX_PENDING = 32;
const LEAD_MINUTES = 60;
const HORIZON_DAYS = 30;

async function cancelOurReminders(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.source === SOURCE) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

async function hasPermission(): Promise<boolean> {
  const granted = await Notifications.getPermissionsAsync();
  return granted.granted || granted.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

/** Local only: no push tokens, server, telemetry, or background location. */
export async function syncReminders(shifts: readonly Shift[], now = new Date()): Promise<number> {
  if (!(await remindersEnabled())) return 0;
  if (!(await hasPermission())) return 0;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Shift starts',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  await cancelOurReminders();
  const upcoming = [...shifts].filter((s) => s.kind !== 'off').sort((a, b) => a.date.localeCompare(b.date));
  let count = 0;
  const horizon = now.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000;
  for (const shift of upcoming) {
    if (count >= MAX_PENDING) break;
    const start = shiftStartDate(shift);
    if (!start || start.getTime() > horizon) continue;
    const fireAt = new Date(start.getTime() - LEAD_MINUTES * 60000);
    if (fireAt.getTime() <= now.getTime()) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Shift in one hour',
        body: SHIFT_LABELS[shift.kind] + ' shift at ' + shift.start + ' · ' + dateKey(start),
        data: { source: SOURCE, date: shift.date },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
        ...(Platform.OS === 'android' ? { channelId: CHANNEL } : {}),
      },
    });
    count++;
  }
  return count;
}

export async function enableReminders(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Shift starts',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const permission = await Notifications.getPermissionsAsync();
  const allowed = permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ? true
    : (await Notifications.requestPermissionsAsync()).granted;
  if (!allowed) return false;
  await setRemindersEnabled(true);
  await syncReminders(await listShifts());
  return true;
}

export async function disableReminders(): Promise<void> {
  await setRemindersEnabled(false);
  await cancelOurReminders();
}
