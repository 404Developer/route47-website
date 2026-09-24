# Before & after sliders

Each project gets its own folder here, with two photos in it:

```
before-after/
  01 Basement network closet/
    before.jpg
    after.jpg
    caption.txt      (optional, one or two sentences about the job)
```

- **The folder name is the title** shown under the slider. Leading numbers (`01 `) set the order and are hidden.
- The photos must be named `before` and `after` (`.jpg`, `.png` or `.webp`, any capitalization).
- Both photos are shown in the same frame, at the same size and shape (the shape of the *after* photo), so
  for the best effect take them from the same spot with the same zoom.
- The first project is the one shown when the page loads. With more than one project, thumbnails let
  visitors flip between them.

Run `npm run photos` before committing to shrink the originals and strip GPS/location data.

Until a project is added here, the site shows the samples from `src/content/samples/before-after`.
