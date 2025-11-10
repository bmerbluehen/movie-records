import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableSongList } from "../src/components/EditableSongList";

describe("EditableSongList", () => {
    test("add, edit, and delete songs via the UI", () => {
        function Wrapper() {
            const [songs, setSongs] = useState<string[]>(["one", "two"]);
            return <EditableSongList songs={songs} setSongs={setSongs} />;
        }

        render(<Wrapper />);

        // initial inputs
        let inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(2);
        expect((inputs[0] as HTMLInputElement).value).toBe("one");

        // add a new empty song
        userEvent.click(screen.getByRole("button", { name: /Add Song/i }));
        inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(3);
        expect((inputs[2] as HTMLInputElement).value).toBe("");

        // edit the newly added song
        userEvent.type(inputs[2], "three");
        expect((inputs[2] as HTMLInputElement).value).toBe("three");

        // delete the second original song (index 1)
        const deleteButtons = screen.getAllByText("❌");
        expect(deleteButtons.length).toBe(3);
        userEvent.click(deleteButtons[1]);

        // after deletion, two inputs remain: "one" and "three"
        inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(2);
        expect((inputs[0] as HTMLInputElement).value).toBe("one");
        expect((inputs[1] as HTMLInputElement).value).toBe("three");
    });
});
