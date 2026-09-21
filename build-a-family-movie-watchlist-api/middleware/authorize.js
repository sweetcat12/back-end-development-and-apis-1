export function authorizeModification(req, res, next) {
  const { role, id } = req.user;
  const { userId } = req.params;

  const isParent = role === "parent";
  const isOwnWatchlist =
    role === "child" && String(id) === String(userId);

  if (!isParent && !isOwnWatchlist) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  next();
}