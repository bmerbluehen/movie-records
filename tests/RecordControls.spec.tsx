import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordControls } from "../src/components/RecordControls";

describe("RecordControls", () => {
    test("when not seen shows Mark as watched and Edit, clicking marks watched", () => {
        const setMovieWatched = jest.fn();
        const changeEditing = jest.fn();
        render(
            <RecordControls
                watched={{ seen: false, liked: false, when: null }}
                changeEditing={changeEditing}
                setMovieWatched={setMovieWatched}
            />,
        );

        const markWatched = screen.getByRole("button", {
            name: /Mark as watched/i,
        });
        userEvent.click(markWatched);
        expect(setMovieWatched).toHaveBeenCalledWith(true, false);

        const editBtn = screen.getByRole("button", { name: /Edit/i });
        userEvent.click(editBtn);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    test("when seen and liked shows Mark as unwatched and Liked, clicking toggles liked and unwatched", () => {
        const setMovieWatched = jest.fn();
        const changeEditing = jest.fn();
        render(
            <RecordControls
                watched={{ seen: true, liked: true, when: "now" }}
                changeEditing={changeEditing}
                setMovieWatched={setMovieWatched}
            />,
        );

        const markUnwatched = screen.getByRole("button", {
            name: /Mark as unwatched/i,
        });
        userEvent.click(markUnwatched);
        expect(setMovieWatched).toHaveBeenCalledWith(false, true);

        const likedBtn = screen.getByRole("button", { name: /Liked/i });
        userEvent.click(likedBtn);
        expect(setMovieWatched).toHaveBeenCalledWith(true, false);

        const editBtn = screen.getByRole("button", { name: /Edit/i });
        userEvent.click(editBtn);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    test("when seen and not liked shows Not liked button and toggles liked to true", () => {
        const setMovieWatched = jest.fn();
        const changeEditing = jest.fn();
        render(
            <RecordControls
                watched={{ seen: true, liked: false, when: "now" }}
                changeEditing={changeEditing}
                setMovieWatched={setMovieWatched}
            />,
        );

        const notLikedBtn = screen.getByRole("button", { name: /Not liked/i });
        userEvent.click(notLikedBtn);
        expect(setMovieWatched).toHaveBeenCalledWith(true, true);
    });
});
