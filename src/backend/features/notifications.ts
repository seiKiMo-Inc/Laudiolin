// #v-ifdef VITE_BUILD_ENV='desktop'
import * as notifs from "@tauri-apps/api/notification";
// #v-endif

import type { InAppNotificationData } from "@app/types";

import * as settings from "@backend/settings";

/**
 * Sends a notification.
 *
 * @param notification The notification.
 */
export async function notify(notification: InAppNotificationData) {
    // #v-ifdef VITE_BUILD_ENV='desktop'
    await sendDesktopNotification(notification);
    // #v-else
    throw new Error("This should not be called in a browser environment.");
    // #v-endif
}

/**
 * Sends a desktop notification.
 *
 * @param notification The notification.
 */
async function sendDesktopNotification(notification: InAppNotificationData) {
    // Check if the user has notifications enabled.
    if (
        !settings.get("notifications") ||
        !(await notifs.isPermissionGranted())
    ) {
        // Request permission to send notifications.
        const result = await notifs.requestPermission();
        if (result !== "granted") return;

        // Save the user's preference.
        settings.save("notifications", "yes");
    }

    // Send the notification.
    notifs.sendNotification({
        title: "Laudiolin",
        body: notification.message
    });
}
