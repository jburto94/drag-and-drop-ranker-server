# Drag and Drop List Ranker

The backend of this project was built using Node, Express, and MongoDB. To view the frontend, please visit [here.](https://github.com/jburto94/drag-and-drop-ranker-client) 

## Why I built it

I have always had a fixation on quantifying things, especially through rankings. I wanted an easy-to-use app that let me upload lists, rank them, and then save the lists.

## What it does

This application allows user(and non-users) to upload their lists using a form, separating each item with a linebreak. Once a list is uploaded it can be edited through a drag and drop functionality. More list items can be added through another form, without clearing the current list. Non-users will be able to soft save this list and view a text version of it.

If logged in, a user is able to save these lists to their account and give each one a title. Users also can view all of their lists and choose which they want to edit or delete. 

## Other features

#### Email Verification
Each new user is required to verify their email before being able to log in successfully. This can be done after registration, when the application sends a verification link to the user's given email. Once verified, the user can use any added features.

#### Password Reset
If the user forgets their password, the application will send the user's email a verification link to reset it.

#### State persist after reload
Despite React's normal functionality, any list and list items will not disappear on reload. This is done by storing basic list data to the user's localStorage.

#### Delete list confirmation
In order for a user to delete a list, they must first confirm their actions through a custom alert box.
