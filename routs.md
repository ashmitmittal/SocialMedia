RESTFUL ROUTES

name     url            verb    desc.
====================================
INDEX   /posts          GET     display all the posts
NEW     /posts/new      GET     display a form to make a new post
CREATE  /posts          POST    add a new post to DB
SHOW    /posts/:id      GET     Shows info about one post

NEW     posts/:id/comments/new  GET
CREATE  posts/:id/comments      POST