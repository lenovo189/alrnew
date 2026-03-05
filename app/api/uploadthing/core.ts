import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for our app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    thumbnailUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata);
            console.log("file url", file.url);
            return { uploadedBy: "user", url: file.url };
        }),

    courseVideoUploader: f({ video: { maxFileSize: "128MB", maxFileCount: 1 } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Video upload complete", file.url);
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
