import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

describe("App Component", () => {
    test("renders the course name somewhere", () => {
        render(<App />);
        const linkElement = screen.getByText(/Movie Records/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("can add a new movie via modal and it appears (iframe src)", async () => {
        render(<App />);

        // Open add modal
        const addBtn = screen.getByRole("button", { name: /Add New Movie/i });
        userEvent.click(addBtn);

        // Fill YouTube ID and save (the input below only appears in the modal)
        const idInput = screen.getByLabelText(/YouTube ID:/i);
        userEvent.type(idInput, "TESTID123");
        const saveBtn = screen.getByRole("button", { name: /Save Changes/i });
        userEvent.click(saveBtn);

        // The modal closes and a new iframe with the id should be present
        const iframes = await screen.findAllByTitle("YouTube video player");
        // At least one iframe's src should include our TESTID123
        const found = iframes.some((el) =>
            el.getAttribute("src")?.includes("TESTID123"),
        );
        expect(found).toBe(true);
    });

    test("record controls: mark watched, toggle liked, then edit and save new title", async () => {
        render(<App />);

        // Find a "Mark as watched" button (there are many movies; pick the first)
        const markWatchedBtn = screen.getAllByRole("button", {
            name: /Mark as watched/i,
        })[0];
        userEvent.click(markWatchedBtn);

        // After marking as watched, should show "Mark as unwatched"
        expect(
            await screen.findAllByRole("button", {
                name: /Mark as unwatched/i,
            }),
        ).not.toHaveLength(0);

        // Not liked button should appear initially; click it to toggle liked
        const notLikedBtn = screen.getAllByRole("button", {
            name: /Not liked/i,
        })[0];
        userEvent.click(notLikedBtn);

        // Now the control should show "Liked"
        expect(
            await screen.findAllByRole("button", { name: /Liked/i }),
        ).not.toHaveLength(0);

        // Click Edit to open MovieEditor
        const editBtn = screen.getAllByRole("button", { name: /Edit/i })[0];
        userEvent.click(editBtn);

        // Change the title
        const titleInput = await screen.findByLabelText(/Title:/i);
        userEvent.clear(titleInput);
        userEvent.type(titleInput, "My Edited Title");

        // Save changes
        const saveEditorBtn = screen.getByRole("button", { name: /Save/i });
        userEvent.click(saveEditorBtn);

        // The new title should be visible
        expect(await screen.findByText(/My Edited Title/i)).toBeInTheDocument();
    });

    test("edit -> delete removes a movie from the list", async () => {
        render(<App />);

        // Open the first movie's editor
        const editBtn = screen.getAllByRole("button", { name: /Edit/i })[0];
        userEvent.click(editBtn);

        // Delete the movie
        const deleteBtn = await screen.findByRole("button", {
            name: /Delete/i,
        });
        userEvent.click(deleteBtn);

        // The editor will close (and the movie removed) - ensure the Delete button is no longer in the document
        expect(screen.queryByRole("button", { name: /Delete/i })).toBeNull();
    });
});
