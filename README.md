You are going to build a full-stack application for uploading and storing images. The main focus on this project is back-end, but you will still need to build a simple front-end.

This is a new app where people can take a picture of books they are reading or have found in antique shops/elsewhere and upload them. People can see a global feed of images.

## 🛠 Requirements:

### Front-end

1. User must be able to create an account with email/password
2. User must be able to login with email/password
3. There is a main page that displays a "feed" of all images that have been uploaded in the order they were uploaded. (similar to Facebook, Instagram posts, etc)
4. There is an Upload link at the top of the page. When the upload link is clicked, a popup modal will appear. A user can drag a single image onto the modal. The image will upload to AWS S3 and your API must handle the storage of that image URL
5. When a user uploads an image they must also give it a title
6. The front-end must connect to AWS S3 to show images on the home page. PLEASE REVIEW "Resources" and "Tips" below for more details.
7. There will be a Filter bar at the top of the "feed". When a user starts typing, the results of the "feed" will filter based on the posts title. For example, if a user types, "cat", any posts that includes the letters "cat" as part of the title will be displayed.

### Back-end

1. User accounts & authentication
2. Storing, fetching, and deleting of posts (a post has a title and an image)
3. Must have error handling
4. Must use MongoDB
5. NOTE: Please change your database "Network Access" to, "ALLOW ACCESS FROM ANYWHERE" so Devslopes can review and test your project 👍🏼 You can set this back to private after your project has been approved if you'd like.

#### Want a job? (Extra Credit)

1. Make the front-end look beautiful
2. Write unit tests for all of your endpoints
3. Make sure the front-end UI NEVER freezes
4. Show progress bars for uploads of images
5. Deploy your front-end and back-end live for all to see
