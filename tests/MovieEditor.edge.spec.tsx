import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";

describe("MovieEditor edge cases", () => {
    test("rounds odd rating and falls back on invalid release year", () => {
        const mockMovie: Movie = {
            id: "m-edge",
            title: "Edge",
            rating: 7, // odd rating should be rounded by Math.ceil(movie.rating/2)*2 -> 8
            description: "",
            released: 2021,
            soundtrack: [],
            watched: { seen: false, liked: false, when: null },
        };

        const mockChange = jest.fn();
        const mockEdit = jest.fn<void, [string, Movie]>();
        const mockDelete = jest.fn();

        render(
            <MovieEditor
                changeEditing={mockChange}
                movie={mockMovie}
                editMovie={mockEdit}
                deleteMovie={mockDelete}
            />,
        );

        // Check that the rating select default value was set (rounded)
        const ratingSelect = screen.getByRole<HTMLSelectElement>("combobox");
        expect(ratingSelect.value).toBe("8");

        // Enter invalid release year and click Save to trigger parseInt fallback
        const release = screen.getByRole("spinbutton");
        userEvent.clear(release);
        userEvent.type(release, "not-a-number");

        const saveBtn = screen.getByRole("button", { name: /Save/i });
        userEvent.click(saveBtn);

        // editMovie should be called with released = 0 and rating = 8
        expect(mockEdit).toHaveBeenCalledTimes(1);
        const called = mockEdit.mock.calls[0][1] as Movie;
        expect(called.released).toBe(0);
        expect(called.rating).toBe(8);
        expect(mockChange).toHaveBeenCalledTimes(1);
    });
});
