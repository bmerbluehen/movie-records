import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundtrackEditor } from "../src/components/SoundtrackEditor";
import type { Song } from "../src/interfaces/song";

describe("SoundtrackEditor", () => {
    test("edits song name and artist via the editors", () => {
        function Wrapper() {
            const [songs, setSongs] = useState<Song[]>([
                { id: "s1", name: "Song A", by: "Artist A" },
                { id: "s2", name: "Song B", by: "Artist B" },
            ]);
            return <SoundtrackEditor songs={songs} setSongs={setSongs} />;
        }

        render(<Wrapper />);

        // Two songs -> 4 inputs (name, by) in order
        let inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(4);
        expect((inputs[0] as HTMLInputElement).value).toBe("Song A");
        expect((inputs[1] as HTMLInputElement).value).toBe("Artist A");

        // Edit first song name
        userEvent.clear(inputs[0]);
        userEvent.type(inputs[0], "Edited Song A");
        expect((inputs[0] as HTMLInputElement).value).toBe("Edited Song A");

        // Edit second song 'by' field (inputs[3])
        userEvent.clear(inputs[3]);
        userEvent.type(inputs[3], "Edited Artist B");
        // Re-query inputs to ensure state updates reflected
        inputs = screen.getAllByRole("textbox");
        expect((inputs[3] as HTMLInputElement).value).toBe("Edited Artist B");
    });
});
