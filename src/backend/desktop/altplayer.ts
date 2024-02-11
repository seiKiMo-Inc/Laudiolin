import { useWindow, WindowType } from "@backend/stores";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

/**
 * Changes the window state.
 *
 * @param newState The new window state.
 */
export async function changeState(newState: WindowType): Promise<void> {
    useWindow.setState({ type: newState });

    switch (newState) {
        case "full":
            await appWindow.setSkipTaskbar(false);
            await appWindow.setResizable(true);
            await appWindow.setSize(new LogicalSize(1200, 600));
            await appWindow.center();
            return;
        case "mini":
            await appWindow.setSkipTaskbar(true);
            await appWindow.setResizable(false);
            await appWindow.setSize(new LogicalSize(427, 240));
            await appWindow.center();
            return;
        case "embed":
            await appWindow.setSkipTaskbar(true);
            await appWindow.setResizable(false);
            await appWindow.setSize(new LogicalSize(500, 100));
            return;
    }
}

/**
 * Exits alternate application states when the window is loaded.
 */
export async function checkState(): Promise<void> {
    const windowSize = await appWindow.innerSize();
    if (windowSize.width == 427 || windowSize.width == 500) {
        await changeState("full");
    } else if (windowSize.height == 240 || windowSize.height == 100) {
        await changeState("full");
    }
}
