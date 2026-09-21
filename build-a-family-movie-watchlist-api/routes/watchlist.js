import express from "express";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

// GET a user's watchlist
// Any authenticated user can view any user's watchlist.
router.get("/:userId", authenticate, (req, res) => {
  const { userId } = req.params;

  const watchlist = getWatchlist(Number(userId));

  if (watchlist === null) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  return res.status(200).json(watchlist);
});

// ADD a movie
router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId } = req.params;
    const { title, genre } = req.body;

    const movie = addMovie(Number(userId), {
      title,
      genre,
    });

    if (movie === null) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    return res.status(201).json(movie);
  },
);

// UPDATE a movie
router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId, movieId } = req.params;

    const updates = req.body;

    const movie = updateMovie(
      Number(userId),
      Number(movieId),
      updates,
    );

    if (movie === null) {
      return res.status(404).json({
        error: "Movie not found.",
      });
    }

    return res.status(200).json(movie);
  },
);

// DELETE a movie
router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId, movieId } = req.params;

    const deleted = deleteMovie(
      Number(userId),
      Number(movieId),
    );

    if (deleted === null) {
      return res.status(404).json({
        error: "Movie not found.",
      });
    }

    return res.status(200).json({
      message: "Movie deleted successfully.",
    });
  },
);

export default router;