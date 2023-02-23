import * as notifs from "@tauri-apps/api/notification";

import type { InAppNotificationData } from "@backend/types";
import * as settings from "@backend/settings";

/**
 * Sends a notification.
 * @param notification The notification.
 */
export async function notify(notification: InAppNotificationData) {
    // Check if the user has notifications enabled.
    if (!settings.get("notifications") ||
        !await notifs.isPermissionGranted()) {
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
