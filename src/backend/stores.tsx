import { create, StoreApi, UseBoundStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Playlist, SearchEngine, SearchResults, TrackData, User, UserSettings } from "@app/types";

/**
 * Append an item to a store.
 *
 * @param store The store to append to.
 * @param item The item to append.
 */
export function append<T>(store: StoreApi<T[]>, item: T) {
    store.setState((state) => [...state, item]);
}

/**
 * Prepend an item to a store.
 *
 * @param store The store to prepend to.
 * @param item The item to prepend.
 */
export function prepend<T>(store: StoreApi<T[]>, item: T) {
    store.setState((state) => [item, ...state]);
}

/**
 * Gets the items in a store as an array.
 *
 * @param store The store to get the items from.
 */
export function asArray<T>(store: StoreApi<T[]>): T[] {
    return Object.values(store.getState());
}

/**
 * Remove an item from a store.
 *
 * @param store The store to remove from.
 * @param item The item to remove.
 */
export function remove<T>(store: StoreApi<T[]>, item: T) {
    store.setState((state) => {
        const index = state.indexOf(item);
        if (index > -1) {
            state.splice(index, 1);
        }
        return [...state];
    });
}

export type Settings = UserSettings & {
    setSearchEngine: (engine: SearchEngine) => void;
    setFromPath: (path: string, value: any) => void;
    getFromPath: (path: string, fallback: string | null) => any;
};
export const useSettings = create<Settings>()(
    persist(
        (set, get): Settings => ({
            search: {
                accuracy: true,
                engine: "All"
            },
            audio: {
                playback_mode: "Stream",
                audio_quality: "High",
                stream_sync: true
            },
            ui: {
                color_theme: "Dark"
            },
            system: {
                broadcast_listening: "Everyone",
                presence: "Generic",
                // #v-ifdef VITE_BUILD_ENV='desktop'
                offline: false,
                close: "Exit"
                // #v-endif
            },
            token: "",
            setSearchEngine: (engine: SearchEngine) => set({ search: { ...(get().search), engine } }),
            setFromPath: (path: string, value: any = "") => {
                // Get the correct object.
                const parts = path.split(".");
                const key = parts.pop() as string;
                const obj = parts.reduce((a: any, b) => a[b], get());

                // Set the value.
                if (obj) {
                    obj[key] = value;
                    set(obj);
                }
            },
            getFromPath: (path: string, fallback: string | null = null) => {
                // Get the correct object.
                const parts = path.split(".");
                const key = parts.pop() as string;
                const obj = parts.reduce((a: any, b) => a[b], get());

                // Get the value.
                if (obj) return obj[key] ?? fallback;
                else return fallback;
            }
        }),
        {
            version: 1,
            name: "user-settings",
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export interface GlobalState {
    listening: User | null; // The listening along with user.
    playlist: Playlist | null; // The playlist currently selected.
    searchResults?: SearchResults; // The search results.
    searchQuery?: string; // The search query.
    volume: number;

    setListening: (listening: User | null) => void;
    setPlaylist: (playlist: Playlist | null) => void;
    setSearchResults: (searchResults: SearchResults, query?: string) => void;
}
export const useGlobal = create<GlobalState>()(
    persist(
        (set): GlobalState => ({
            listening: null,
            playlist: null,
            searchResults: undefined,
            searchQuery: undefined,
            volume: 1,

            setListening: (listening: User | null) => set({ listening }),
            setPlaylist: (playlist: Playlist | null) => set({ playlist }),
            setSearchResults: (searchResults: SearchResults, searchQuery?: string) => set({ searchResults, searchQuery })
        }),
        {
            name: "global-state",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => Object.fromEntries(Object.entries(state)
                .filter(([key]) => ["volume"].includes(key)))
        }
    )
);

export const useUser = create<User>(() => undefined);

export const usePlaylists = create<Playlist[]>(() => ([]));
export const useFavorites = create<TrackData[]>(() => ([]));
export const useRecents = create<TrackData[]>(() => ([]));

// #v-ifdef VITE_BUILD_ENV='desktop'
export const useDownloads: UseBoundStore<StoreApi<TrackData[]>> = create<TrackData[]>(() => ([]));
// #v-endif

const WithStore = (Component: any, primary: any, secondary?: any, tertiary?: any) => (props: any) => {
    const primaryStore = primary();
    const secondaryStore = secondary ? secondary() : null;
    const tertiaryStore = tertiary ? tertiary() : null;

    return <Component {...props} pStore={primaryStore} sStore={secondaryStore} tStore={tertiaryStore} />;
};

export default WithStore;