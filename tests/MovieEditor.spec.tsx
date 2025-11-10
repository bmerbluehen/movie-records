import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            ></MovieEditor>,
        );
    });

    test("renders MovieEditor with initial movie data", () => {
        const title = screen.getByDisplayValue("The Test Movie");

        expect(title).toBeInTheDocument();
    });

    test("save calls editMovie and changeEditing with updated values", () => {
        // Title input
        const titleInput = screen.getByDisplayValue("The Test Movie");
        userEvent.clear(titleInput);
        userEvent.type(titleInput, "Updated Title");

        // Release year (number input)
        const releaseInput = screen.getByRole("spinbutton");
        userEvent.clear(releaseInput);
        userEvent.type(releaseInput, "1999");

        // Rating select (combobox)
        const ratingSelect = screen.getByRole("combobox");
        userEvent.selectOptions(ratingSelect, "10");

        // Description textarea
        const desc = screen.getByDisplayValue("A movie for testing");
        userEvent.clear(desc);
        userEvent.type(desc, "New description");

        // Click Save
        const saveBtn = screen.getByRole("button", { name: /Save/i });
        userEvent.click(saveBtn);

        expect(mockEditMovie).toHaveBeenCalledTimes(1);
        // verify editMovie called with id and an object containing the updated fields
        expect(mockEditMovie).toHaveBeenCalledWith(
            mockMovie.id,
            expect.objectContaining({
                title: "Updated Title",
                released: 1999,
                rating: 10,
                description: "New description",
            }),
        );
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });

    test("cancel calls changeEditing only", () => {
        const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
        userEvent.click(cancelBtn);
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).not.toHaveBeenCalled();
        expect(mockDeleteMovie).not.toHaveBeenCalled();
    });

    test("delete calls deleteMovie with id", () => {
        const deleteBtn = screen.getByRole("button", { name: /Delete/i });
        userEvent.click(deleteBtn);
        expect(mockDeleteMovie).toHaveBeenCalledTimes(1);
        expect(mockDeleteMovie).toHaveBeenCalledWith(mockMovie.id);
    });
});
