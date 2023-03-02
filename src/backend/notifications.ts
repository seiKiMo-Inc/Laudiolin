import type { InAppNotificationData } from "@backend/types";
import * as settings from "@backend/settings";

/**
 * Sends a notification.
 * @param notification The notification.
 */
export async function notify(notification: InAppNotificationData) {
    // Check if the user has notifications enabled.
    if (
        !settings.get("notifications") ||
        !(Notification.permission == "granted")
    ) {
        // Request permission to send notifications.
        const result = await Notification.requestPermission();
        if (result !== "granted") return;

        // Save the user's preference.
        settings.save("notifications", "yes");
    }

    // Send the notification.
    const notif = new Notification("Laudiolin", {
        body: notification.message
    });

    notif.onclick = () => {
        window.parent.focus();
        notif.close();
    };
}
