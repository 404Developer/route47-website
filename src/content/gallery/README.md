# Job gallery photos

Drop photos of finished jobs in this folder. They show up in the **Job gallery** on the site.

- **Sub-folders become the filter buttons.** Put camera jobs in `Cameras/`, Wi-Fi jobs in `Wi-Fi/`, and so on.
- **The file name becomes the caption.** `Cameras/Driveway camera, Marengo.jpg` is captioned "Driveway camera, Marengo".
  Names straight off a phone (`IMG_2034.jpg`) are fine too; they just won't get a caption.
- **Order:** photos are sorted by file name. Start names with numbers (`01 `, `02 `, …) to set the order yourself;
  the numbers are never shown.
- Use JPG, PNG or WebP. (iPhone HEIC photos: export or AirDrop them as JPG first.)
- Big phone photos are fine. They are resized and turned into fast WebP images when the site is built, and all
  metadata, including GPS location, is stripped from what gets published.

Before committing new photos, run `npm run photos` once. It shrinks the originals and removes location data from
them too, so customers' addresses never end up in the repository.

Until at least one photo is here, the site shows the sample illustrations from `src/content/samples/gallery`.
