import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { limitTo } from "@app/utils";
import { Guild, Playlist, TrackData, User } from "@app/types";

export const useSettings = create(
    persist(
        () => ({
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
                // #v-ifdef VITE_BUILD_ENV=desktop
                offline: false,
                close: "Exit"
                // #v-endif
            },
            token: ""
        }),
        {
            name: "user-settings",
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export const useUser = create<User>((set, get) => ({
    username: undefined, userId: undefined, avatar: undefined, connections: undefined,
    playlists: [], likedSongs: [], recentlyPlayed: [],

    // Playlist modifiers.
    addPlaylist: (playlistId: string) => {
        const playlists = get().playlists;
        if (!playlists.includes(playlistId)) {
            playlists.push(playlistId);
            set({ playlists });
        }
    },
    removePlaylist: (playlistId: string) => {
        const playlists = get().playlists;
        const index = playlists.indexOf(playlistId);
        if (index > -1) {
            playlists.splice(index, 1);
            set({ playlists });
        }
    },

    // Liked songs modifiers.
    addLikedSong: (song: TrackData) => {
        const likedSongs = get().likedSongs;
        if (!likedSongs.includes(song)) {
            likedSongs.unshift(song);
            set({ likedSongs });
        }
    },
    removeLikedSong: (song: TrackData) => {
        const likedSongs = get().likedSongs;
        const index = likedSongs.indexOf(song);
        if (index > -1) {
            likedSongs.splice(index, 1);
            set({ likedSongs });
        }
    },

    // Recently played modifiers.
    addRecentlyPlayed: (song: TrackData) => {
        const recentlyPlayed = get().recentlyPlayed;
        if (!recentlyPlayed.includes(song)) {
            recentlyPlayed.unshift(song);
            set({ recentlyPlayed: limitTo(recentlyPlayed, 15) });
        }
    },

    // These are calls for the HTTP API, not for normal updates.
    applyFrom: (data: User | Partial<User>) => set(data),
    updatePlaylists: (playlists: string[]) => set({ playlists }),
    updateLikedSongs: (likedSongs: TrackData[]) => set({ likedSongs }),
    updateRecentlyPlayed: (recentlyPlayed: TrackData[]) => set({ recentlyPlayed }),
}));

export const usePlaylists = create<Playlist[]>(() => ([]));
export const useGuilds = create<Guild[]>(() => ([]));

// #v-ifdef VITE_BUILD_ENV=desktop
export const useDownloads = create<TrackData[]>(() => ([]));
// #v-endif
