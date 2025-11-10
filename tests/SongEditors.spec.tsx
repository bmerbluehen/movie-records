import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Song } from "../src/interfaces/song";
import {
    SongNameEditor,
    SongByEditor,
} from "../src/components/SoundtrackEditor";

describe("Song editors (direct)", () => {
    test("SongNameEditor calls setSong with updated name", () => {
        const song: Song = { id: "s1", name: "Old", by: "Artist" };
        const setSong: jest.MockedFunction<
            (id: string, newSong: Song) => void
        > = jest.fn();
        render(<SongNameEditor song={song} setSong={setSong} />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "New Name" } });

        // setSong should have been called at least once and last call contains new name
        expect(setSong).toHaveBeenCalled();
        const found = setSong.mock.calls.some(
            (c) => c[0] === "s1" && c[1].name === "New Name",
        );
        expect(found).toBe(true);
    });

    test("SongByEditor calls setSong with updated by field", () => {
        const song: Song = { id: "s2", name: "Song", by: "OldBy" };
        const setSong: jest.MockedFunction<
            (id: string, newSong: Song) => void
        > = jest.fn();
        render(<SongByEditor song={song} setSong={setSong} />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "NewBy" } });

        expect(setSong).toHaveBeenCalled();
        const foundBy = setSong.mock.calls.some(
            (c) => c[0] === "s2" && c[1].by === "NewBy",
        );
        expect(foundBy).toBe(true);
    });
});
