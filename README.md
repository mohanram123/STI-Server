# STI-Server
Server part for student teacher interface

## About the routes
1. get (/subjects?page=1?tags="name") - Get the paginated result
2. post (/subjects) - create a subjects
3. put(/:subname/tags) - Update subject name and tags if necessary
4. patch(/:subname/tags) - update subjects and tags
